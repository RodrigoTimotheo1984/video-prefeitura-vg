// COMPOSIÇÃO PADRÃO: monta o vídeo a partir da lista de cenas do video.json.
// Um vídeo com conceito próprio pode ter videos/<vídeo>/Cenas.tsx exportando "Video" e "total";
// nesse caso este arquivo serve só de referência (use Trilho para áudio, marca e transições).
import React from "react";
import { AbsoluteFill, Audio, Sequence, Series, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ASSINATURA_PADRAO, Tema, TemaProvider, montarTema } from "./marca";
import {
  Abertura, BarraMarca, CenaInfo, CenaLegenda, CenaNumero, CenaServico, Fechamento, LinhaAbertura, Midia, PASSAGENS, Selo,
} from "./pecas";

export type Cena =
  | { tipo: "abertura"; duracao: number; linhas: LinhaAbertura[]; chamada?: string; midia: Midia[]; corte?: number }
  | { tipo: "servico"; duracao: number; servico: string; locais: string[]; midia: Midia[] }
  | { tipo: "info"; duracao: number; titulo: string; itens: { rotulo: string; valor: string }[]; midia: Midia[] }
  | { tipo: "numero"; duracao: number; valor: number; prefixo?: string; sufixo?: string; casas?: number; legenda: string; midia: Midia[] }
  | { tipo: "legenda"; duracao: number; titulo: string; apoio?: string; midia: Midia[] }
  | { tipo: "fechamento"; duracao: number };

export type Dados = {
  titulo?: string;
  tema?: Partial<Tema>;
  assinatura?: { linha1: string; linha2: string };
  transicao?: keyof typeof PASSAGENS | "corte";
  // Narração: cada trecho é uma frase. de/ate = quadros no arquivo; em = quadro do vídeo onde entra.
  vo?: { arquivo: string; trechos: { de: number; ate: number; em: number }[] };
  // Trilha: baixa sob a narração, mais alta a partir de sobeEm. Sem narração, usa volumeSemVoz.
  trilha?: { arquivo: string; inicio?: number; volume?: number; volumeSemVoz?: number; volumeFinal?: number; sobeEm?: number };
  cenas: Cena[];
};

export const total = (d: Dados) => d.cenas.reduce((s, c) => s + c.duracao, 0);

// Quadros onde uma cena termina e outra começa.
export const cortes = (d: Dados) => {
  const c: number[] = [];
  let t = 0;
  d.cenas.slice(0, -1).forEach((cena) => { t += cena.duracao; c.push(t); });
  return c;
};

// Áudio, logo fixo, barra e transições: o que acompanha qualquer sequência de cenas.
export const Trilho: React.FC<{ dados: Dados; children: React.ReactNode }> = ({ dados, children }) => {
  const f = useCurrentFrame();
  const fim = total(dados);
  const cs = cortes(dados);
  const ultima = dados.cenas[dados.cenas.length - 1];
  const inicioFechamento = ultima?.tipo === "fechamento" ? fim - ultima.duracao : fim;
  const comVoz = (dados.vo?.trechos?.length ?? 0) > 0;
  const tr = dados.trilha;
  const base = comVoz ? tr?.volume ?? 0.16 : tr?.volumeSemVoz ?? 0.7;
  const alto = comVoz ? tr?.volumeFinal ?? 0.3 : tr?.volumeSemVoz ?? 0.7;
  const sobe = Math.max(9, Math.min(tr?.sobeEm ?? inicioFechamento, fim - 60));
  const Passagem = dados.transicao === "corte" ? null : PASSAGENS[dados.transicao ?? "laminas"];
  return (
    <TemaProvider value={montarTema(dados.tema)}>
      <AbsoluteFill style={{ background: montarTema(dados.tema).noite }}>
        {comVoz
          ? dados.vo!.trechos.map((t) => (
              <Sequence key={t.em} from={t.em} durationInFrames={t.ate - t.de}>
                <Audio src={staticFile(dados.vo!.arquivo)} startFrom={t.de} endAt={t.ate} />
              </Sequence>
            ))
          : null}
        {tr?.arquivo ? (
          <Audio
            src={staticFile(tr.arquivo)}
            startFrom={tr.inicio ?? 0}
            volume={(q) =>
              interpolate(q, [0, 8, sobe, sobe + 25, fim - 16, fim - 1], [0, base, base, alto, alto, 0], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
              })
            }
          />
        ) : null}
        {children}
        {f < inicioFechamento ? <Selo /> : null}
        {f < inicioFechamento ? <BarraMarca /> : null}
        {Passagem ? cs.map((c) => <Sequence key={c} from={c - 11} durationInFrames={24}><Passagem /></Sequence>) : null}
      </AbsoluteFill>
    </TemaProvider>
  );
};

export const Padrao: React.FC<{ dados: Dados }> = ({ dados }) => {
  const servicos = dados.cenas.filter((c) => c.tipo === "servico").length;
  let n = 0;
  const ass = dados.assinatura ?? ASSINATURA_PADRAO;
  return (
    <Trilho dados={dados}>
      <Series>
        {dados.cenas.map((c, i) => (
          <Series.Sequence key={i} durationInFrames={c.duracao}>
            {c.tipo === "abertura" ? <Abertura {...c} />
              : c.tipo === "servico" ? <CenaServico {...c} n={++n} total={servicos} />
              : c.tipo === "info" ? <CenaInfo {...c} />
              : c.tipo === "numero" ? <CenaNumero {...c} />
              : c.tipo === "legenda" ? <CenaLegenda {...c} />
              : <Fechamento duracao={c.duracao} linha1={ass.linha1} linha2={ass.linha2} />}
          </Series.Sequence>
        ))}
      </Series>
    </Trilho>
  );
};
