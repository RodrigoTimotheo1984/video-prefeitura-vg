# Vídeos da Prefeitura de Várzea Grande (MA Digital)

Este repositório faz Reels da Prefeitura de Várzea Grande, do material bruto no Google Drive até o vídeo final entregue no Drive.

- Para qualquer pedido de vídeo, Reels ou animação da Prefeitura, use a skill `video-prefeitura` (`.claude/skills/video-prefeitura/SKILL.md`) e siga todas as etapas e travas dela.
- Converse em português simples. Quem opera não é programador: nunca peça para rodar comando, converter, cortar ou mover arquivo.
- No início da sessão, o `scripts/preparar.sh` roda sozinho e mostra o que está pronto. Se aparecer "FALTA", resolva antes de começar o vídeo.
- Nunca suba mídia pesada para o GitHub (o `.gitignore` já barra `entrada/`, `midia/`, `saida/` e brutos).
- Não mexa em `motor/src/` nem na trava de imagens do `render.mjs` para atender um vídeo só.
- Só a Prefeitura de Várzea Grande. Pedido da Prefeita Flávia ou de outro cliente: diga que ainda não está neste repositório.
