# Registro dos vídeos

Um parágrafo por vídeo, do mais novo para o mais antigo. Antes de propor um conceito, leia os três últimos e não repita a abertura, a transição nem a trilha do anterior.

## 2026-11-25 — Multas de trânsito com 50% de desconto

- **Pasta:** `videos/2026-11-25_multas-50-desconto/` (final aprovado: `saida/2026-11-25_multas-50-desconto_reels_v1.mp4`, 21,5 s).
- **Feito por:** Claude (direção e edição), com o Codex na produção da narração.
- **Tipo:** aviso. **Entrada:** só texto.
- **Conceito:** "Pela metade": a palavra MULTA é cortada ao meio por uma lâmina amarela, a metade de baixo cai e o 50% sobe no lugar.
- **Abertura:** sob medida (`Cenas.tsx`). **Transição:** cortina. **Tema:** padrão. **Cenas prontas usadas:** `info` e `legenda` (primeiro uso em vídeo real).
- **Áudio:** narração do Samuel em duas tomadas, texto (246 créditos) e assinatura falada (65 créditos), coladas em `narracao_completa.wav`; trilha `groundwork-102bpm_incompetech.mp3` (`inicio: 565`, crédito obrigatório na legenda).
- **Planos usados**, todos de `01 - JANEIRO\21.01 - Vistoria Táxi e Van`: `IMG_2013`, `IMG_2014`, `IMG_2011`, `IMG_2008`, `IMG_2027`, `IMG_2028`, `IMG_2012`.
- **O que o Rodrigo pediu nas revisões:** assinatura falada no fim ("Prefeitura de Várzea Grande. Transparência, trabalho e progresso."); slogan embaixo da marca no lugar de "Prefeitura de Várzea Grande", que já está na marca. Aprovado na terceira versão da prévia que recebeu.
- **Erros levantados para ajustar a skill:** `erros-para-ajustar-a-skill.md`, na pasta do vídeo.

## 2026-11-25 — Peças novas aprovadas (sem vídeo publicado)

O Rodrigo aprovou, vendo os testes com dados fictícios (`videos/_teste-aviso`, `_teste-obra`, `_exemplo-conceito`): as cenas `info`, `numero` e `legenda`; as transições `cortina` e `subida`; o tema de campanha com o selo ao lado do logo; e a abertura sob medida com os serviços empilhados. Nenhuma dessas foi usada ainda em vídeo real. Os testes reaproveitaram os planos do vídeo de obras de propósito, só para validar as peças; as imagens deles não têm relação com os textos. O nível "arte em cena" continua sem teste.

## 2026-11-24 — Viação e Obras nas ruas

- **Pasta:** `videos/2026-11-24_viacao-e-obras/` (feito originalmente em `cronograma-obras/`; arquivo aprovado em `cronograma-obras/out/2026-11-24_viacao-e-obras_reels_v2.mp4`).
- **Feito por:** Claude (direção e edição), com o Codex na produção de áudio e pesquisa.
- **Tipo:** serviços por bairro. **Entrada:** card "Cronograma de Execuções de Serviços" de 24/11.
- **Conceito:** contagem de serviços e bairros na abertura; cada serviço em placa amarela com os locais.
- **Abertura:** `Abertura` com números contando ("4 serviços / 6 bairros"). **Transição:** lâminas. **Tema:** padrão.
- **Áudio:** narração do Samuel (373 créditos) com respiro de 0,4 s entre as frases, e trilha `institucional-110bpm_elevenlabs.wav` (450 créditos).
- **Imagens:** tapa-buraco de abril e junho; patrol do Paiaguás e do Jardim Glória; drenagem real do Joaquim Curvo; concretagem do Costa Verde.
- **Planos usados** (evitar repetir no próximo vídeo de obras): `IMG_8101` e `IMG_8109` (rolo, abril); `IMG_6427` (caminhão com fumaça) e `IMG_8115` (pá); `IMG_1950` (patrol, Paiaguás) e `IMG_1126` (lâmina, Jardim Glória); `A001_10220921_D047` e `dji_fly_..._094258` (Joaquim Curvo); `IMG_8459` e `IMG_8457` (pedreiro, Costa Verde).
- **O que o Rodrigo pediu nas revisões:** texto mais curto e sem data; mais respiro; visual da Prefeitura em vez de cores por serviço; transições e cor padronizada. Aprovado na v2.

## 2026-11-25 — Praça inclusiva do bairro da Manga (perfil da prefeita)

- **Pasta:** `videos/2026-11-25_praca-inclusiva-flavia/`. Final em `saida/2026-11-25_praca-inclusiva-flavia_reels_v1.mp4` (40,8 s).
- **Feito por:** Claude (direção e edição), com o Codex na busca de trilha. **Não é peça da Prefeitura:** vai no Instagram da prefeita, sem selo, barra nem assinatura institucional.
- **Tipo:** visita/entrega com a fala dela (sem locutor). **Entrada:** 5 vídeos de iPhone e 2 áudios do videomaker em `D:\MA DIGITAL\FLAVIA VIDEOS\25-11- PRAÇA INCLUSIVA`.
- **Conceito:** comemoração do bairro; promessa cumprida ("Não falei que ia ter uma praça?"), voz do morador ("todo dia tá lotado"), abraço, "vai ter muito mais". Tom alegre, entrega sem politizar.
- **Abertura:** frase dela escrita grande sobre o plano aberto da praça; depois título branco + laranja `#E89824` com pin "Bairro da Manga". **Transição:** corte seco, com aproximação no corte dentro do mesmo plano. **Fecho:** praça aberta, sem logo.
- **Áudio:** voz dela e dos moradores (filtro de vento, compressão, -16 LUFS por trecho) + trilha `montauk-point-118bpm_incompetech.mp3`, `inicio: 488` (CC BY, crédito na legenda). Nenhum crédito gasto.
- **Imagem:** o bruto é HDR do iPhone (HLG); os trechos são cortados por `trabalho/cortar.py`, que faz o mapeamento para SDR e o grade. O `converter.mjs` do motor não faz isso.
- **O que o Rodrigo pediu nas revisões:** tratar a luz; tirar vento e nivelar o áudio; nada de faixa escura atrás da legenda; tem que ter trilha; emoção com alegria (nunca triste), morador dentro do vídeo; não sobrepor dois áudios; não repetir o mesmo cenário (balanço) várias vezes. Final renderizado a pedido dele em 25/11.
