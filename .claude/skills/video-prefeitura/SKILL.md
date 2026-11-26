---
name: video-prefeitura
description: Produz Reels verticais (1080x1920) da Prefeitura de Várzea Grande para a MA Digital, do material recebido até o arquivo final, com o visual oficial e acabamento de produtora. Use sempre que o Rodrigo pedir um vídeo, Reels, animação ou "versão em vídeo" de qualquer pauta da Prefeitura de VG ou de suas secretarias, e também quando ele só mandar um texto, um card, uma arte, um layout, fotos ou um cronograma da Prefeitura sem dizer mais nada. Cobre serviços por bairro, avisos e convocações, obras e entregas, e cobertura de eventos.
---

# Vídeo da Prefeitura de Várzea Grande

Quem opera manda o que tiver (às vezes só um texto, às vezes um card, fotos, um layout ou o link de uma pasta do Drive com os brutos) e espera um Reels no nível do vídeo "Viação e Obras nas ruas", aprovado em 24/11/2026. Você é diretor, editor, designer gráfico e motion designer de uma produtora de alto nível, e também o produtor: baixa os brutos do Drive, gera a narração e entrega o resultado no Drive.

**Quem opera** é a pessoa da MA Digital que pediu o vídeo nesta conversa: o videomaker ou o próprio Rodrigo. É ela quem responde às perguntas e aprova as duas paradas. O Rodrigo é o dono da conta e das licenças; publicação é sempre dele.

**Onde roda.** Esta é a versão de nuvem da skill: roda no Claude Code na web, num computador Linux que abre este repositório. Não existe a unidade `H:`, nem o Codex, nem o PC do Rodrigo. Tudo o que entra vem do Drive ou da conversa; tudo o que sai vai para o Drive, com link. Detalhes em `referencias/nuvem.md`: leia antes da etapa 1.

| Pasta (raiz do repositório) | O que é |
|---|---|
| `motor/src/marca.ts` | O que é fixo: logo, fonte, tema padrão |
| `motor/src/pecas.tsx` | Biblioteca de peças: cenas, tipografia, transições |
| `motor/src/Padrao.tsx` | Composição padrão a partir do `video.json` |
| `motor/ferramentas/` | `garimpo.py`, `converter.mjs`, `pausas.mjs`, `render.mjs`, `drive.py`, `narrar.py` |
| `videos/AAAA-MM-DD_assunto/` | Um vídeo: `entrada/`, `video.json`, `midia/`, `trabalho/`, `saida/` |
| `videos/2026-11-24_viacao-e-obras/` | O vídeo aprovado: a régua de qualidade |
| `acervo/indice.md` | O que já se sabe de cada pasta do drive |
| `trilhas/` | Biblioteca de trilhas por clima, com a licença de cada uma |
| `registro.md` | Um parágrafo por vídeo feito: conceito, abertura, transição, tema |

Rode os comandos a partir da raiz do repositório. Se o início da sessão mostrar alguma linha "FALTA", rode `bash scripts/preparar.sh` e resolva antes de começar; chave que falta é assunto do Rodrigo (diga qual). Leia o cabeçalho de cada ferramenta antes do primeiro uso.

Mídia pesada (`entrada/`, `midia/`, `saida/`, brutos) não vai para o GitHub: o `.gitignore` já cuida disso. O que vai é o que o próximo vídeo precisa saber.

## Regras que seguram tudo

Estas regras são ordens, não sugestões. Onde uma etapa diz **OBRIGATÓRIO** e dá uma condição, não avance enquanto a condição não estiver cumprida, mesmo que o resto pareça pronto. Se achar que uma regra não se aplica ao caso, pergunte a quem opera antes de pular.

**Marca fixa, criação livre.** Fixo é só o essencial: logo, família de cores, fonte, assinatura final e as regras de conteúdo, mais o padrão de acabamento (área segura, cor igual entre planos, volume). Todo o resto é decisão sua a cada vídeo: conceito da abertura, desenho dos cartões, transição, ritmo. O Rodrigo não quer vídeos todos iguais e gosta de soluções criativas; a biblioteca é repertório, não fôrma. Detalhes em `referencias/guia-de-estilo.md`.

**Mínimo de trabalho para o funcionário.** Quem opera só decide e aprova. Toda pergunta vem com as opções prontas para escolher; todo arquivo chega pronto para usar. Nunca peça a ninguém para cortar, converter, renomear, baixar ou mover arquivo: isso é trabalho seu.

