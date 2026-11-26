// BIBLIOTECA DE PEÇAS. Use, combine, varie ou crie cenas novas em videos/<vídeo>/Cenas.tsx.
// Tudo aqui lê as cores do tema (useTema), então uma campanha de outra cor reaproveita as peças.
import React from "react";
import {
  AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { ALTURA, FONTE, LARGURA, LOGO, MARGEM, UTIL, rgba, titulo, useCaber, useTema } from "./marca";

/* ---------- movimento ---------- */

export const expo = Easing.bezier(0.16, 1, 0.3, 1);
export const inOut = Easing.bezier(0.76, 0, 0.24, 1);
// Progresso de 0 a 1 a partir do quadro "de", durante "dur" quadros.
export const prog = (f: number, de: number, dur: number, e = expo) =>
  interpolate(f, [de, de + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
// Saída nos últimos quadros da cena (0 = dentro, 1 = fora).
export const saida = (f: number, duracao: number) =>
  interpolate(f, [duracao - 9, duracao - 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: inOut });

/* ---------- imagem ---------- */

export type Midia = { arquivo: string; inicio?: number; velocidade?: number; foco?: string };
const ehFoto = (a: string) => /\.(jpe?g|png|webp)$/i.test(a);

// Vídeo ou foto em tela cheia. Vídeo: soco de zoom na entrada e empurrão lento. Foto: aproximação contínua.
export const Plano: React.FC<{ m: Midia; dur: number; dir?: 1 | -1 }> = ({ m, dur, dir = 1 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const foto = ehFoto(m.arquivo);
  const soco = interpolate(f, [0, 10], [0.09, 0], { extrapolateRight: "clamp", easing: expo });
  const zoom = foto ? 1.04 + interpolate(f, [0, dur], [0, 0.14]) : 1.06 + soco + interpolate(f, [0, dur], [0, 0.055]);
  const deriva = interpolate(f, [0, dur], [-10 * dir, 10 * dir]) * (foto ? 2.2 : 1);
  const estilo: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", objectPosition: m.foco ?? "50% 50%" };
  return (
    <AbsoluteFill style={{ transform: `scale(${zoom}) translateX(${deriva}px)` }}>
      {foto ? (
        <Img src={staticFile(m.arquivo)} style={estilo} />
      ) : (
        <OffthreadVideo
          src={staticFile(m.arquivo)}
          startFrom={Math.round((m.inicio ?? 0) * fps)}
          playbackRate={m.velocidade ?? 1}
          muted
          style={estilo}
        />
      )}
    </AbsoluteFill>
  );
};

// Sequência de planos dividindo a duração da cena por igual.
export const Planos: React.FC<{ midia: Midia[]; duracao: number; cortes?: number[] }> = ({ midia, duracao, cortes }) => {
  const t = useTema();
  if (!midia?.length) return <AbsoluteFill style={{ background: `linear-gradient(160deg, ${t.base}, ${t.fundo} 60%, ${t.noite})` }} />;
  const cada = Math.ceil(duracao / midia.length);
  // cortes: quadros (dentro da cena) onde cada plano seguinte entra; sem isso, divide por igual.
  const inicios = cortes?.length === midia.length - 1 ? [0, ...cortes] : midia.map((_, i) => i * cada);
  return (
    <>
      {midia.map((m, i) => {
        const dur = (i + 1 < inicios.length ? inicios[i + 1] : duracao) - inicios[i];
        return (
          <Sequence key={i} from={inicios[i]} durationInFrames={Math.max(1, dur)}>
            <Plano m={m} dur={dur} dir={i % 2 ? -1 : 1} />
          </Sequence>
        );
      })}
    </>
  );
};

// Acabamento igual em todos os planos: véu da cor do tema, vinheta e base escura para o texto.
export const Acabamento: React.FC<{ forca?: number }> = ({ forca = 1 }) => {
  const t = useTema();
  return (
    <>
      <AbsoluteFill style={{ background: rgba(t.fundo, 0.1), mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ background: "radial-gradient(120% 85% at 50% 42%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.42) 100%)" }} />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0) 17%, rgba(0,0,0,0) 46%, ${rgba(t.noite, 0.7 * forca)} 76%, ${rgba(t.noite, 0.84 * forca)} 100%)`,
        }}
      />
    </>
  );
};

/* ---------- marca fixa ---------- */

export const Selo: React.FC = () => {
  const f = useCurrentFrame();
  const tema = useTema();
  const t = prog(f, 6, 18);
  return (
    <div style={{ position: "absolute", left: MARGEM, top: 150, display: "flex", alignItems: "center", gap: 18, opacity: t, transform: `translateY(${(1 - t) * -24}px)` }}>
      <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "10px 16px 10px 12px", boxShadow: "0 8px 30px rgba(0,0,0,0.28)" }}>
        <Img src={LOGO} style={{ height: 86, display: "block" }} />
      </div>
      {tema.selo ? (
        // nome da campanha ao lado do logo, quando o tema tiver um
        <div style={{ ...titulo(38, 800), letterSpacing: 3, color: tema.sobreDestaque, background: tema.destaque, padding: "8px 18px 12px", borderRadius: 8, transform: "skewX(-9deg)" }}>
          {tema.selo}
        </div>
      ) : null}
    </div>
  );
};

export const BarraMarca: React.FC = () => {
  const t = useTema();
  return (
    <div
      style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: 16,
        background: `linear-gradient(90deg, ${t.base} 0%, ${t.base} 35%, ${t.destaque} 100%)`,
      }}
    />
  );
};

/* ---------- tipografia ---------- */

// Texto revelado por máscara, subindo de baixo.
export const Sobe: React.FC<{ t: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ t, children, style }) => (
  <div style={{ overflow: "hidden", paddingRight: 24, marginRight: -24, paddingTop: 8, marginTop: -8 }}>
    <div style={{ transform: `translateY(${(1 - t) * 108}%)`, ...style }}>{children}</div>
  </div>
);

// Placa inclinada na cor de destaque, com o texto por cima. "abre" e "sobe" vão de 0 a 1.
export const Placa: React.FC<{ abre: number; sobe: number; tamanho: number; children: React.ReactNode }> = ({
  abre, sobe, tamanho, children,
}) => {
  const t = useTema();
  return (
    <div style={{ display: "inline-block", position: "relative" }}>
      <div
        style={{
          position: "absolute", inset: 0, background: t.destaque, transform: "skewX(-9deg)",
          transformOrigin: "left center", clipPath: `inset(0 ${(1 - abre) * 100}% 0 0)`, borderRadius: 6,
        }}
      />
      <div style={{ position: "relative", padding: `${tamanho * 0.05}px ${tamanho * 0.29}px ${tamanho * 0.1}px ${tamanho * 0.22}px` }}>
        <Sobe t={sobe} style={{ ...titulo(tamanho), color: t.sobreDestaque, letterSpacing: 0.5, whiteSpace: "nowrap" }}>{children}</Sobe>
      </div>
    </div>
  );
};

export const Pino: React.FC<{ tamanho?: number }> = ({ tamanho = 40 }) => {
  const t = useTema();
  return (
    <svg width={tamanho} height={tamanho * 1.3} viewBox="0 0 40 52" style={{ flex: "none", marginTop: 6 }}>
      <path d="M20 0C9 0 0 8.7 0 19.5 0 33.6 20 52 20 52s20-18.4 20-32.5C40 8.7 31 0 20 0z" fill={t.destaque} />
      <circle cx="20" cy="19.5" r="7.5" fill={t.noite} />
    </svg>
  );
};

// Número que conta de zero até o valor, com separador de milhar.
export const Conta: React.FC<{ ate: number; de?: number; dur?: number; casas?: number }> = ({ ate, de = 0, dur = 14, casas = 0 }) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [de, de + dur], [0, ate], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: expo });
  return <>{v.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas })}</>;
};

// Contador "02 / 04" com trilho de progresso.
export const Progresso: React.FC<{ n: number; total: number; duracao: number }> = ({ n, total, duracao }) => {
  const f = useCurrentFrame();
  const t = useTema();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 22, opacity: prog(f, 2, 12) }}>
      <div style={{ ...titulo(40), color: t.destaque, letterSpacing: 2 }}>
        {String(n).padStart(2, "0")}
        <span style={{ color: rgba(t.texto, 0.55) }}> / {String(total).padStart(2, "0")}</span>
      </div>
      <div style={{ display: "flex", gap: 8, flex: 1 }}>
        {Array.from({ length: total }, (_, i) => {
          const cheio = i < n - 1 ? 1 : i === n - 1 ? interpolate(f, [0, duracao], [0, 1]) : 0;
          return (
            <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: rgba(t.texto, 0.28) }}>
              <div style={{ width: `${cheio * 100}%`, height: "100%", borderRadius: 3, background: t.destaque }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Bloco de texto que entra e, no fim da cena, sai deslizando.
export const Bloco: React.FC<{ duracao: number; top: number; children: React.ReactNode }> = ({ duracao, top, children }) => {
  const f = useCurrentFrame();
  const s = saida(f, duracao);
  return (
    <div style={{ position: "absolute", left: MARGEM, right: MARGEM, top, opacity: 1 - s, transform: `translateX(${s * -60}px)` }}>
      {children}
    </div>
  );
};

/* ---------- cenas prontas ---------- */

export type LinhaAbertura = { numero?: number; texto: string; placa?: boolean };

// ABERTURA. Linhas grandes (a que tiver placa:true vai na placa de destaque) e uma chamada.
export const Abertura: React.FC<{
  duracao: number; linhas: LinhaAbertura[]; chamada?: string; midia: Midia[]; corte?: number;
}> = ({ duracao, linhas, chamada, midia, corte }) => {
  const f = useCurrentFrame();
  const t = useTema();
  const textos = linhas.map((l) => (l.numero === undefined ? "" : l.numero.toLocaleString("pt-BR") + " ") + l.texto);
  // todas as linhas com o mesmo corpo; a placa pede folga para o respiro lateral
  const { tamanho: corpo } = useCaber(textos, 214, { folga: linhas.some((l) => l.placa) ? 0.51 : 0 });
  const ch = useCaber(chamada ?? "", 62, { peso: 600, largura: UTIL - 116, espaco: 3 });
  return (
    <AbsoluteFill style={{ background: t.noite }}>
      <Planos midia={midia} duracao={duracao} cortes={corte && midia.length === 2 ? [corte] : undefined} />
      <Acabamento />
      <AbsoluteFill style={{ background: rgba(t.noite, 0.38) }} />
      <Bloco duracao={duracao} top={560}>
        {linhas.map((l, i) => {
          const de = 8 + i * 16;
          const conteudo = (
            <>
              {l.numero === undefined ? null : <><Conta ate={l.numero} de={de} dur={12} />{" "}</>}
              {l.texto}
            </>
          );
          return l.placa ? (
            <div key={i} style={{ marginTop: 14 }}>
              <Placa abre={prog(f, de - 4, 20)} sobe={prog(f, de, 20)} tamanho={corpo}>{conteudo}</Placa>
            </div>
          ) : (
            <Sobe key={i} t={prog(f, de, 20)} style={{ ...titulo(corpo), lineHeight: 0.94, letterSpacing: -1, color: t.texto, whiteSpace: "nowrap" }}>
              {conteudo}
            </Sobe>
          );
        })}
        {chamada ? (
          <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 96 * prog(f, 14 + linhas.length * 16, 18), height: 8, borderRadius: 4, background: t.destaque }} />
            <Sobe t={prog(f, 16 + linhas.length * 16, 18)} style={{ ...titulo(ch.tamanho, 600), letterSpacing: 3, color: t.texto, whiteSpace: "nowrap" }}>
              {chamada}
            </Sobe>
          </div>
        ) : null}
      </Bloco>
    </AbsoluteFill>
  );
};

// Um local com pino. Nome longo quebra em duas linhas em vez de encolher demais.
const Local: React.FC<{ texto: string; i: number }> = ({ texto, i }) => {
  const f = useCurrentFrame();
  const t = useTema();
  const c = useCaber(texto, 78, { peso: 600, largura: UTIL - 60, minimo: 62 });
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 2 }}>
      <div style={{ transform: `scale(${prog(f, 15 + i * 6, 14)})`, transformOrigin: "50% 100%" }}><Pino /></div>
      <Sobe
        t={prog(f, 17 + i * 6, 18)}
        style={{ ...titulo(c.tamanho, 600), lineHeight: 1.06, color: t.texto, textShadow: "0 4px 22px rgba(0,0,0,0.45)", whiteSpace: c.quebra ? "normal" : "nowrap" }}
      >
        {texto}
      </Sobe>
    </div>
  );
};

// SERVIÇO E LOCAIS. Nome do serviço na placa e os locais com pino.
export const CenaServico: React.FC<{
  duracao: number; servico: string; locais: string[]; midia: Midia[]; n?: number; total?: number;
}> = ({ duracao, servico, locais, midia, n, total }) => {
  const f = useCurrentFrame();
  const t = useTema();
  const s = useCaber(servico, 118, { folga: 0.51, espaco: 0.5 });
  return (
    <AbsoluteFill style={{ background: t.noite }}>
      <Planos midia={midia} duracao={duracao} />
      <Acabamento />
      <Bloco duracao={duracao} top={1010}>
        {n && total ? <Progresso n={n} total={total} duracao={duracao} /> : null}
        <Placa abre={prog(f, 5, 20)} sobe={prog(f, 9, 18)} tamanho={s.tamanho}>{servico}</Placa>
        <div style={{ marginTop: 24 }}>
          {locais.map((l, i) => <Local key={l} texto={l} i={i} />)}
        </div>
      </Bloco>
    </AbsoluteFill>
  );
};

// Uma linha de informação: rótulo pequeno na cor de destaque e o valor grande.
const ItemInfo: React.FC<{ rotulo: string; valor: string; de: number }> = ({ rotulo, valor, de }) => {
  const f = useCurrentFrame();
  const t = useTema();
  const c = useCaber(valor, 104, { minimo: 74 });
  return (
    <div style={{ marginBottom: 30 }}>
      <div style={{ height: 3, borderRadius: 2, background: rgba(t.texto, 0.3), width: `${prog(f, de, 22) * 100}%`, marginBottom: 18 }} />
      <Sobe t={prog(f, de + 2, 16)} style={{ ...titulo(44, 600), letterSpacing: 5, color: t.destaque }}>{rotulo}</Sobe>
      <Sobe t={prog(f, de + 5, 18)} style={{ ...titulo(c.tamanho), lineHeight: 1.06, color: t.texto, whiteSpace: c.quebra ? "normal" : "nowrap" }}>{valor}</Sobe>
    </div>
  );
};

// INFORMAÇÃO. Um título e linhas "rótulo: valor" (quando, horário, onde). Para avisos e convocações.
export const CenaInfo: React.FC<{
  duracao: number; titulo: string; itens: { rotulo: string; valor: string }[]; midia: Midia[];
}> = ({ duracao, titulo: tit, itens, midia }) => {
  const f = useCurrentFrame();
  const t = useTema();
  const ct = useCaber(tit, 104, { folga: 0.51, espaco: 0.5 });
  return (
    <AbsoluteFill style={{ background: t.noite }}>
      <Planos midia={midia} duracao={duracao} />
      <Acabamento />
      <AbsoluteFill style={{ background: rgba(t.noite, 0.5) }} />
      <Bloco duracao={duracao} top={600}>
        <Placa abre={prog(f, 4, 20)} sobe={prog(f, 8, 18)} tamanho={ct.tamanho}>{tit}</Placa>
        <div style={{ marginTop: 44 }}>
          {itens.map((it, i) => <ItemInfo key={it.rotulo} rotulo={it.rotulo} valor={it.valor} de={18 + i * 9} />)}
        </div>
      </Bloco>
    </AbsoluteFill>
  );
};

// NÚMERO. Um número grande que conta, com legenda. Para obra ou entrega.
export const CenaNumero: React.FC<{
  duracao: number; valor: number; prefixo?: string; sufixo?: string; casas?: number; legenda: string; midia: Midia[];
}> = ({ duracao, valor, prefixo, sufixo, casas = 0, legenda, midia }) => {
  const f = useCurrentFrame();
  const t = useTema();
  const texto = valor.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
  // prefixo e sufixo saem a 45% do corpo: entram como folga na conta
  const folga = (prefixo ? prefixo.length * 0.24 + 0.12 : 0) + (sufixo ? sufixo.length * 0.24 + 0.12 : 0);
  const { tamanho: corpo } = useCaber(texto, 300, { folga, espaco: -2 });
  const cl = useCaber(legenda, 84, { peso: 600, minimo: 66 });
  return (
    <AbsoluteFill style={{ background: t.noite }}>
      <Planos midia={midia} duracao={duracao} />
      <Acabamento />
      <Bloco duracao={duracao} top={940}>
        <div style={{ width: 120 * prog(f, 4, 18), height: 10, borderRadius: 5, background: t.destaque, marginBottom: 18 }} />
        <Sobe t={prog(f, 6, 20)} style={{ ...titulo(corpo), letterSpacing: -2, color: t.destaque, textShadow: "0 6px 30px rgba(0,0,0,0.4)", whiteSpace: "nowrap" }}>
          {prefixo ? <span style={{ fontSize: corpo * 0.45, marginRight: 12 }}>{prefixo}</span> : null}
          <Conta ate={valor} de={6} dur={26} casas={casas} />
          {sufixo ? <span style={{ fontSize: corpo * 0.45, marginLeft: 12 }}>{sufixo}</span> : null}
        </Sobe>
        <Sobe t={prog(f, 20, 18)} style={{ ...titulo(cl.tamanho, 600), lineHeight: 1.08, color: t.texto, marginTop: 12, whiteSpace: cl.quebra ? "normal" : "nowrap" }}>
          {legenda}
        </Sobe>
      </Bloco>
    </AbsoluteFill>
  );
};

// LEGENDA. Título de apoio sobre a imagem, com fio lateral. Para cobertura de evento.
export const CenaLegenda: React.FC<{ duracao: number; titulo: string; apoio?: string; midia: Midia[] }> = ({
  duracao, titulo: tit, apoio, midia,
}) => {
  const f = useCurrentFrame();
  const t = useTema();
  const c1 = useCaber(tit, 116, { largura: UTIL - 40, minimo: 96 });
  const c2 = useCaber(apoio ?? "", 60, { peso: 600, largura: UTIL - 40, espaco: 2, minimo: 48 });
  return (
    <AbsoluteFill style={{ background: t.noite }}>
      <Planos midia={midia} duracao={duracao} />
      <Acabamento />
      <Bloco duracao={duracao} top={c1.quebra ? 1030 : 1130}>
        <div style={{ display: "flex", gap: 26 }}>
          <div style={{ width: 12, borderRadius: 6, background: t.destaque, transform: `scaleY(${prog(f, 4, 20)})`, transformOrigin: "50% 0" }} />
          <div>
            <Sobe t={prog(f, 8, 20)} style={{ ...titulo(c1.tamanho), lineHeight: 1.02, color: t.texto, textShadow: "0 4px 22px rgba(0,0,0,0.45)", whiteSpace: c1.quebra ? "normal" : "nowrap" }}>
              {tit}
            </Sobe>
            {apoio ? (
              <Sobe t={prog(f, 16, 18)} style={{ ...titulo(c2.tamanho, 600), letterSpacing: 2, color: t.destaque, marginTop: 10, whiteSpace: c2.quebra ? "normal" : "nowrap" }}>
                {apoio}
              </Sobe>
            ) : null}
          </div>
        </div>
      </Bloco>
    </AbsoluteFill>
  );
};

// FECHAMENTO. Assinatura fixa: logo em cartão branco e, embaixo, o slogan (ou o nome da pasta, quando pedido).
export const Fechamento: React.FC<{ duracao: number; linha1: string; linha2: string }> = ({ duracao, linha1, linha2 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTema();
  const cartao = spring({ frame: f - 8, fps, config: { damping: 18, stiffness: 110, mass: 0.9 } });
  const cf = useCaber(linha2, linha1 ? 96 : 72, { largura: 940 });
  const respira = 1 + interpolate(f, [0, duracao], [0, 0.035]);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 80% at 50% 38%, ${t.base} 0%, ${t.fundo} 62%, ${t.noite} 100%)` }}>
      {[0, 1, 2].map((i) => {
        const p = prog(f, 2 + i * 5, 34);
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: -300, top: 1560 + i * 120, width: 1700, height: 70 - i * 16,
              background: i === 1 ? "rgba(255,255,255,0.10)" : t.destaque, opacity: i === 2 ? 0.55 : 1,
              transform: `rotate(-14deg) translateX(${(1 - p) * -1500}px)`,
            }}
          />
        );
      })}
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div
          style={{
            marginTop: 600, background: "#FFFFFF", borderRadius: 44, padding: "56px 64px", boxShadow: "0 30px 80px rgba(0,0,0,0.32)",
            transform: `scale(${(0.82 + cartao * 0.18) * respira})`, opacity: Math.min(1, cartao * 1.4),
          }}
        >
          <Img src={LOGO} style={{ width: 760, display: "block" }} />
        </div>
        <div style={{ marginTop: 64, textAlign: "center" }}>
          {linha1 ? <Sobe t={prog(f, 28, 22)} style={{ ...titulo(50, 600), letterSpacing: 4, color: "rgba(255,255,255,0.82)" }}>{linha1}</Sobe> : null}
          <Sobe t={prog(f, 34, 22)} style={{ ...titulo(cf.tamanho), lineHeight: 1.05, color: "#FFFFFF", whiteSpace: "nowrap" }}>{linha2}</Sobe>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- transições (cobrem a troca de cena; duram 24 quadros, com o corte no quadro 11) ---------- */

