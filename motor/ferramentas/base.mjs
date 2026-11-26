// Base das ferramentas do motor: caminhos e leitura da pasta de um vídeo.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
export { achar, args, duracao, rodar, sair } from "./comum.mjs";
import { sair } from "./comum.mjs";

export const MOTOR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const RAIZ = path.resolve(MOTOR, ".."); // video-prefeitura/
export const VIDEOS = path.join(RAIZ, "videos");

// Aceita o nome da pasta do vídeo (dentro de videos/) ou um caminho completo.
export function pastaDoVideo(valor) {
  if (!valor || valor === true) sair("Informe --video <pasta do vídeo>.");
  const p = fs.existsSync(valor) ? path.resolve(valor) : path.join(VIDEOS, valor);
  if (!fs.existsSync(p)) sair(`Pasta do vídeo não encontrada: ${p}`);
  return p;
}