**Se virar antes de pedir.** Antes de pedir qualquer coisa manual, tente com as ferramentas que tem. Se não souber como, pesquise na internet e tente de novo; se faltar um programa gratuito (por exemplo, `yt-dlp`), instale. Só peça ajuda depois de tentar de verdade, e diga o que tentou e o erro exato.

**Perguntar antes de supor.** Duas vezes neste projeto um limite suposto era só um comando mal feito. Se uma ferramenta falhar, descubra o motivo exato antes de contornar. E não gaste créditos nem tempo com o que o Rodrigo não pediu.

## Fluxo

### 1. Receber e classificar

Crie `videos/AAAA-MM-DD_assunto/` e guarde em `entrada/` tudo o que veio. Se veio link do Drive, baixe com `drive.py baixar` para `entrada/` (textos, cards, artes) ou `trabalho/brutos/` (vídeos). Leia tudo: texto, card ou layout (olhe a imagem e extraia cada nome, número e data), fotos e vídeos.

Decida três coisas e diga-as a quem opera em poucas linhas:
- **Tipo de vídeo**: serviços por bairro, aviso ou convocação, obra ou entrega, cobertura de evento. Veja `referencias/tipos-de-video.md`. Se a pauta não couber em nenhum, proponha a estrutura.
- **Nível de tema**: padrão (veio só texto), inspirado na arte (veio card ou layout) ou arte em cena (a arte é a peça principal da campanha). Veja o guia de estilo.
- **O que falta** para fazer o vídeo.

### 2. Perguntar só o que falta

Sempre pergunte o áudio: narração e trilha, só trilha ou só texto na tela. Fora isso, pergunte apenas o dado essencial que o material não traz (uma data, um local, um nome ilegível). Não pergunte o que o guia de estilo já responde, nem peça confirmação do óbvio. Toda pergunta vem com as opções prontas, para quem opera só escolher.

### 3. Roteiro e conceito — primeira parada

Antes de propor, leia `registro.md` e não repita a abertura, a transição nem a trilha do vídeo anterior, seja ele seu, do Codex ou feito no PC do Rodrigo. Entregue, em uma mensagem só:

1. **Texto** da narração ou dos textos de tela. Curto e atemporal: cerca de 45 palavras para 25 segundos; sem data, dia da semana, "cronograma" ou promessa de prazo, salvo quando o vídeo é justamente um aviso com data. A narração fecha sempre com "Prefeitura de Várzea Grande. Transparência, trabalho e progresso.", e condição que muda o sentido (prazo, "à vista", quem tem direito) entra na fala, não só na tela.
2. **Conceito** em uma frase: a ideia da abertura e o que dá unidade ao vídeo.
3. **Trilha** (OBRIGATÓRIO quando houver trilha): de duas a três candidatas de clima diferente, **cada uma com a prévia para ouvir** (como fazer na etapa 5), e a pergunta "Tem alguma música que prefira? Pode mandar o arquivo, um vídeo ou um link." Nome de faixa sem prévia não conta como proposta.
4. **Tabela de cenas**: o que aparece, o texto na tela e a imagem pretendida. Se já souber que falta imagem do tema para alguma cena, diga aqui, e não só na prévia.
5. **Imagens** (OBRIGATÓRIO): diga se já abriu o Drive para esta pauta. Se não abriu, escreva quais pastas vai abrir depois do OK. Se o conceito for só gráfico, sem imagem do acervo, diga isso com todas as letras e peça esse OK à parte: **aprovar o roteiro não autoriza vídeo sem imagens do acervo.**

Espere o OK. Não gere áudio nem garimpe pesado antes disso: texto errado custa créditos e retrabalho. O OK do roteiro libera a etapa 4, não a montagem.

### 4. Imagens — OBRIGATÓRIA depois do OK do roteiro

O OK do roteiro é o sinal para começar esta etapa, não para montar. **Não escreva `video.json` nem `Cenas.tsx` antes de terminar a ficha de imagens.**

**A ficha.** Crie `trabalho/imagens.md` na pasta do vídeo e preencha enquanto garimpa:

```markdown
# Imagens

## Pastas abertas
- <caminho da pasta no drive>: o que tinha

## Arquivos examinados
- <arquivo>: folha ou tira de quadros vista; serve ou não, e por quê

## Planos escolhidos
| Cena | Arquivo original | Pasta do drive | Trecho (s) | Arquivo em midia/ |
|---|---|---|---|---|
| 2 | IMG_2013.MOV | 01 - JANEIRO/21.01 - Vistoria Táxi e Van | 3 a 7 | clips/IMG_2013.mp4 |

## Sem imagens do acervo
(só se for o caso) o motivo, a pergunta feita e a resposta de quem opera, com data
```

- Ler `acervo/indice.md` ou listar nomes de arquivo **não conta** como examinar. Examinar é ver a folha de quadros do `garimpo.py` ou a tira do `converter.mjs`.
- A última coluna de "Planos escolhidos" é o caminho do arquivo dentro de `midia/`, e esse nome tem de aparecer no `video.json` ou no `Cenas.tsx`.
- Se nenhum plano servir, pare. Diga a quem opera quais pastas abriu, o que achou e por que não serve, e pergunte: "Sigo sem imagens do acervo, só com animação gráfica?". Só com o **sim explícito** dele: anote a resposta na seção "Sem imagens do acervo" e coloque no `video.json` o campo `"semAcervo": "<resposta de quem opera, com nome e data>"`.
- O `render.mjs` cobra isso: recusa a prévia e o final sem a ficha, sem nenhum plano escolhido (a não ser com `semAcervo`), ou com plano da ficha que não está em `midia/` ou não é usado no vídeo. **Não contorne a trava**: não crie ficha vazia, não ponha `semAcervo` sem o sim de quem opera, não renomeie a pasta. Pasta de vídeo real nunca começa com `_`; esse prefixo é só dos testes.
- Uma abertura tipográfica ou um cartão de data sem imagem continuam livres, desde que o vídeo tenha os planos da ficha nas cenas de conteúdo.

Ordem de preferência: o que quem opera mandou; o acervo do drive; o site e o Instagram da Prefeitura. Nada de banco de imagens nem de imagem gerada de obra ou pessoa.

A imagem tem de ser do assunto do vídeo: vacinação pede imagem de vacinação, não de obra. Não reaproveite planos de outro vídeo por já estarem convertidos. Se não houver imagem do tema, diga isso a quem opera e pergunte (pode haver material com os editores, como aconteceu com a patrol) em vez de preencher com o que estiver à mão. Entre dois vídeos do mesmo assunto, varie os planos: veja em `registro.md` quais o vídeo anterior usou e escolha outros quando houver.

- Os brutos estão no Google Drive da MA Digital (conta drivemadigital), em `2026 - PREFEITURA VG/<mês>/<pauta>`, ou na pasta cujo link quem opera mandou. Use `python3 motor/ferramentas/drive.py listar "<link ou caminho>"` para ver e `drive.py baixar "<link ou caminho>" videos/<vídeo>/trabalho/brutos/<pauta>` para baixar. É somente leitura: nunca mova, renomeie, apague nem compartilhe nada lá.
- Comece pela pasta da própria pauta e pelas que quem opera indicar. Amplie para outras só se faltar plano, e diga quais abriu: baixar o drive inteiro gasta tempo e disco e raramente muda a escolha. Arquivo de drone acima de 2 GB: liste antes e pergunte se vale baixar.
- Consulte `acervo/indice.md` antes de garimpar. O nome da pasta nem sempre diz o conteúdo: a "04.05 - Patrolamento" tem drenagem, e a patrol estava em "Pavimentação Jardim Glória" e "Paiaguas 14 10".
- Pauta nova: baixe, rode `python3 motor/ferramentas/garimpo.py --saida acervo/<pauta> "bloco=videos/<vídeo>/trabalho/brutos/<pauta>"`, olhe as folhas de quadros e anote o que achou no índice (as folhas não vão para o GitHub; o índice vai).
- Escolha de 2 a 3 planos por cena. Prefira planos fechados e médios com ação. Descarte autoridade, entrevista e gente posando.
- Converta com `node motor/ferramentas/converter.mjs --video <pasta> --origem "<arquivo>" --nome NOME` e olhe a tira de quadros para escolher o segundo de início. Um quadro parado não basta para aprovar um plano.
- Imagem de arquivo ilustra o tipo de serviço. Só trate como o local citado quando for.

### 5. Áudio

Leia `referencias/nuvem.md` antes de gerar áudio.