// LÂMINAS: três faixas inclinadas cruzam da esquerda para a direita.
export const PassagemLaminas: React.FC = () => {
  const f = useCurrentFrame();
  const t = useTema();
  const laminas = [{ cor: t.fundo, atraso: 0, larg: 1500 }, { cor: t.base, atraso: 2, larg: 1500 }, { cor: t.destaque, atraso: 4, larg: 420 }];
  return (
    <AbsoluteFill>
      {laminas.map((l, i) => {
        const p = interpolate(f, [l.atraso, l.atraso + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: inOut });
        return (
          <div
            key={i}
            style={{
              position: "absolute", top: -200, height: 2400, width: l.larg, background: l.cor,
              left: interpolate(p, [0, 1], [-l.larg - 500, 1700]), transform: "skewX(-14deg)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// CORTINA: persianas verticais fecham e abrem em cascata.
export const PassagemCortina: React.FC = () => {
  const f = useCurrentFrame();
  const t = useTema();
  const n = 6;
  return (
    <AbsoluteFill>
      {Array.from({ length: n }, (_, i) => {
        const fecha = prog(f, i * 1.2, 9, inOut);
        const abre = prog(f, 12 + i * 1.2, 10, inOut);
        const cor = i % 3 === 2 ? t.destaque : i % 2 ? t.base : t.fundo;
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: (LARGURA / n) * i - 1, width: LARGURA / n + 2, top: 0, height: ALTURA, background: cor,
              transform: `scaleY(${fecha - abre})`, transformOrigin: abre > 0 ? "50% 100%" : "50% 0",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// SUBIDA: um painel sobe de baixo, cobre a tela e segue para cima, com um fio de destaque na frente.
export const PassagemSubida: React.FC = () => {
  const f = useCurrentFrame();
  const t = useTema();
  const p = interpolate(f, [0, 22], [0, 1], { extrapolateRight: "clamp", easing: inOut });
  const y = interpolate(p, [0, 1], [ALTURA + 200, -ALTURA - 400]);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: y, height: ALTURA + 300, background: `linear-gradient(180deg, ${t.base}, ${t.fundo})` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: y - 40, height: 40, background: t.destaque }} />
    </AbsoluteFill>
  );
};

export const PASSAGENS = { laminas: PassagemLaminas, cortina: PassagemCortina, subida: PassagemSubida } as const;
export { FONTE };
