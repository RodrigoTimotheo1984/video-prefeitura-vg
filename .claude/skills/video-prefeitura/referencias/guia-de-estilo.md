# Guia de estilo — vídeos da Prefeitura de Várzea Grande

Medido nas peças oficiais do drive (estáticos de setembro de 2026 e vídeos já editados) e no logo do site. A Prefeitura não publica manual de marca nem o nome da fonte.

## O que é fixo

Estas coisas fazem um vídeo ser reconhecido como da Prefeitura. Não mudam em nenhum vídeo.

| Item | Valor |
|---|---|
| Logo | `motor/src/logo.png`, sempre inteiro, em cartão branco. Fixo no canto superior esquerdo enquanto há imagem; grande no cartão final |
| Fonte | Barlow Condensed, itálico, caixa alta. Peso 800 nos títulos, 600 no apoio. É a mais próxima das peças oficiais |
| Família de cores | Verde `#0A9A2E`, verde escuro `#07561B`, amarelo `#FFD400`, branco. É o tema padrão |
| Assinatura final | Logo em cartão branco e, embaixo, o slogan "Transparência, trabalho e progresso." É o padrão do motor quando o `video.json` não traz `assinatura`. Nome de secretaria no lugar do slogan só quando o Rodrigo pedir |
| Barra da marca | Degradê do verde para o destaque, na base do quadro |
| Acabamento | 1080 × 1920, 30 qps; mesma cor em todos os planos (`converter.mjs`); véu e vinheta do motor; áudio em -14 LUFS |
| Área segura | Nenhum texto acima de 270 px nem abaixo de 1500 px; 68 px de margem lateral |

## O que é livre

Conceito da abertura, desenho das etiquetas e cartões, transição, trilha, ritmo dos cortes, uso de foto, número, mapa ou tipografia grande, e a ordem das cenas. O Rodrigo pediu expressamente que os vídeos não saiam todos iguais.

Como usar essa liberdade sem perder a marca:
- Parta de uma ideia para o vídeo, não da lista de peças. Uma frase: "os serviços empilham na tela, um por batida"; "o número da obra cresce enquanto o drone sobe".
- Varie uma ou duas coisas grandes por vídeo (abertura e transição, por exemplo) e mantenha o resto calmo. Variar tudo ao mesmo tempo vira bagunça.
- O movimento tem a mesma mão em todos: entradas por máscara, curvas suaves que assentam, nada piscando, tremendo ou brilhando.
- Texto grande, pouco e legível em menos de dois segundos. Hierarquia clara: uma coisa principal por cena.
- Antes de propor, leia `registro.md` e fuja da abertura e da transição do vídeo anterior.

## Tema: os três níveis

O tema troca cores sem tocar no que é fixo. Fica no campo `tema` do `video.json`; vazio, vale o padrão.

| Nível | Quando | O que fazer |
|---|---|---|
| Padrão | Veio só texto | Não preencha `tema` |
| Inspirado na arte | Veio card ou layout | Tire da arte a cor de destaque, o fundo e o nome da campanha (`selo`). Repita a hierarquia do título da arte |
| Arte em cena | A arte é a peça principal da campanha | Converta a arte como foto e use-a na abertura, com movimento; o resto do vídeo segue as cores dela |

Campos do tema: `destaque` (placas, números, pinos), `sobreDestaque` (texto em cima do destaque), `base` (cor viva), `fundo` (cartões e lâminas escuras), `noite` (escurecimento sob o texto), `texto`, `selo` (nome curto da campanha, ao lado do logo).

Cuidados:
- Meça as cores na imagem (um script curto com Pillow contando as cores dominantes); não chute.
- Confira o contraste: texto sobre `destaque` e texto branco sobre `noite` precisam ler de primeira. Se não lerem, escureça ou clareie o tom e avise o Rodrigo.
- `noite` é sempre uma versão bem escura do `fundo`; é ela que segura a leitura sobre o vídeo.
- Não copie a fonte nem o logo de terceiros que estiverem na arte.

Temas já usados:

| Tema | destaque | sobreDestaque | base | fundo | noite |
|---|---|---|---|---|---|
| Padrão (Viação e Obras, 24/11/2026) | `#FFD400` | `#07561B` | `#0A9A2E` | `#07561B` | `#04320F` |
| Laranja de teste (não publicado) | `#FF9A1F` | `#2A1205` | `#D9480F` | `#5C2408` | `#1E0D04` |

## Biblioteca de peças (`motor/src/pecas.tsx`)

| Peça | Para que serve |
|---|---|
| `Plano`, `Planos` | Vídeo ou foto em tela cheia, com movimento |
| `Acabamento` | Véu, vinheta e base escura para o texto |
| `Sobe`, `Placa`, `Pino`, `Conta`, `Progresso`, `Bloco` | Tipografia e apoio |
| `Abertura` | Linhas grandes, com número que conta e uma delas na placa |
| `CenaServico` | Serviço na placa e locais com pino, com contador |
| `CenaInfo` | Título e linhas "rótulo e valor" (quando, horário, onde) |
| `CenaNumero` | Número grande que conta, com legenda |
| `CenaLegenda` | Título de apoio com fio lateral |
| `Fechamento` | Assinatura fixa |
| `PassagemLaminas`, `PassagemCortina`, `PassagemSubida` | Transições que cobrem a troca de cena |

Exemplo de cena criada sob medida: `videos/_exemplo-conceito/Cenas.tsx` (abertura com os serviços empilhados).

## Texto

- Curto e atemporal. Cerca de 45 palavras para 25 segundos.
- Sem data, dia da semana, "cronograma", "roteiro do dia" ou promessa de prazo. Órgão público não pode ser cobrado por um vídeo antigo. A exceção é o aviso com data, que existe para informá-la.
- Nomes de bairro e de serviço como a Prefeitura escreve: "Assentamento Sadia III", "região do Mangabeiras", "Secretaria Municipal de Viação e Obras".
- Na narração, numerais por extenso quando houver risco de leitura errada ("Sadia Três").
- Toda narração termina com a assinatura falada: "Prefeitura de Várzea Grande. Transparência, trabalho e progresso."
- Condição que muda o sentido da mensagem (prazo, "à vista", quem tem direito) entra na fala, não só na tela. Decida isso no roteiro: depois de gerado, o áudio custa créditos para refazer.

## Imagem

- Planos fechados e médios com ação: máquina trabalhando, ferramenta, material, mãos.
- Sem autoridade nem rosto em destaque. Trabalhador em plano médio, sem destaque, pode.
- Evite placa de obra legível e marca de terceiros em primeiro plano.
- Quase todo o bruto do drive já é vertical.
