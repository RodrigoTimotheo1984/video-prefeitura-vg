# Vídeos da Prefeitura de Várzea Grande na nuvem

Reels da Prefeitura feitos pelo Claude Code na web, sem precisar do PC do Rodrigo. Os brutos entram pelo Google Drive e o vídeo final sai no Google Drive, com link.

## Para o videomaker: como pedir um vídeo

1. Suba os brutos (e o texto, card ou arte da pauta) numa pasta da pauta no Drive da MA Digital, em `2026 - PREFEITURA VG/<mês>/<pauta>`.
2. Abra [claude.ai/code](https://claude.ai/code), escolha o repositório `video-prefeitura-vg` e o ambiente "Prefeitura VG", e escreva, por exemplo: *"Faz o vídeo da pauta Mutirão no Cristo Rei. Material nesta pasta: <link da pasta>"*.
3. Responda a pergunta do áudio e aprove o roteiro, o conceito e a trilha. As prévias das trilhas chegam como link do Drive, para ouvir no celular.
4. Assista à prévia do vídeo (também em link do Drive) e aprove ou peça ajuste.
5. No fim, o Claude mostra o **link da pasta da entrega**, com o vídeo final, a folha de conferência e o que precisa ser conferido. Mande esse link para o Rodrigo.

Você não precisa instalar nada, nem converter, cortar ou renomear arquivo. Se algo travar, copie a mensagem de erro para o Rodrigo.

## Para o Rodrigo: preparar o ambiente (uma vez por conta)

O ambiente é configurado na conta do Claude de quem vai usar, em claude.ai/code, no seletor de ambiente, em "Adicionar ambiente".

| Campo | O que colocar |
|---|---|
| Nome | `Prefeitura VG` |
| Acesso à rede | "Personalizado", liberando os endereços da lista abaixo (ou "Completo", se preferir não manter lista) |
| Variáveis de ambiente | As duas chaves abaixo |

Endereços que o ambiente precisa alcançar: `www.googleapis.com`, `oauth2.googleapis.com`, `content.googleapis.com` (Drive), `api.elevenlabs.io` (narração), `fonts.googleapis.com` e `fonts.gstatic.com` (fonte da marca), `registry.npmjs.org`, `pypi.org` e `files.pythonhosted.org` (instalação), `remotion.media` (navegador do render; opcional quando a máquina já tem Chrome), `incompetech.com` e `freemusicarchive.org` (busca de trilhas).

Variáveis de ambiente:

```
DRIVE_TOKEN={"access_token":"...","token_type":"Bearer","refresh_token":"...","expiry":"..."}
ELEVENLABS_API_KEY=sk_...
```

- **DRIVE_TOKEN**: o acesso da conta drivemadigital ao Drive. Gera-se uma vez no PC: baixe o rclone para Windows em rclone.org/downloads, rode `rclone authorize "drive"`, entre com a conta drivemadigital no navegador que abrir e copie a linha que começa com `{"access_token"`. O Claude pode fazer esse passo por você numa sessão de Remote Control.
- **ELEVENLABS_API_KEY**: crie uma chave só para o videomaker no painel da ElevenLabs (Developers, API Keys), com acesso apenas a Text to Speech e limite de créditos, para poder cortar sem afetar a sua.

Quem tem as chaves no ambiente consegue usá-las. Por isso: chave da ElevenLabs separada e com limite, e conta do Drive só com as pastas da Prefeitura.

Ao abrir uma sessão, o `scripts/preparar.sh` roda sozinho (Remotion, ffmpeg, Pillow, rclone) e mostra "ok" ou "FALTA" em cada item.

## O que tem aqui

| Pasta | O que é |
|---|---|
| `.claude/skills/video-prefeitura/` | A skill: fluxo, paradas, travas, guia de estilo, tipos de vídeo, operação na nuvem |
| `motor/src/` | O motor Remotion: marca, peças, composição padrão |
| `motor/ferramentas/` | `render.mjs` (com a trava de imagens), `converter.mjs`, `pausas.mjs`, `garimpo.py`, `drive.py`, `narrar.py` |
| `trilhas/` | Biblioteca de trilhas com licenças |
| `acervo/indice.md` | O que já se sabe de cada pasta do Drive |
| `registro.md` | Um parágrafo por vídeo feito |
| `videos/` | Um vídeo por pasta: só `video.json`, `Cenas.tsx` e as fichas vão para o GitHub; a mídia fica no Drive |

Cada vídeo feito na nuvem vira um pull request com o registro atualizado. Juntando no `main`, o próximo vídeo (na nuvem ou no PC) sabe o que já foi usado.
