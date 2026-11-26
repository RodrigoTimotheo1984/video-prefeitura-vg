#!/usr/bin/env bash
# Prepara a máquina da nuvem para o motor de vídeos. Roda sozinho no início de cada sessão do
# Claude Code na web (gancho em .claude/settings.json) e pode ser rodado à mão: bash scripts/preparar.sh
# Pode rodar quantas vezes quiser: o que já está pronto é pulado.
set -u
cd "$(dirname "$0")/.."
ok() { echo "ok  $*"; }
falta() { echo "FALTA  $*"; }

# 1. Node e o Remotion
if [ ! -d node_modules/@remotion/cli ]; then npm ci --no-audit --no-fund --loglevel=error >/dev/null 2>&1 && ok "Remotion instalado" || falta "npm ci falhou (rode 'npm ci' para ver o erro)"; else ok "Remotion"; fi

# 2. ffmpeg e ffprobe
if ! command -v ffmpeg >/dev/null 2>&1; then
  (apt-get install -y -qq ffmpeg >/dev/null 2>&1 || sudo apt-get install -y -qq ffmpeg >/dev/null 2>&1) && ok "ffmpeg instalado" || falta "ffmpeg (apt-get install ffmpeg)"
else ok "ffmpeg"; fi

# 3. Python com Pillow (garimpo.py) e rclone (Drive), os dois pelo pip
python3 -c "import PIL" 2>/dev/null || pip install -q pillow >/dev/null 2>&1
python3 -c "import PIL" 2>/dev/null && ok "Pillow" || falta "Pillow (pip install pillow)"
command -v rclone >/dev/null 2>&1 || pip install -q rclone-bin >/dev/null 2>&1
command -v rclone >/dev/null 2>&1 && ok "rclone" || falta "rclone (pip install rclone-bin)"

# 4. Navegador do render: o do Remotion, ou um Chrome da máquina
if find node_modules/.remotion/chrome-headless-shell -name "chrome-headless-shell" -type f 2>/dev/null | grep -q .; then ok "navegador do Remotion"
elif [ -n "${VIDEO_CHROME:-}" ] || [ -x /usr/bin/google-chrome ] || [ -x /usr/bin/chromium ]; then ok "Chrome da máquina"
else npx remotion browser ensure >/dev/null 2>&1 && ok "navegador do Remotion baixado" || falta "navegador (libere remotion.media na rede do ambiente)"; fi

# 5. Chaves
[ -n "${DRIVE_TOKEN:-}" ] && ok "DRIVE_TOKEN" || falta "DRIVE_TOKEN (acesso ao Drive; veja o README)"
[ -n "${ELEVENLABS_API_KEY:-}" ] && ok "ELEVENLABS_API_KEY" || falta "ELEVENLABS_API_KEY (narração; veja o README)"
exit 0