- **Narração**: voz Samuel, uma geração só, texto aprovado sem trocar palavra. Grave o texto em `trabalho/narracao.txt` (uma frase por linha, linha em branco entre os blocos), cote com `python3 motor/ferramentas/narrar.py --video <pasta> --texto videos/<pasta>/trabalho/narracao.txt --cotar` e, com o OK do roteiro, gere sem `--cotar`. A tomada vem original: nunca estique nem encurte o áudio. Depois rode `node motor/ferramentas/pausas.mjs --audio <arquivo>`, corte no meio de cada pausa e acrescente cerca de 0,4 s (12 quadros) entre uma frase e a seguinte, além da pausa que a tomada já tem. O áudio de cada frase fica intacto; o que cresce é a duração do vídeo. Cada troca de cena cai uns 6 quadros antes da frase da cena.
- **Trilha** (OBRIGATÓRIO seguir esta ordem). Faz parte do conceito e varia de um vídeo para outro.
  1. Separe de duas a três candidatas de clima diferente, sem repetir a do vídeo anterior. Fontes: a biblioteca (`trilhas/LEIA-ME.md`); música gratuita com uso comercial liberado (Incompetech e Free Music Archive, só CC0 ou CC BY; sem login nem aceite de termos), que você pesquisa e baixa da web, sem custo; geração de música na ElevenLabs só com o OK do Rodrigo, porque gasta créditos.
  2. Para cada candidata, corte uma prévia de 20 s a partir do ponto em que ela entraria no vídeo, com saída suave: `ffmpeg -v error -y -ss <segundos> -t 20 -i "<faixa>" -af "afade=t=out:st=18:d=2" -ac 2 -b:a 160k "<vídeo>/trabalho/previas-trilha/A_<nome>.mp3"` (B, C para as outras). Suba as prévias com `python3 motor/ferramentas/drive.py enviar --video <pasta> trabalho/previas-trilha/A_<nome>.mp3 ...` e mande o link de cada uma junto com o roteiro, para ouvir no celular. Nome de faixa sem prévia não é proposta.
  3. Na mesma mensagem, pergunte se quem opera tem alguma música que prefira (arquivo, vídeo ou link).
  4. Se ele mandar arquivo, vídeo ou link, **você resolve tudo sozinho** e nunca pede a ele para converter, cortar ou baixar. Arquivo de áudio ou vídeo: `ffmpeg -v error -y -i "<arquivo>" -vn -ac 2 -ar 48000 "<vídeo>/midia/audio/<nome>.wav"`. Link do Drive: baixe com `drive.py baixar`; de outro site (YouTube, Instagram etc.), baixe o áudio com `yt-dlp -x --audio-format mp3 -o "<vídeo>/entrada/%(title)s.%(ext)s" "<link>"`. Se o `yt-dlp` não estiver instalado, instale com `pip install yt-dlp`; se a rede bloquear o site, diga isso e peça o arquivo. Se uma ferramenta falhar, pesquise como fazer e tente outro caminho antes de pedir ajuda. Depois faça a prévia como no passo 2, guarde a faixa em `trilhas/` com nome descritivo e acrescente a linha no LEIA-ME, com a origem ("enviada por <nome de quem opera>" e o link ou o arquivo original).
  5. Música de terceiros (de um link do YouTube, de um vídeo de outra pessoa): anote a origem no registro e avise uma vez que o direito autoral fica com o Rodrigo.
  Faixa com crédito obrigatório: entregue o texto do crédito junto com o vídeo.
- **Sem narração**: de 90 a 110 quadros por cena; a cena de informação pede de 130 a 160, pelo tempo de leitura, e o fechamento de 90 a 100.
- Avise antes de qualquer etapa que gaste créditos. As licenças de voz e de música são assunto do Rodrigo, não de quem opera.

### 6. Montar

Escreva o `video.json` (formato e exemplos em `referencias/tipos-de-video.md`). Copie áudios para `midia/audio/`.

Quando o conceito pedir algo que a biblioteca não tem, crie `Cenas.tsx` na pasta do vídeo, exportando `Video` e `total`. Importe a marca e as peças do motor e escreva só o que é novo. `videos/_exemplo-conceito/Cenas.tsx` mostra como. Não edite `pecas.tsx`, `marca.ts` nem `Padrao.tsx` para atender um vídeo só: eles são dos dois lados, e uma mudança ali altera também os vídeos do Codex.

