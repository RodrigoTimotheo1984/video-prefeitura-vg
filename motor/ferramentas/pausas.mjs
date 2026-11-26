// Mede as pausas de uma narração, para cortar o áudio entre as frases e sincronizar os blocos.
// Mostra cada pausa em segundos e o quadro (a 30 qps) do MEIO da pausa: é ali que se corta.
//
// Uso:  node motor/ferramentas/pausas.mjs --audio videos/<vídeo>/midia/audio/locucao.wav [--minimo 0.22] [--ruido -35]
import fs from "node:fs";
import { achar, args, duracao, rodar, sair } from "./comum.mjs";

const a = args();
if (!a.audio) sair("Use: node ferramentas/pausas.mjs --audio arquivo");
if (!fs.existsSync(a.audio)) sair(`Áudio não encontrado: ${a.audio}`);
const minimo = parseFloat(a.minimo ?? "0.22");
const ruido = parseInt(a.ruido ?? "-35", 10);
const ffmpeg = achar("ffmpeg");
const dur = duracao(achar("ffprobe"), a.audio);

const r = rodar(ffmpeg, ["-hide_banner", "-nostats", "-i", a.audio, "-af", `silencedetect=noise=${ruido}dB:d=${minimo}`, "-f", "null", "-"]);
const ini = [...r.stderr.matchAll(/silence_start:\s*([\d.]+)/g)].map((m) => parseFloat(m[1]));
const fim = [...r.stderr.matchAll(/silence_end:\s*([\d.]+)/g)].map((m) => parseFloat(m[1]));

console.log(`duração: ${dur.toFixed(2)} s = ${Math.round(dur * 30)} quadros`);
console.log("pausa  início_s   fim_s  meio_s  quadro_do_corte");
ini.forEach((s, i) => {
  const f = fim[i] ?? dur;
  const m = (s + f) / 2;
  console.log(`${String(i + 1).padStart(5)}  ${s.toFixed(2).padStart(8)}  ${f.toFixed(2).padStart(6)}  ${m.toFixed(2).padStart(6)}  ${String(Math.round(m * 30)).padStart(6)}`);
});
if (!ini.length) console.log("Nenhuma pausa encontrada. Tente --minimo 0.15 ou --ruido -30.");
