"""Garimpo de imagens: inventaria videos brutos e monta folhas de quadros para escolher planos.

Somente leitura nas pastas de origem. Tudo e gravado na pasta de saida.

Uso:
  python garimpo.py --saida ../trabalho/garimpo "tapa-buraco=H:/Meu Drive/.../Operacao Tapa Buraco" "drenagem=H:/.../Drenagem"

Cada argumento e  bloco=pasta . Pode repetir o mesmo bloco com pastas diferentes.
Para cada video (ate --max-mb): duracao, resolucao e 1 quadro do meio.
Gera  folhas/<bloco>_NN.jpg  (grade 5x4, cada quadro com um codigo) e  inventario.csv .
Requer ffmpeg e ffprobe no PATH e a biblioteca Pillow (pip install pillow).
"""
import argparse
import csv
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

EXT = {".mov", ".mp4", ".m4v"}
THUMB_W, COLS, ROWS, CELL_H = 384, 5, 4, 400


def achar(nome):
    local = Path(__file__).resolve().parent.parent / "bin" / (nome + (".exe" if os.name == "nt" else ""))
    if local.exists():  # copia que acompanha o motor
        return str(local)
    exe = shutil.which(nome)
    if not exe:
        for p in (f"/opt/homebrew/bin/{nome}", f"/usr/local/bin/{nome}"):
            if Path(p).exists():
                return p
        local = os.environ.get("LOCALAPPDATA")  # Windows: instalado pelo winget, terminal ainda sem o PATH novo
        if local:
            achados = sorted((Path(local) / "Microsoft" / "WinGet" / "Packages").glob(f"*/*/bin/{nome}.exe"))
            if achados:
                return str(achados[-1])
        sys.exit(f"{nome} nao encontrado. Mac: brew install ffmpeg. Windows: winget install Gyan.FFmpeg (e abra um terminal novo).")
    return exe


def duracao(ffprobe, f):
    r = subprocess.run([ffprobe, "-v", "error", "-show_entries", "format=duration", "-of", "json", str(f)],
                       capture_output=True, text=True, timeout=180)
    return float(json.loads(r.stdout or "{}").get("format", {}).get("duration", 0) or 0)


def quadro(ffmpeg, f, t, out):
    subprocess.run([ffmpeg, "-v", "error", "-y", "-ss", f"{t:.2f}", "-i", str(f), "-frames:v", "1",
                    "-vf", f"scale={THUMB_W}:-2", "-pix_fmt", "yuvj420p", "-q:v", "4", str(out)],
                   capture_output=True, timeout=300)
    return out.exists()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--saida", required=True)
    ap.add_argument("--max-mb", type=float, default=150, help="pula videos maiores que isso")
    ap.add_argument("pastas", nargs="+", help="bloco=pasta")
    a = ap.parse_args()

    ffmpeg, ffprobe = achar("ffmpeg"), achar("ffprobe")
    out = Path(a.saida)
    (out / "folhas").mkdir(parents=True, exist_ok=True)
    tmp = out / "_quadros"
    tmp.mkdir(exist_ok=True)
    font = ImageFont.load_default()
    for nome in ("arialbd.ttf", "/System/Library/Fonts/Supplemental/Arial Bold.ttf", "/Library/Fonts/Arial Bold.ttf",
                 "/System/Library/Fonts/Helvetica.ttc", "DejaVuSans-Bold.ttf"):
        try:
            font = ImageFont.truetype(nome, 20)
            break
        except OSError:
            continue

    blocos = {}
    for item in a.pastas:
        bloco, _, pasta = item.partition("=")
        if not pasta:
            sys.exit(f"Argumento invalido: {item!r}. Use bloco=pasta.")
        blocos.setdefault(bloco.strip(), []).append(Path(pasta.strip()))

    linhas = []
    for bloco, pastas in blocos.items():
        itens = []
        for raiz in pastas:
            if not raiz.exists():
                print(f"AVISO: pasta nao encontrada: {raiz}", flush=True)
                continue
            for f in sorted(raiz.rglob("*")):
                if f.suffix.lower() not in EXT:
                    continue
                mb = f.stat().st_size / 1e6
                if mb > a.max_mb:
                    linhas.append([bloco, "", str(f), round(mb, 1), "", "", "", "pulado: grande"])
                else:
                    itens.append((f, mb))
        prefixo = "".join(c for c in bloco.upper() if c.isalnum())[:3] or "BLO"
        for i, (f, mb) in enumerate(itens, 1):
            cod = f"{prefixo}{i:03d}"
            try:
                dur = duracao(ffprobe, f)
                jpg = tmp / f"{cod}.jpg"
                ok = quadro(ffmpeg, f, dur / 2, jpg)
                res = orient = ""
                if ok:
                    with Image.open(jpg) as im:  # orientacao real, ja com a rotacao aplicada
                        orient = "vertical" if im.height > im.width else "horizontal"
                        res = f"{im.width}x{im.height} (miniatura)"
                linhas.append([bloco, cod, str(f), round(mb, 1), round(dur, 1), orient, res, "" if ok else "sem quadro"])
            except Exception as e:  # registra e segue
                linhas.append([bloco, cod, str(f), round(mb, 1), "", "", "", f"erro: {e}"])
            print(cod, f.name, flush=True)

        feitos = [l for l in linhas if l[0] == bloco and l[1] and (tmp / f"{l[1]}.jpg").exists()]
        por = COLS * ROWS
        for n in range(0, len(feitos), por):
            folha = Image.new("RGB", (COLS * THUMB_W, ROWS * CELL_H), (20, 20, 20))
            dr = ImageDraw.Draw(folha)
            for k, l in enumerate(feitos[n:n + por]):
                im = Image.open(tmp / f"{l[1]}.jpg")
                im.thumbnail((THUMB_W - 8, CELL_H - 34))
                x, y = (k % COLS) * THUMB_W, (k // COLS) * CELL_H
                folha.paste(im, (x + (THUMB_W - im.width) // 2, y + 30))
                dr.text((x + 6, y + 4), f"{l[1]}  {l[4]}s  {l[5]}", fill=(255, 220, 0), font=font)
            folha.save(out / "folhas" / f"{bloco}_{n // por + 1:02d}.jpg", quality=80)

    with open(out / "inventario.csv", "w", newline="", encoding="utf-8-sig") as fh:
        w = csv.writer(fh, delimiter=";")
        w.writerow(["bloco", "codigo", "arquivo", "mb", "duracao_s", "orientacao", "resolucao", "obs"])
        w.writerows(linhas)
    print("FIM", len(linhas), "videos. Folhas em", out / "folhas")


if __name__ == "__main__":
    main()