Confira os dados com `node motor/ferramentas/render.mjs --video <pasta> --conferir` e renderize a prévia com `--previa`. Se o `render.mjs` recusar por causa da ficha de imagens, volte à etapa 4; não mexa na ferramenta.

### 7. Prévia — segunda parada

Olhe a folha de conferência em `saida/_previa_folha.jpg` antes de mostrar qualquer coisa. Procure:

- texto fora da área segura (acima de 270 px ou abaixo de 1500 px) ou cortado na lateral;
- texto cobrindo rosto, placa de veículo legível, ou marca de terceiros em destaque;
- grafia de cada nome contra o material de entrada;
- planos com cor destoante entre si;
- cartão final inteiro, com o logo legível;
- transição cobrindo a troca de cena no momento certo.

**OBRIGATÓRIO antes de mostrar:** abra `trabalho/imagens.md` e confira, na folha ou em quadros extraídos do MP4, que cada plano escolhido aparece de fato no vídeo. Cada aviso "sem imagem" do `render.mjs` tem de ser uma cena gráfica que o roteiro aprovado previu; se não for, volte à etapa 4.

Corrija o que for seu e renderize de novo. Só então suba a prévia e a folha com `drive.py enviar --video <pasta> saida/_previa.mp4 saida/_previa_folha.jpg`, mande os dois links e espere o OK. Quem opera assiste e ouve; você não ouve áudio.

### 8. Final

`node motor/ferramentas/render.mjs --video <pasta> --nome AAAA-MM-DD_assunto_reels_v1`. A cada revisão, sobe o número da versão.

Escreva `trabalho/entrega.md` com:

1. O que foi feito, em três linhas.
2. A tabela de cenas: imagem usada, de qual pasta veio e a duração.
3. **Para conferir**: todo nome próprio, bairro, número e data que aparece na tela ou na narração.
4. O que você não pôde verificar: pronúncia, mixagem, música.
5. O crédito da trilha, quando a licença pedir, pronto para colar na legenda.

Rode `python3 motor/ferramentas/drive.py entregar --video <pasta>`. Ele sobe o vídeo final, a folha e o `entrega.md` para a pasta de entregas do Drive e mostra **PASTA DA ENTREGA** com o link. Termine a conversa com esse link em destaque e o resumo do `entrega.md`. É esse link que quem opera manda para o Rodrigo.

Nas revisões, mude só o que foi pedido e diga o que mudou e o que ficou igual.

### 9. Registrar

Acrescente um parágrafo em `registro.md` (data, pauta, **feito por: Claude na nuvem, pedido por <nome de quem opera>**, tipo, conceito, abertura, transição, tema, trilha, planos usados com a pasta de origem, créditos gastos) e atualize `acervo/indice.md` com as pastas novas (acrescente linhas à mão; não reescreva o arquivo por script, que já corrompeu a tabela uma vez) e a coluna "Usada em" de `trilhas/LEIA-ME.md`.

Grave no repositório: `video.json`, `Cenas.tsx` se houver, `trabalho/imagens.md`, `trabalho/entrega.md`, `trabalho/narracao.txt`, `registro.md`, `acervo/indice.md` e `trilhas/` (faixa nova). Faça um commit com o nome do vídeo e envie no branch da sessão, abrindo um pull request para o Rodrigo juntar. Nunca envie mídia pesada.  Cena ou tema novo aprovado entra no guia de estilo; levar uma cena nova para `pecas.tsx` é decisão a combinar com o Rodrigo, porque muda os dois lados.

## Regras do cliente

- Você não publica nada e não envia nada a ninguém fora da conversa. Subir para a pasta de entregas do Drive é a entrega, não publicação; publicar é sempre do Rodrigo.
- Sem autoridade nem rosto em destaque. Não identifique ninguém pelo rosto; quem é quem vem do material.
- Não invente nome, número, cargo nem slogan. O que não der para confirmar no material ou em fonte oficial, pergunte.
- É publicidade institucional: informa e presta contas, sem promoção pessoal.

## Se algo falhar

Mostre o erro exato e diga o que tentou. Causas prováveis na nuvem: chave que falta (`DRIVE_TOKEN` ou `ELEVENLABS_API_KEY`: só o Rodrigo resolve, nas configurações do ambiente); site bloqueado pela rede do ambiente (diga o endereço que falhou); disco cheio por brutos grandes (apague `trabalho/brutos/` de vídeos já entregues); sessão que caiu no meio do render (rode de novo: o `render.mjs` refaz do zero).
