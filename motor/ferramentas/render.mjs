// Confere o video.json, renderiza e gera a folha de conferência.
//
// Prévia (meia resolução, rápida):   node motor/ferramentas/render.mjs --video <pasta> --previa
// Final (1080x1920, ~8 Mbps, -14 LUFS): node motor/ferramentas/render.mjs --video <pasta> --nome AAAA-MM-DD_assunto_reels_v1
// Só conferir os dados, sem renderizar: node motor/ferramentas/render.mjs --video <pasta> --conferir
//
// Se a pasta do vídeo tiver Cenas.tsx (exportando "Video" e "total"), ele é usado no lugar da composição padrão.
// Saída em <vídeo>/saida. A folha de conferência tem 16 quadros espalhados pelo vídeo.
//
// Trava de imagens (vídeos a partir de 2026-11-26; pastas que começam com "_" são testes e ficam de fora):
// exige <vídeo>/trabalho/imagens.md com a tabela "Planos escolhidos", cada plano presente em midia/ e usado
// no video.json ou no Cenas.tsx. Vídeo sem nenhum plano só passa com "semAcervo" no video.json, que guarda o
// sim explícito de quem opera para seguir sem imagens do acervo. Não afrouxe esta trava para um vídeo passar.
import fs from "node:fs";
import path from "node:path";
import { RAIZ, achar, args, duracao, pastaDoVideo, rodar, sair } from "./base.mjs";

const a = args();
const video = pastaDoVideo(a.video);
const json = path.join(video, "video.json");
if (!fs.existsSync(json)) sair(`Falta ${json}`);
let dados;
try { dados = JSON.parse(fs.readFileSync(json, "utf8")); } catch (e) { sair(`video.json inválido: ${e.message}`); }

// ---- conferência dos dados ----
const midia = path.join(video, "midia");
const erros = [];
const avisos = [];
const existe = (rel, onde) => { if (!fs.existsSync(path.join(midia, rel))) erros.push(`${onde}: arquivo não está em midia/: ${rel}`); };
if (!Array.isArray(dados.cenas) || !dados.cenas.length) erros.push("cenas: lista vazia");
let t = 0;
const inicios = [];
(dados.cenas ?? []).forEach((c, i) => {
  const onde = `cena ${i + 1} (${c.tipo})`;
  inicios.push(t);
  if (!Number.isInteger(c.duracao) || c.duracao < 30) erros.push(`${onde}: duracao precisa ser inteiro de pelo menos 30 quadros`);
  t += c.duracao || 0;
  (c.midia ?? []).forEach((m) => existe(m.arquivo, onde));
  if (c.tipo !== "fechamento" && !(c.midia ?? []).length) avisos.push(`${onde}: sem imagem; vai usar fundo da marca`);
  if (c.tipo === "servico" && (c.locais ?? []).length > 3) avisos.push(`${onde}: mais de 3 locais pode sair da área segura`);
  if (c.tipo === "info" && (c.itens ?? []).length > 3) avisos.push(`${onde}: mais de 3 itens pode sair da área segura`);
});
if (dados.cenas?.at(-1)?.tipo !== "fechamento") avisos.push("a última cena não é o fechamento com a assinatura");
if (dados.vo?.trechos?.length) {
  existe(dados.vo.arquivo, "narração");
  let fimAnterior = -1;
  dados.vo.trechos.forEach((x, i) => {
    if (x.ate <= x.de) erros.push(`narração, trecho ${i + 1}: 'ate' precisa ser maior que 'de'`);
    if (x.em <= fimAnterior) erros.push(`narração, trecho ${i + 1}: entra antes de o anterior terminar`);
    fimAnterior = x.em + (x.ate - x.de);
  });
  if (fimAnterior > t) erros.push(`narração termina no quadro ${fimAnterior}, depois do fim do vídeo (${t})`);
}
if (dados.trilha?.arquivo) existe(dados.trilha.arquivo, "trilha");

