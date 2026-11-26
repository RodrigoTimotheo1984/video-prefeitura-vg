"""Google Drive da MA Digital: listar e baixar brutos, entregar o vídeo e as prévias com link.

Usa o rclone com o acesso da conta drivemadigital, guardado no ambiente em DRIVE_TOKEN
(o JSON que o "rclone authorize drive" devolve). Nada de senha no código.

Um "alvo" pode ser:
  - um link do Drive (pasta ou arquivo), por exemplo https://drive.google.com/drive/folders/1AbC...
  - o ID da pasta ou do arquivo
  - um caminho dentro do Meu Drive, por exemplo "2026 - PREFEITURA VG/11 - NOVEMBRO/Pauta X"

Uso (rodando da raiz do repositório):
  python3 motor/ferramentas/drive.py listar  <alvo>
  python3 motor/ferramentas/drive.py baixar  <alvo> <pasta local> [--max-mb 2000]
  python3 motor/ferramentas/drive.py enviar  --video <pasta do vídeo> <arquivo> [<arquivo> ...]
  python3 motor/ferramentas/drive.py entregar --video <pasta do vídeo>

"enviar" sobe prévias (trilha, vídeo, folha) para a pasta de entrega do vídeo e mostra o link de cada uma.
"entregar" sobe o vídeo final, a folha e o arquivo de créditos, e mostra o link da pasta.
A pasta de entrega fica em DRIVE_ENTREGAS (padrão "ENTREGAS VIDEOS PREFEITURA") / <nome da pasta do vídeo>.

O Drive de brutos é somente leitura: este script só copia de lá. Ele nunca move, renomeia nem apaga.
"""
import argparse
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
VIDEOS = RAIZ / "videos"
ENTREGAS = os.environ.get("DRIVE_ENTREGAS", "ENTREGAS VIDEOS PREFEITURA")


def sair(msg):
    sys.exit("ERRO: " + msg)


def ambiente():
    token = os.environ.get("DRIVE_TOKEN", "").strip()
    if not token:
        sair("falta DRIVE_TOKEN no ambiente (o acesso ao Drive). Veja o README, seção 'Preparar o ambiente'.")
    if not shutil.which("rclone"):
        sair("rclone não instalado. Rode: bash scripts/preparar.sh")
    env = dict(os.environ)
    env.update({
        "RCLONE_CONFIG_DRIVE_TYPE": "drive",
        "RCLONE_CONFIG_DRIVE_SCOPE": "drive",
        "RCLONE_CONFIG_DRIVE_TOKEN": token,
    })
    return env


def rclone(*argv, captura=True):
    r = subprocess.run(["rclone", *argv], env=ambiente(), capture_output=captura, text=True)
    if r.returncode != 0:
        sair(f"rclone {argv[0]} falhou:\n" + ((r.stderr or r.stdout or "").strip()[-1500:] if captura else ""))
    return r.stdout if captura else ""


def id_do_link(alvo):
    for padrao in (r"/folders/([\w-]{10,})", r"/file/d/([\w-]{10,})", r"[?&]id=([\w-]{10,})"):
        m = re.search(padrao, alvo)
        if m:
            return m.group(1)
    if re.fullmatch(r"[\w-]{25,}", alvo):
        return alvo
    return None


def eh_pasta(fid):
    try:
        out = rclone("lsjson", "--stat", f"--drive-root-folder-id={fid}", "drive:")
        return json.loads(out).get("IsDir", True)
    except SystemExit:
        return False


def remoto(alvo):
    """Devolve (argumentos extras, caminho remoto, é_arquivo_por_id)."""
    fid = id_do_link(alvo)
    if fid:
        if eh_pasta(fid):
            return [f"--drive-root-folder-id={fid}"], "drive:", None
        return [], "drive:", fid
    return [], "drive:" + alvo.strip("/"), None


def pasta_video(valor):
    p = Path(valor)
    if not p.exists():
        p = VIDEOS / valor
    if not p.is_dir():
        sair(f"pasta do vídeo não encontrada: {valor}")
    return p


def link_pasta(caminho):
    info = json.loads(rclone("lsjson", "--stat", "drive:" + caminho))
    return f"https://drive.google.com/drive/folders/{info['ID']}"


def link_arquivo(caminho):
    info = json.loads(rclone("lsjson", "--stat", "drive:" + caminho))
    return f"https://drive.google.com/file/d/{info['ID']}/view"


def listar(a):
    extra, rem, fid = remoto(a.alvo)
    if fid:
        sair("isso é um arquivo, não uma pasta. Use 'baixar'.")
    print(rclone("lsf", "-R", "--format", "sp", "--separator", "  |  ", *extra, rem), end="")


def baixar(a):
    destino = Path(a.destino)
    destino.mkdir(parents=True, exist_ok=True)
    extra, rem, fid = remoto(a.alvo)
    if fid:
        rclone("backend", "copyid", "drive:", fid, str(destino) + "/", captura=False)
    else:
        rclone("copy", *extra, rem, str(destino), f"--max-size={a.max_mb}M", "--transfers=4", "--stats=30s",
               "--stats-one-line", "-v", captura=False)
    pulados = rclone("lsf", "-R", "--files-only", f"--min-size={a.max_mb}M", *extra, rem) if not fid else ""
    print(f"baixado em {destino}")
    if pulados.strip():
        print(f"AVISO: arquivos acima de {a.max_mb} MB não foram baixados:\n{pulados}")


def subir(video, arquivos, sub=""):
    destino = f"{ENTREGAS}/{video.name}" + (f"/{sub}" if sub else "")
    for arq in arquivos:
        f = Path(arq)
        if not f.is_absolute() and not f.exists():
            f = video / arq
        if not f.exists():
            sair(f"arquivo não encontrado: {arq}")
        rclone("copyto", str(f), f"drive:{destino}/{f.name}")
        print(f"{f.name}: {link_arquivo(f'{destino}/{f.name}')}")
    return destino


def enviar(a):
    video = pasta_video(a.video)
    subir(video, a.arquivos, "previas")


def entregar(a):
    video = pasta_video(a.video)
    saida = video / "saida"
    finais = sorted(p for p in saida.glob("*.mp4") if not p.name.startswith("_"))
    if not finais:
        sair("não há vídeo final em saida/ (rode o render com --nome antes).")
    ultimo = max(finais, key=lambda p: p.stat().st_mtime)
    arquivos = [ultimo]
    folha = saida / f"{ultimo.stem}_folha.jpg"
    if folha.exists():
        arquivos.append(folha)
    creditos = video / "trabalho" / "entrega.md"
    if creditos.exists():
        arquivos.append(creditos)
    destino = subir(video, arquivos)
    print(f"\nPASTA DA ENTREGA: {link_pasta(destino)}")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("listar"); p.add_argument("alvo"); p.set_defaults(f=listar)
    p = sub.add_parser("baixar"); p.add_argument("alvo"); p.add_argument("destino")
    p.add_argument("--max-mb", type=int, default=2000); p.set_defaults(f=baixar)
    p = sub.add_parser("enviar"); p.add_argument("--video", required=True); p.add_argument("arquivos", nargs="+")
    p.set_defaults(f=enviar)
    p = sub.add_parser("entregar"); p.add_argument("--video", required=True); p.set_defaults(f=entregar)
    a = ap.parse_args()
    a.f(a)


if __name__ == "__main__":
    main()
