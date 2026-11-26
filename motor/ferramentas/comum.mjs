// Funções comuns das ferramentas. Rodam igual em Mac e Windows (só precisam do Node).
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const MODELO = path.join(KIT, "modelo");

// Lê argumentos no formato --nome valor (ou --nome sozinho, que vira true).
export function args() {
  const a = {};
  const v = process.argv.slice(2);
  for (let i = 0; i < v.length; i++) {
    if (!v[i].startsWith("--")) continue;
    const k = v[i].slice(2);
    a[k] = i + 1 < v.length && !v[i + 1].startsWith("--") ? v[++i] : true;
  }
  return a;
}

export function sair(msg) {
  console.error("ERRO: " + msg);
  process.exit(1);
}

function procurar(dir, nome, nivel) {
  if (nivel < 0 || !fs.existsSync(dir)) return null;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isFile() && e.name.toLowerCase() === nome) return p;
    if (e.isDirectory()) {
      const r = procurar(p, nome, nivel - 1);
      if (r) return r;
    }
  }
  return null;
}

// Acha ffmpeg/ffprobe: no PATH, no Homebrew (Mac) ou na pasta do winget (Windows).
export function achar(nome) {
  // 1º: a cópia que acompanha o motor (motor/bin), para funcionar igual no Claude e no Codex
  const local = path.join(KIT, "bin", process.platform === "win32" ? `${nome}.exe` : nome);
  if (fs.existsSync(local)) return local;
  if (spawnSync(nome, ["-version"], { encoding: "utf8" }).status === 0) return nome;
  for (const p of [`/opt/homebrew/bin/${nome}`, `/usr/local/bin/${nome}`]) if (fs.existsSync(p)) return p;
  if (process.platform === "win32" && process.env.LOCALAPPDATA) {
    const r = procurar(path.join(process.env.LOCALAPPDATA, "Microsoft", "WinGet", "Packages"), `${nome}.exe`, 4);
    if (r) return r;
  }
  sair(`${nome} não encontrado. Mac: brew install ffmpeg. Windows: winget install Gyan.FFmpeg (e abra um terminal novo).`);
}

// Roda um programa e devolve a saída; para com o erro exato se falhar.
export function rodar(cmd, argv, opcoes = {}) {
  const r = spawnSync(cmd, argv, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, ...opcoes });
  if (r.error) sair(`${cmd}: ${r.error.message}`);
  if (r.status !== 0 && !opcoes.tolerar) sair(`${path.basename(cmd)} falhou:\n${(r.stderr || r.stdout || "").trim().slice(-1500)}`);
  return r;
}

export function duracao(ffprobe, arquivo) {
  const r = rodar(ffprobe, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", arquivo]);
  return parseFloat(r.stdout.trim()) || 0;
}