// ---- trava de imagens do acervo ----
const nomePasta = path.basename(video);
const dataPasta = /^(\d{4}-\d{2}-\d{2})_/.exec(nomePasta)?.[1];
const ehTeste = nomePasta.startsWith("_");
if (!ehTeste && !(dataPasta && dataPasta < "2026-11-26")) {
  const ficha = path.join(video, "trabalho", "imagens.md");
  const semAcervo = typeof dados.semAcervo === "string" && dados.semAcervo.trim().length >= 3;
  if (!fs.existsSync(ficha)) {
    erros.push("falta trabalho/imagens.md, a ficha de imagens (etapa 4 da skill): pastas do drive abertas, arquivos examinados e planos escolhidos");
  } else {
    const texto = fs.readFileSync(ficha, "utf8");
    const secao = /^##\s*Planos escolhidos\s*$([\s\S]*?)(?=^##\s|(?![\s\S]))/im.exec(texto)?.[1] ?? "";
    const planos = secao.split(/\r?\n/)
      .filter((l) => /^\s*\|/.test(l) && !/^\s*\|[\s\-:|]+\|\s*$/.test(l))
      .map((l) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim().replace(/^`|`$/g, "")))
      .filter((cels) => cels.length >= 2 && !/^arquivo em midia/i.test(cels.at(-1)) && cels.at(-1))
      .map((cels) => cels.at(-1).replace(/^midia[\\/]/, "").replace(/\\/g, "/"));
    if (!/^##\s*Pastas abertas/im.test(texto)) erros.push("trabalho/imagens.md: falta a seção 'Pastas abertas'");
    if (!/^##\s*Arquivos examinados/im.test(texto)) erros.push("trabalho/imagens.md: falta a seção 'Arquivos examinados'");
    if (!planos.length && !semAcervo) {
      erros.push("trabalho/imagens.md sem nenhum plano escolhido. Escolha planos do acervo ou, se nenhum servir, pergunte a quem opera se pode seguir sem imagens e registre o sim em \"semAcervo\" no video.json");
    }
    if (planos.length) {
      const cenasTsx = path.join(video, "Cenas.tsx");
      const usado = JSON.stringify(dados) + (fs.existsSync(cenasTsx) ? fs.readFileSync(cenasTsx, "utf8") : "");
      planos.forEach((rel) => {
        if (!fs.existsSync(path.join(midia, rel))) erros.push(`plano da ficha não está em midia/: ${rel}`);
        else if (!usado.includes(rel) && !usado.includes(path.basename(rel))) erros.push(`plano da ficha não é usado no video.json nem no Cenas.tsx: ${rel}`);
      });
      console.log(`ficha de imagens: ${planos.length} plano(s) escolhido(s)`);
    } else if (semAcervo) {
      avisos.push(`vídeo sem imagens do acervo, aprovado por quem opera: ${dados.semAcervo}`);
    }
  }
}
console.log(`${path.basename(video)}: ${dados.cenas?.length ?? 0} cenas, ${t} quadros = ${(t / 30).toFixed(1)} s`);
console.log(`cortes nos quadros: ${inicios.slice(1).join(", ")}`);
avisos.forEach((m) => console.log("AVISO: " + m));
if (erros.length) sair("video.json com problemas:\n- " + erros.join("\n- "));
if (a.conferir) process.exit(0);
if (!a.previa && (!a.nome || a.nome === true)) sair("Informe --nome para o render final, ou use --previa.");

// ---- entrada do Remotion para este vídeo ----
const proprio = fs.existsSync(path.join(video, "Cenas.tsx"));
const rel = path.relative(video, path.join(RAIZ, "motor", "src")).split(path.sep).join("/");
fs.writeFileSync(path.join(video, "_entrada.tsx"), `// Gerado por render.mjs. Não edite.
import React from "react";
import { Composition, registerRoot } from "remotion";
import dados from "./video.json";
${proprio ? 'import { Video, total } from "./Cenas";' : `import { Padrao as Video, total } from "${rel}/Padrao";`}

const Raiz: React.FC = () => (
  <Composition id="Reels" component={Video as any} defaultProps={{ dados: dados as any }}
    durationInFrames={total(dados as any)} fps={30} width={1080} height={1920} />
);
registerRoot(Raiz);
`);

const pkg = path.join(RAIZ, "node_modules", "@remotion", "cli", "package.json");
if (!fs.existsSync(pkg)) sair(`Rode 'npm install' em ${RAIZ} antes.`);
const bin = JSON.parse(fs.readFileSync(pkg, "utf8")).bin;
const cli = path.join(path.dirname(pkg), typeof bin === "string" ? bin : bin.remotion);
const ffmpeg = achar("ffmpeg");
const ffprobe = achar("ffprobe");
// Navegador do render: o Remotion baixa o dele na primeira vez. Onde esse download é bloqueado (nuvem com rede
// restrita), usa o Chrome indicado em VIDEO_CHROME ou um Chrome já instalado na máquina.
const navegador = [];
const chrome = process.env.VIDEO_CHROME || ["/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"].find((p) => fs.existsSync(p));
if (chrome && process.platform !== "win32") navegador.push(`--browser-executable=${chrome}`);
const saida = path.join(video, "saida");
fs.mkdirSync(saida, { recursive: true });
fs.mkdirSync(midia, { recursive: true });
const remotion = (arquivo, extras) =>
  rodar(process.execPath, [cli, "render", path.join(video, "_entrada.tsx"), "Reels", arquivo, "--codec=h264", "--log=error",
    `--public-dir=${midia}`, ...navegador, ...extras], { cwd: RAIZ, stdio: "inherit" });

let final, folha;
if (a.previa) {
  final = path.join(saida, "_previa.mp4");
  folha = path.join(saida, "_previa_folha.jpg");
  remotion(final, ["--crf=22", "--scale=0.5"]);
} else {
  const bruto = path.join(saida, "_render.mp4");
  final = path.join(saida, `${a.nome}.mp4`);
  folha = path.join(saida, `${a.nome}_folha.jpg`);
  remotion(bruto, ["--crf=15", "--audio-bitrate=192k"]);
  const temAudio = dados.vo?.trechos?.length || dados.trilha?.arquivo;
  const imagem = ["-c:v", "libx264", "-preset", "slow", "-b:v", "8M", "-maxrate", "10M", "-bufsize", "16M", "-pix_fmt", "yuv420p"];
  const som = temAudio ? ["-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "192k", "-ar", "48000"] : ["-an"];
  rodar(ffmpeg, ["-v", "error", "-y", "-i", bruto, ...imagem, ...som, "-movflags", "+faststart", final]);
  fs.rmSync(bruto, { force: true });
}
if (!fs.existsSync(final)) sair("Vídeo não gerado.");

const passo = Math.max(1, Math.floor(t / 16));
rodar(ffmpeg, ["-v", "error", "-y", "-i", final, "-vf",
  `select='not(mod(n-${Math.floor(passo / 2)},${passo}))',scale=240:-2,tile=8x2`,
  "-frames:v", "1", "-fps_mode", "passthrough", "-pix_fmt", "yuvj420p", "-q:v", "3", folha]);
console.log(`${final}  ${duracao(ffprobe, final).toFixed(1)} s  ${(fs.statSync(final).size / 1048576).toFixed(1)} MB`);
console.log(`folha de conferência: ${folha}`);
