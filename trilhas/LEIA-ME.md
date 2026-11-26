# Biblioteca de trilhas

A trilha faz parte do conceito de cada vídeo, como a abertura e a transição. Escolha pelo clima da pauta e **não repita a trilha do vídeo anterior** (veja `registro.md`). Copie a escolhida para `<vídeo>/midia/audio/` e aponte no `video.json`.

Nem o Claude nem o Codex ouvem áudio. As descrições abaixo vêm do catálogo do autor ou do pedido feito ao gerador, não de escuta. Quem confirma o clima e o encaixe é quem opera (o Rodrigo ou o videomaker): **toda trilha proposta vai com uma prévia de 20 s para ele ouvir** (comando na etapa 5 da skill), salva em `<vídeo>/trabalho/previas-trilha/`.

| Arquivo | Duração | BPM | Clima (segundo a fonte) | Bom para | Licença | Origem | Usada em |
|---|---|---|---|---|---|---|---|
| `institucional-110bpm_elevenlabs.wav` | 0:30 | 110 | Institucional com pulso, percussão orgânica, violão rítmico, marimba; acorde final aos 24 s | Prestação de contas, serviços | ElevenLabs Music v2, conta gratuita; uso comercial não confirmado, o Rodrigo cuida | Gerada na ElevenLabs | Viação e Obras nas ruas (24/11/2026), `inicio: 131` |
| `groundwork-102bpm_incompetech.mp3` | 2:49 | 102 | Contemporânea, leve e marcada; baixo, bateria, guitarra e piano; feita como base para vídeo narrado | Vídeos com narração, avisos | CC BY 4.0, crédito obrigatório | Pesquisa gratuita (Incompetech) | Multas com 50% de desconto (25/11/2026), `inicio: 565` |
| `happy-alley-112bpm_incompetech.mp3` | 1:20 | 112 | Alegre e ascendente, conduzida por violão, com baixo e bateria | Eventos, entregas, mutirões | CC BY 4.0, crédito obrigatório | Pesquisa gratuita (Incompetech) | Usada em 25/11/2026 (multas de trânsito, versão Codex) |
| `cold-funk-112bpm_incompetech.mp3` | 4:48 | 112 | Rock com groove relaxado; guitarra e baixo em acordes repetidos, piano elétrico | Obras, máquinas, bastidores | CC BY 4.0, crédito obrigatório | Pesquisa gratuita (Incompetech) | — |
| `montauk-point-118bpm_incompetech.mp3` | 3:39 | 118 | Trio discreto de guitarra, baixo e bateria; saltitante, alegre e otimista | Visitas, entregas com fala por cima | CC BY 4.0, crédito obrigatório | Pesquisa gratuita (Incompetech) | Candidata A da praça inclusiva, perfil da prefeita (25/11/2026), `inicio: 488` |
| `life-of-riley-102bpm_incompetech.mp3` | 3:55 | 102 | Alegre e descontraída; ukulele, guitarra, percussão e glockenspiel | Encontros com moradores, tom afetuoso | CC BY 4.0, crédito obrigatório | Pesquisa gratuita (Incompetech) | Candidata B da praça inclusiva (25/11/2026), `inicio: 565` |
| `music-to-delight-104bpm_incompetech.mp3` | 0:55 | 104 | Saltitante e bem-humorada; palmas, pandeirola, baixo, guitarra e flauta de apito | Crianças, brincadeira, parquinho | CC BY 4.0, crédito obrigatório | Pesquisa gratuita (Incompetech) | Candidata C da praça inclusiva (25/11/2026), `inicio: 0` |

Crédito das três faixas acima: `videos/2026-11-25_praca-inclusiva-flavia/briefs/01-ficha.md`.

O texto exato do crédito de cada faixa do Incompetech está em `licencas-incompetech.md`. Quando usar uma delas, inclua o crédito na entrega, para o Rodrigo colar na legenda do post.

## Como encaixar uma faixa longa

- `inicio` no `video.json` é em quadros. Pule compassos inteiros para a música não entrar torta: um compasso tem `7200 / BPM` quadros (65,45 a 110 BPM; 70,59 a 102; 64,29 a 112).
- Faixas longas não terminam no fim do vídeo. O motor baixa o volume nos últimos 16 quadros; sem narração, prefira que o fechamento dure pelo menos 90 quadros para a saída não soar cortada.
- Na faixa da ElevenLabs o acorde final acontece aos 24 s do arquivo: ele cai no quadro `720 - inicio` do vídeo.
- Evite os primeiros segundos de uma faixa longa quando forem só introdução; começar 8 ou 16 compassos adiante costuma já pegar a base completa. É suposição pelo formato usual das faixas, não escuta: avise o Rodrigo do ponto escolhido.

## Como a biblioteca cresce

- Faixa nova entra quando a pauta pede um clima que não existe aqui, ou quando as existentes já foram usadas nos últimos vídeos.
- Três fontes: música que o Rodrigo mandar (arquivo, vídeo ou link; o agente extrai o áudio sozinho, e a origem fica como "Enviada pelo Rodrigo" com o link ou o arquivo original); biblioteca gratuita com uso comercial liberado (o agente busca e registra a licença; ver `referencias/nuvem.md` da skill) ou geração na ElevenLabs (cerca de 450 créditos por 30 segundos; pedir o OK do Rodrigo antes).
- Toda faixa nova ganha uma linha na tabela acima, com a licença. A coluna "Usada em" é atualizada a cada vídeo.
