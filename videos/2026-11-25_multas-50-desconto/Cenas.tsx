// Conceito "Pela metade": a palavra MULTA é cortada ao meio por uma lâmina amarela,
// a metade de baixo cai e o 50% sobe no lugar. O corte (dados.cenas[0].corte) cai antes da frase do desconto.
import React from "react";
import { AbsoluteFill, Easing, Series, interpolate, useCurrentFrame } from "remotion";
import { MARGEM, UTIL, rgba, titulo, useCaber, useTema } from "../../motor/src/marca";
import { Dados, Trilho, total } from "../../motor/src/Padrao";
import {
  Acabamento, Bloco, CenaInfo, CenaLegenda, Conta, Fechamento, LinhaAbertura, Midia, Placa, Pino, Planos, Sobe, inOut, prog, saida,
} from "../../motor/src/pecas";

export { total };

const ALTO = 640; // topo do bloco da palavra
const MEIO = 190; // altura do corte dentro da palavra, do lado esquerdo
const QUEDA = 70; // quanto o corte sobe até o lado direito

const PelaMetade: React.FC<{
  duracao: number; linhas: LinhaAbertura[]; chamada?: string; corte: number; midia: Midia[]; condicao?: string; condicaoEm?: number;
}> = ({ duracao, linhas, chamada, corte, midia, condicao, condicaoEm = 0 }) => {
  const f = useCurrentFrame();
  const t = useTema();
  const s = saida(f, duracao);
  const [palavra, resto] = linhas.map((l) => l.texto);
  const cp = useCaber(palavra, 400, { espaco: -4 });
  const cr = useCaber(resto, 96, { folga: 0.51, espaco: 0.5 });
  const cn = useCaber("50%", 520, { espaco: -8 });
  const cd = useCaber("de desconto", 170, { folga: 0.51, espaco: 0.5 });
  const cl = useCaber(chamada ?? "", 78, { peso: 600, espaco: 2 });

  const ce = useCaber(condicao ?? "", 78, { espaco: 1 });

  const lamina = interpolate(f, [corte - 12, corte + 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: inOut });
  const cai = interpolate(f, [corte - 2, corte + 13], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const sobe = interpolate(f, [corte - 2, corte + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: inOut });
  const largura = 1080 - 2 * MARGEM;
  // o mesmo bloco duas vezes, cada um com metade visível
  const cima = `polygon(-80px -80px, ${largura + 80}px -80px, ${largura + 80}px ${MEIO - QUEDA}px, -80px ${MEIO}px)`;
  const baixo = `polygon(-80px ${MEIO}px, ${largura + 80}px ${MEIO - QUEDA}px, ${largura + 80}px 900px, -80px 900px)`;

  const bloco = (
    <>
      <Sobe t={prog(f, 4, 18)} style={{ ...titulo(cp.tamanho), lineHeight: 0.96, letterSpacing: -4, color: t.texto, whiteSpace: "nowrap" }}>{palavra}</Sobe>
      <div style={{ marginTop: 10 }}>
        <Placa abre={prog(f, 12, 18)} sobe={prog(f, 16, 18)} tamanho={cr.tamanho}>{resto}</Placa>
      </div>
    </>
  );
  const posicao: React.CSSProperties = { position: "absolute", left: MARGEM, width: largura, top: ALTO, height: 820 };

  return (
    <AbsoluteFill style={{ background: t.noite }}>
      <Planos midia={midia} duracao={duracao} cortes={midia.length === 4 ? [52, corte, corte + 70] : midia.length === 2 ? [corte] : undefined} />
      <Acabamento />
      <AbsoluteFill style={{ background: rgba(t.noite, 0.54) }} />

      {/* antes do corte, a palavra inteira: as duas metades juntas deixariam um fio na emenda */}
      {f < corte - 3 ? <div style={posicao}>{bloco}</div> : null}
      {f >= corte - 3 && f < corte + 18 ? (
        <>
          <div style={{ ...posicao, clipPath: cima, opacity: 1 - sobe, transform: `translateY(${sobe * -70}px)` }}>{bloco}</div>
          <div style={{ ...posicao, clipPath: baixo, opacity: 1 - cai * 0.6, transform: `translateY(${cai * 1500}px) rotate(${cai * 7}deg)`, transformOrigin: "20% 30%" }}>{bloco}</div>
        </>
      ) : null}

      {/* lâmina amarela que atravessa a palavra */}
      {f >= corte - 12 && f < corte + 14 ? (
        <div
          style={{
            position: "absolute", left: -200, width: 1500, top: ALTO + MEIO - QUEDA / 2 - 13, height: 26, background: t.destaque,
            transform: `rotate(${(-Math.atan(QUEDA / largura) * 180) / Math.PI}deg)`,
            clipPath: `inset(0 ${(1 - lamina) * 100}% 0 ${interpolate(f, [corte + 2, corte + 13], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: inOut })}%)`,
          }}
        />
      ) : null}

      {f >= corte ? (
        <div style={{ position: "absolute", left: MARGEM, right: MARGEM, top: 560, opacity: 1 - s, transform: `translateX(${s * -60}px)` }}>
          <Sobe t={prog(f, corte + 10, 18)} style={{ ...titulo(cn.tamanho), lineHeight: 0.94, letterSpacing: -8, color: t.destaque, whiteSpace: "nowrap" }}>
            <Conta ate={50} de={corte + 10} dur={18} />%
          </Sobe>
          <div style={{ marginTop: 6 }}>
            <Placa abre={prog(f, corte + 18, 18)} sobe={prog(f, corte + 22, 18)} tamanho={cd.tamanho}>de desconto</Placa>
          </div>
          {chamada ? (
            <Sobe t={prog(f, corte + 32, 18)} style={{ ...titulo(cl.tamanho, 600), letterSpacing: 2, color: t.texto, marginTop: 34, whiteSpace: "nowrap" }}>
              {chamada}
            </Sobe>
          ) : null}
          {condicao && f >= condicaoEm ? (
            // entra com a fala "pagamento integral, à vista"
            <div style={{ position: "absolute", left: 0, top: "100%", marginTop: 14 }}>
              <Sobe t={prog(f, condicaoEm, 18)} style={{ ...titulo(ce.tamanho), letterSpacing: 1, color: t.destaque, whiteSpace: "nowrap" }}>{condicao}</Sobe>
            </div>
          ) : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ATENDIMENTO. Aparece inteiro logo no começo, embaixo da fala "Aproveite o benefício e fique em dia".
type Atendimento = { rotulo: string; horario: string; local: string[]; orgao: string };
const CenaAtendimento: React.FC<{ duracao: number; titulo: string; atendimento: Atendimento; midia: Midia[] }> = ({
  duracao, titulo: tit, atendimento: at, midia,
}) => {
  const f = useCurrentFrame();
  const t = useTema();
  const ct = useCaber(tit, 112, { folga: 0.51, espaco: 0.5 });
  const ch = useCaber(at.horario, 150, { espaco: -1 });
  const cl = useCaber(at.local, 76, { largura: UTIL - 64 });
  const co = useCaber(at.orgao, 56, { peso: 600, largura: UTIL - 64, espaco: 2 });
  return (
    <AbsoluteFill style={{ background: t.noite }}>
      <Planos midia={midia} duracao={duracao} />
      <Acabamento />
      <AbsoluteFill style={{ background: rgba(t.noite, 0.62) }} />
      <Bloco duracao={duracao} top={620}>
        <Placa abre={prog(f, 4, 18)} sobe={prog(f, 7, 16)} tamanho={ct.tamanho}>{tit}</Placa>
        <div style={{ marginTop: 52 }}>
          <Sobe t={prog(f, 11, 16)} style={{ ...titulo(58, 600), letterSpacing: 3, color: t.destaque, whiteSpace: "nowrap" }}>{at.rotulo}</Sobe>
          <Sobe t={prog(f, 13, 16)} style={{ ...titulo(ch.tamanho), letterSpacing: -1, lineHeight: 1.04, color: t.texto, whiteSpace: "nowrap" }}>{at.horario}</Sobe>
        </div>
        <div style={{ height: 3, borderRadius: 2, background: rgba(t.texto, 0.3), width: `${prog(f, 14, 20) * 100}%`, margin: "30px 0 32px" }} />
        <div style={{ display: "flex", gap: 22, alignItems: "flex-start" }}>
          <div style={{ transform: `scale(${prog(f, 15, 14)})`, transformOrigin: "50% 100%" }}><Pino tamanho={42} /></div>
          <div>
            {at.local.map((l, i) => (
              <Sobe key={l} t={prog(f, 16 + i * 2, 16)} style={{ ...titulo(cl.tamanho), lineHeight: 1.08, color: t.texto, whiteSpace: "nowrap" }}>{l}</Sobe>
            ))}
            <Sobe t={prog(f, 20, 16)} style={{ ...titulo(co.tamanho, 600), letterSpacing: 2, color: t.destaque, marginTop: 14, whiteSpace: "nowrap" }}>{at.orgao}</Sobe>
          </div>
        </div>
      </Bloco>
    </AbsoluteFill>
  );
};

export const Video: React.FC<{ dados: Dados }> = ({ dados }) => {
  const ass = dados.assinatura ?? { linha1: "", linha2: "Transparência, trabalho e progresso" };
  return (
    <Trilho dados={dados}>
      <Series>
        {dados.cenas.map((c, i) => (
          <Series.Sequence key={i} durationInFrames={c.duracao}>
            {c.tipo === "abertura" ? <PelaMetade {...c} corte={c.corte ?? Math.round(c.duracao / 2)} />
              : c.tipo === "info" ? <CenaInfo {...c} />
              : c.tipo === "legenda" && (c as any).atendimento ? <CenaAtendimento {...(c as any)} />
              : c.tipo === "legenda" ? <CenaLegenda {...c} />
              : c.tipo === "fechamento" ? <Fechamento duracao={c.duracao} linha1={ass.linha1} linha2={ass.linha2} />
              : null}
          </Series.Sequence>
        ))}
      </Series>
    </Trilho>
  );
};
