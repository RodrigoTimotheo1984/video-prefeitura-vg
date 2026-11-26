// Converte um plano bruto (vídeo ou foto) para o padrão do motor e grava em <vídeo>/midia/clips/.
// Vídeo: 1080x1920 a 30 qps com a cor padronizada, mais uma tira de 6 quadros para ver o movimento.
// Foto: recorte vertical 1620x2880 (folga para o zoom) com a mesma cor.
// A origem não é alterada.
//
// Uso:  node motor/ferramentas/converter.mjs --video 2026-11-24_assunto --origem "H:/.../IMG_1950.MOV" --nome PATROL_A
import fs from "node:fs";
import path from "node:path";
import { achar, args, duracao, pastaDoVideo, rodar, sair } from "./base.mjs";

const a = args();
if (!a.origem || !a.nome) sair('Use: --video <pasta> --origem "arquivo" --nome NOME');
if (!fs.existsSync(a.origem)) sair(`Origem não encontrada: ${a.origem}`);
const video = pastaDoVideo(a.video);
const ffmpeg = achar("ffmpeg");
const ffprobe = achar("ffprobe");
const clips = path.join(video, "midia", "clips");
const tiras = path.join(video, "trabalho", "tiras");
fs.mkdirSync(clips, { recursive: true });
fs.mkdirSync(tiras, { recursive: true });

// Tratamento de cor único: contraste e saturação leves, tom um pouco quente, nitidez suave.
const cor = "eq=contrast=1.08:saturation=1.16:gamma=0.97,colorbalance=rm=0.025:bm=-0.03:rh=0.01:bh=-0.01,unsharp=5:5:0.35";
const foto = /\.(jpe?g|png|webp|heic)$/i.test(a.origem);

if (foto) {
  const saida = path.join(clips, `${a.nome}.jpg`);
  rodar(ffmpeg, ["-v", "error", "-y", "-i", a.origem, "-frames:v", "1",
    "-vf", `scale=1620:2880:force_original_aspect_ratio=increase,crop=1620:2880,${cor}`, "-pix_fmt", "yuvj420p", "-q:v", "2", saida]);
  console.log(`${a.nome}.jpg (foto)  ->  ${saida}`);
  console.log(`no video.json: { "arquivo": "clips/${a.nome}.jpg" }`);
} else {
  const saida = path.join(clips, `${a.nome}.mp4`);
  rodar(ffmpeg, ["-v", "error", "-y", "-i", a.origem, "-an",
    "-vf", `scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,${cor},format=yuv420p`,
    "-c:v", "libx264", "-crf", "15", "-preset", "medium", "-movflags", "+faststart", saida]);
  const d = duracao(ffprobe, saida);
  const tira = path.join(tiras, `${a.nome}.jpg`);
  rodar(ffmpeg, ["-v", "error", "-y", "-i", saida, "-vf", `fps=${(6 / Math.max(d, 0.5)).toFixed(4)},scale=220:-2,tile=6x1`,
    "-frames:v", "1", "-pix_fmt", "yuvj420p", "-q:v", "4", tira]);
  console.log(`${a.nome}.mp4  ${d.toFixed(1)} s  ->  ${saida}`);
  console.log(`tira de quadros: ${tira}`);
  console.log(`no video.json: { "arquivo": "clips/${a.nome}.mp4", "inicio": 0 }`);
}
