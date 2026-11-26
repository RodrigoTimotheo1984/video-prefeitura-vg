// TESTE de conceito próprio: mesma pauta do vídeo aprovado, com outra abertura.
// Em vez da contagem, os nomes dos serviços empilham na tela, um por batida.
// Mostra como criar uma cena sob medida reaproveitando a marca e as peças da biblioteca.
import React from "react";
import { AbsoluteFill, Series, useCurrentFrame } from "remotion";
import { MARGEM, rgba, titulo, useTema } from "../../motor/src/marca";
import { Dados, Trilho, total } from "../../motor/src/Padrao";
import { Acabamento, CenaServico, Fechamento, Planos, Sobe, prog, saida } from "../../motor/src/pecas";

export { total };

const Empilhado: React.FC<{ duracao: number; palavras: string[]; midia: { arquivo: string; inicio?: number }[] }> = ({
  duracao, palavras, midia,
}) => {
  const f = useCurrentFrame();
  const t = useTema();
  const s = saida(f, duracao);
  const passo = Math.floor((duracao - 40) / palavras.length);
  return (
    <AbsoluteFill style={{ background: t.noite }}>
      <Planos midia={midia} duracao={duracao} />
      <Acabamento />
      <AbsoluteFill style={{ background: rgba(t.noite, 0.55) }} />
      <div style={{ position: "absolute", left: MARGEM, right: MARGEM, top: 470, opacity: 1 - s, transform: `translateY(${s * -80}px)` }}>
        {palavras.map((p, i) => {
          const de = 6 + i * passo;
          const ativo = f >= de + passo && i < palavras.length - 1 ? 0.42 : 1; // as anteriores recuam
          return (
            <div key={p} style={{ opacity: ativo, display: "flex", alignItems: "baseline", gap: 22 }}>
              <Sobe t={prog(f, de, 14)} style={{ ...titulo(54, 600), color: t.destaque, width: 70 }}>{String(i + 1).padStart(2, "0")}</Sobe>
              <Sobe t={prog(f, de, 16)} style={{ ...titulo(150), lineHeight: 1.02, letterSpacing: -1, color: i % 2 ? t.destaque : t.texto }}>{p}</Sobe>
            </div>
          );
        })}
        <div style={{ marginTop: 34, height: 10, borderRadius: 5, background: t.destaque, width: `${prog(f, 6, duracao - 30) * 100}%` }} />
      </div>
    </AbsoluteFill>
  );
};

export const Video: React.FC<{ dados: Dados }> = ({ dados }) => {
  const servicos = dados.cenas.filter((c) => c.tipo === "servico");
  const abertura = dados.cenas[0];
  const fecho = dados.cenas[dados.cenas.length - 1];
  const ass = dados.assinatura ?? { linha1: "Prefeitura de", linha2: "Várzea Grande" };
  return (
    <Trilho dados={dados}>
      <Series>
        <Series.Sequence durationInFrames={abertura.duracao}>
          <Empilhado
            duracao={abertura.duracao}
            palavras={servicos.map((c) => (c.tipo === "servico" ? c.servico : ""))}
            midia={abertura.tipo === "abertura" ? abertura.midia : []}
          />
        </Series.Sequence>
        {servicos.map((c, i) =>
          c.tipo === "servico" ? (
            <Series.Sequence key={i} durationInFrames={c.duracao}>
              <CenaServico {...c} n={i + 1} total={servicos.length} />
            </Series.Sequence>
          ) : null,
        )}
        <Series.Sequence durationInFrames={fecho.duracao}>
          <Fechamento duracao={fecho.duracao} linha1={ass.linha1} linha2={ass.linha2} />
        </Series.Sequence>
      </Series>
    </Trilho>
  );
};
