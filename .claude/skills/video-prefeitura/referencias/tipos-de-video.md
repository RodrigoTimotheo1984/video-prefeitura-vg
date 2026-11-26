# Tipos de vídeo e formato do `video.json`

Os quatro tipos são pontos de partida, não fôrmas. Misture cenas quando a pauta pedir.

## Os quatro tipos

| Tipo | Quando | Cenas de partida | Duração |
|---|---|---|---|
| Serviços por bairro | Vários serviços em vários locais (obras, mutirões, limpeza) | abertura → um `servico` por serviço (3 a 5) → fechamento | 20 a 26 s |
| Aviso ou convocação | Um assunto com data, horário e local (vacinação, audiência, inscrição, prazo) | abertura → `info` → `legenda` com o que levar ou quem pode → fechamento | 15 a 20 s |
| Obra ou entrega | Uma obra ou entrega específica, com números | abertura com o nome → um ou dois `numero` → `legenda` com o benefício → fechamento | 15 a 22 s |
| Cobertura de evento | Recorte de um evento já gravado | abertura com o nome do evento → de 3 a 5 `legenda` sobre os melhores planos → fechamento | 20 a 30 s |

Em aviso, a data e o horário entram no texto e na tela: é a exceção à regra do texto atemporal. Confira-os duas vezes contra o material.

Em cobertura de evento não há fala sincronizada: use imagem com trilha e legendas. Se o Rodrigo quiser a fala de alguém, é outro trabalho (precisa de transcrição e legenda palavra por palavra) e deve ser combinado com ele.

## Formato

Durações e pontos de áudio são em **quadros** a 30 por segundo (30 quadros = 1 segundo): `duracao`, `corte`, os `de`/`ate`/`em` da narração e o `inicio` e o `sobeEm` da trilha. A única exceção é o `inicio` de cada item de `midia`, que é em **segundos** dentro do plano. Arquivos são relativos a `midia/`.

```json
{
  "titulo": "Viação e Obras nas ruas",
  "tipo": "servicos",
  "conceito": "Uma frase com a ideia visual do vídeo.",
  "tema": { "destaque": "#FFD400", "selo": "Nome da campanha" },
  "assinatura": { "linha1": "Secretaria Municipal de", "linha2": "Viação e Obras" },
  "transicao": "laminas",
  "vo": { "arquivo": "audio/locucao.wav", "trechos": [ { "de": 0, "ate": 108, "em": 12 } ] },
  "trilha": { "arquivo": "audio/trilha.wav", "inicio": 131, "volume": 0.16, "volumeFinal": 0.3, "sobeEm": 585 },
  "cenas": [ ]
}
```

- `tema`: opcional. Só os campos que mudam; o resto vem do padrão.
- `assinatura`: opcional, e normalmente fica de fora. Sem ela, o slogan "Transparência, trabalho e progresso." aparece embaixo do logo. Use `{ "linha1": "Secretaria Municipal de", "linha2": "..." }` só quando o Rodrigo pedir a secretaria no lugar.
- `transicao`: `laminas`, `cortina`, `subida` ou `corte` (sem transição).
- `vo`: opcional. Cada trecho é uma frase: `de` e `ate` são quadros dentro do arquivo (cortes no meio das pausas, medidos com `pausas.mjs`); `em` é o quadro do vídeo onde a frase entra.
- `trilha`: opcional. `inicio` pula quadros no começo da música; `volume` vale sob a narração; `volumeSemVoz` (padrão 0,7) quando não há narração; `sobeEm` é o quadro em que a música sobe para a assinatura.

### Cenas

Toda cena tem `tipo`, `duracao` (inteiro, mínimo 30) e, menos o fechamento, `midia`: lista de `{ "arquivo": "clips/NOME.mp4", "inicio": 1.5, "velocidade": 1 }` ou de fotos `{ "arquivo": "clips/NOME.jpg", "foco": "50% 30%" }`. Vários itens dividem a duração por igual.

```json
{ "tipo": "abertura", "duracao": 126, "corte": 52,
  "linhas": [ { "numero": 4, "texto": "serviços" }, { "numero": 6, "texto": "bairros", "placa": true } ],
  "chamada": "Viação e Obras nas ruas",
  "midia": [ { "arquivo": "clips/A.mp4" }, { "arquivo": "clips/B.mp4", "inicio": 2 } ] }

{ "tipo": "servico", "duracao": 93, "servico": "Tapa-buraco", "locais": ["Júlio Domingos de Campos"], "midia": [ ] }

{ "tipo": "info", "duracao": 150, "titulo": "Anote aí",
  "itens": [ { "rotulo": "Quando", "valor": "Sábado, 12 de dezembro" }, { "rotulo": "Horário", "valor": "Das 8h às 17h" } ],
  "midia": [ ] }

{ "tipo": "numero", "duracao": 110, "valor": 1500, "prefixo": "R$", "sufixo": "m", "casas": 0, "legenda": "de rede de drenagem", "midia": [ ] }

{ "tipo": "legenda", "duracao": 100, "titulo": "Mais de 20 serviços gratuitos", "apoio": "Leve um documento com foto", "midia": [ ] }

{ "tipo": "fechamento", "duracao": 100 }
```

Limites que mantêm o texto na área segura: até 3 linhas na abertura, até 3 locais por serviço, até 3 itens em `info`. Títulos longos encolhem sozinhos, mas acima de uns 24 caracteres perdem força: reescreva mais curto.

## Durações

- Sem narração: abertura de 90 a 110, cada cena de 90 a 110, `info` de 130 a 160 (precisa de tempo de leitura), fechamento de 90 a 100.
- Com narração: cada cena vai de um corte ao seguinte, e o corte cai uns 6 quadros antes de a frase da cena entrar. O fechamento dura até o fim da última frase mais uns 25 quadros.
- O `render.mjs --conferir` imprime a duração total e os quadros dos cortes.

## Cena sob medida

Para um conceito que a biblioteca não cobre, crie `Cenas.tsx` na pasta do vídeo:

```tsx
import { Dados, Trilho, total } from "../../motor/src/Padrao";
export { total };
export const Video: React.FC<{ dados: Dados }> = ({ dados }) => (
  <Trilho dados={dados}>{/* suas cenas, em <Series> */}</Trilho>
);
```

`Trilho` cuida do áudio, do logo fixo, da barra e das transições nos cortes de `dados.cenas`; por isso as durações em `dados.cenas` precisam bater com as das suas cenas. Leia as cores com `useTema()` e use `titulo()` de `marca.ts` para a tipografia, para a cena nova aceitar qualquer tema.
