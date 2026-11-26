"""Gera a narração na ElevenLabs, com a voz Samuel, e grava um WAV na pasta do vídeo.

Substitui o Codex como produtor de voz. Usa a chave em ELEVENLABS_API_KEY (guardada no ambiente).

Uso (da raiz do repositório):
  python3 motor/ferramentas/narrar.py --video <pasta> --texto videos/<pasta>/trabalho/narracao.txt [--cotar]

Regras que valem aqui (as mesmas do briefing de locução):
  - Uma geração só, com o texto aprovado sem trocar palavra.
  - A tomada vem original: nada de esticar ou encurtar. O vídeo se ajusta ao áudio.
  - Uma frase por linha, com linha em branco entre os blocos, para as pausas saírem claras.
  - --cotar só mostra quantos caracteres (créditos) a geração vai gastar, sem gerar.
"""
import argparse
import json
import os
import sys
import urllib.request
import wave
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
VOZ = "F6z5r8W1ZxTsvUyVlvpG"  # Samuel - Deep & Corporate, escolhida pelo Rodrigo. Não troque.
MODELO = os.environ.get("ELEVENLABS_MODELO", "eleven_multilingual_v2")
TAXA = 44100


def sair(msg):
    sys.exit("ERRO: " + msg)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--video", required=True)
    ap.add_argument("--texto", required=True, help="arquivo com o texto aprovado")
    ap.add_argument("--saida", default="midia/audio/locucao.wav")
    ap.add_argument("--cotar", action="store_true")
    a = ap.parse_args()

    video = Path(a.video) if Path(a.video).exists() else RAIZ / "videos" / a.video
    if not video.is_dir():
        sair(f"pasta do vídeo não encontrada: {a.video}")
    texto = Path(a.texto).read_text(encoding="utf-8").strip()
    if not texto:
        sair("texto vazio")
    print(f"{len(texto)} caracteres, cerca de {len(texto.split())} palavras, voz Samuel, modelo {MODELO}")
    if a.cotar:
        return

    chave = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    if not chave:
        sair("falta ELEVENLABS_API_KEY no ambiente. Veja o README, seção 'Preparar o ambiente'.")
    saida = video / a.saida
    if saida.exists():
        sair(f"{saida} já existe. Não gere de novo sem necessidade: apague o arquivo só se a tomada saiu vazia, cortada ou no idioma errado.")

    corpo = json.dumps({
        "text": texto,
        "model_id": MODELO,
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75, "style": 0.15, "use_speaker_boost": True},
    }).encode()
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOZ}?output_format=pcm_{TAXA}"
    req = urllib.request.Request(url, data=corpo, method="POST",
                                 headers={"xi-api-key": chave, "Content-Type": "application/json", "Accept": "audio/pcm"})
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            pcm = r.read()
    except urllib.error.HTTPError as e:
        sair(f"ElevenLabs respondeu {e.code}: {e.read().decode(errors='replace')[:800]}")
    except urllib.error.URLError as e:
        sair(f"sem conexão com a ElevenLabs ({e.reason}). O ambiente precisa liberar api.elevenlabs.io na rede.")
    if len(pcm) < TAXA:  # menos de meio segundo
        sair("a ElevenLabs devolveu um áudio vazio ou curto demais")

    saida.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(saida), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(TAXA)
        w.writeframes(pcm)
    seg = len(pcm) / 2 / TAXA
    print(f"{saida}  {seg:.1f} s")
    ficha = video / "trabalho" / "narracao-ficha.md"
    ficha.parent.mkdir(parents=True, exist_ok=True)
    ficha.write_text(f"# Narração\n\n- Voz: Samuel ({VOZ})\n- Modelo: {MODELO}\n- Duração: {seg:.1f} s\n"
                     f"- Caracteres cobrados: {len(texto)}\n- Arquivo: {a.saida}\n", encoding="utf-8")


if __name__ == "__main__":
    main()
