# Operação na nuvem

Como cada coisa que o Codex e o PC do Rodrigo faziam é feita aqui. O fluxo, as paradas e as travas da skill não mudam.

## Ferramentas desta máquina

| Precisa de | Aqui |
|---|---|
| ffmpeg e ffprobe | Do sistema (`ffmpeg` no PATH). Não existe `motor/bin/` na nuvem |
| Python com Pillow | `python3`, instalado pelo `scripts/preparar.sh` |
| Navegador do render | O do Remotion ou o Chrome da máquina (o `render.mjs` escolhe sozinho; `VIDEO_CHROME` força um caminho) |
| Brutos do Drive | `motor/ferramentas/drive.py` (rclone com a conta drivemadigital) |
| Narração | `motor/ferramentas/narrar.py` (ElevenLabs, voz Samuel) |
| Mostrar arquivos | `drive.py enviar` e mandar o link. Não há como anexar arquivo na conversa |

O render na nuvem leva cerca de 2 a 3 minutos para a prévia de um vídeo de 25 s (medido em 26/11/2026). Rode em segundo plano se a ferramenta deixar e avise que está renderizando.

## Drive

- `drive.py listar "<link ou caminho>"`: tudo o que há na pasta, com tamanho.
- `drive.py baixar "<link ou caminho>" <pasta local> [--max-mb 2000]`: copia sem recodificar e sem mudar nomes. Arquivo maior que o limite é pulado e listado.
- `drive.py enviar --video <pasta> <arquivos>`: sobe prévias para `ENTREGAS VIDEOS PREFEITURA/<vídeo>/previas` e mostra o link de cada uma.
- `drive.py entregar --video <pasta>`: sobe o final, a folha e `trabalho/entrega.md` e mostra o link da pasta.

Os links abrem para quem tem acesso à pasta `ENTREGAS VIDEOS PREFEITURA` no Drive da MA Digital. O script não cria link público e não compartilha nada.

Pasta de outra conta, compartilhada com a drivemadigital: o link funciona igual. Se der "not found", a pasta não foi compartilhada com a drivemadigital: peça para compartilharem, ou para quem opera copiar os arquivos para a pasta da pauta.

## Narração

Voz **Samuel** (`F6z5r8W1ZxTsvUyVlvpG`, "Samuel - Deep & Corporate"), escolhida pelo Rodrigo. Não teste outras.

- Texto em `trabalho/narracao.txt`: o aprovado, sem trocar palavra; uma frase por linha e linha em branco entre os blocos.
- `--cotar` antes, para dizer quantos caracteres (créditos) vai gastar. Referência: 373 créditos para 45 palavras.
- Uma geração só. Repita apenas se o arquivo sair vazio, cortado ou no idioma errado, e avise.
- A tomada vem original. Não peça duração alvo e não estique o áudio: ajuste o vídeo ao áudio.

## Trilha

Busca gratuita, sem créditos: Incompetech e Free Music Archive, só CC0 ou CC BY, sem login nem aceite de termos (o Pixabay bloqueia download automático). Baixe o original e anote título, autor, link, licença exata, texto do crédito, BPM e duração. Se a rede do ambiente bloquear o site, diga qual endereço falhou e use a biblioteca.

Geração de música na ElevenLabs gasta créditos (cerca de 450 por 30 s): só com o OK do Rodrigo. Não há ferramenta pronta para isso aqui; se ele pedir, use a API de música da ElevenLabs com a mesma chave e registre o que foi gerado.

Depois de escolher as candidatas, corte você mesmo a prévia de 20 s de cada uma (etapa 5 da skill), suba com `drive.py enviar` e mande os links com o roteiro.

## Licenças

A conta da ElevenLabs é do Rodrigo, e as licenças de voz e música são assunto dele. Registre em `registro.md` o que foi gerado e onde.
