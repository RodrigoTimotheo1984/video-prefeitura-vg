// Vídeo do perfil da PREFEITA (não da Prefeitura): marca, fonte e fechamento são próprios deste arquivo.
// Conceito "A seta leva o serviço": a seta da campanha atravessa a tela nas trocas de cena e, no calendário,
// desce a rota parando em cada bairro; as datas se acumulam até a tela virar um calendário bom para print.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, Series, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Poppins";
import { TemaProvider, montarTema, rgba } from "../../motor/src/marca";
import { cortes, total } from "../../motor/src/Padrao";
import { Conta, Midia, Planos, expo, inOut, prog, saida } from "../../motor/src/pecas";

export { total };

const { fontFamily: POPPINS } = loadFont("normal", { weights: ["500", "600", "700", "800"], subsets: ["latin"] });
const tx = (tamanho: number, peso: 500 | 600 | 700 | 800 = 800): React.CSSProperties => ({
  fontFamily: POPPINS, fontWeight: peso, fontSize: tamanho, lineHeight: 1.1, letterSpacing: peso >= 700 ? -0.5 : 0,
});

// Cores medidas no card
const LARANJA = "#E89824";
const VERDE = "#3C6C50";
const ESCURO = "#14301F";
const CLARO = "#F2F3EF";
const TINTA = "#1D2420";
const M = 72;

// Texto revelado por máscara, com folga para os acentos e a descida das letras.
const Sobe: React.FC<{ t: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ t, children, style }) => (
  <div style={{ overflow: "hidden", fontSize: style?.fontSize, padding: "0.12em 24px 0.24em 0", margin: "-0.12em -24px -0.24em 0" }}>
    <div style={{ transform: `translateY(${(1 - t) * 145}%)`, ...style }}>{children}</div>
  </div>
);

// Seta da campanha: dobra em duas cores.
const Seta: React.FC<{ tamanho: number; cima?: string; baixo?: string; style?: React.CSSProperties }> = ({
  tamanho, cima = VERDE, baixo = LARANJA, style,
}) => (
  <svg width={tamanho * 0.62} height={tamanho} viewBox="0 0 62 100" style={{ display: "block", flex: "none", ...style }}>
    <path d="M0 0H32L62 50 48 73 18 50Z" fill={cima} />
    <path d="M62 50 32 100H0L31 50 44 27Z" fill={baixo} />
  </svg>
);

const Pino: React.FC<{ tamanho: number; cor: string; furo: string }> = ({ tamanho, cor, furo }) => (
  <svg width={tamanho} height={tamanho * 1.3} viewBox="0 0 40 52" style={{ display: "block", flex: "none" }}>
    <path d="M20 0C9 0 0 8.7 0 19.5 0 33.6 20 52 20 52s20-18.4 20-32.5C40 8.7 31 0 20 0z" fill={cor} />
    <circle cx="20" cy="19.5" r="7.5" fill={furo} />
  </svg>
);

// Placa reta do card (retângulo laranja atrás do texto).
const Placa: React.FC<{ abre: number; sobe: number; tamanho: number; cor?: string; children: React.ReactNode }> = ({
  abre, sobe, tamanho, cor = LARANJA, children,
}) => (
  <div style={{ position: "relative", display: "inline-block", overflow: "hidden", verticalAlign: "top" }}>
    <div style={{ position: "absolute", inset: 0, background: cor, clipPath: `inset(0 ${(1 - abre) * 100}% 0 0)` }} />
    <div style={{ position: "relative", padding: `${tamanho * 0.1}px ${tamanho * 0.24}px ${tamanho * 0.16}px` }}>
      <Sobe t={sobe} style={{ ...tx(tamanho), color: "#FFF", whiteSpace: "nowrap" }}>{children}</Sobe>
    </div>
  </div>
);

const Veu: React.FC<{ forca?: number }> = ({ forca = 1 }) => (
  <>
    <AbsoluteFill style={{ background: "radial-gradient(120% 85% at 50% 42%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.4) 100%)" }} />
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0) 18%, ${rgba(ESCURO, 0.1)} 42%, ${rgba(ESCURO, 0.78 * forca)} 74%, ${rgba(ESCURO, 0.88 * forca)} 100%)`,
      }}
    />
  </>
);

/* ---------- 1. abertura: hierarquia do título do card ---------- */
const Abertura: React.FC<{ duracao: number; midia: Midia[]; corte?: number }> = ({ duracao, midia, corte }) => {
  const f = useCurrentFrame();
  const s = saida(f, duracao);
  return (
    <AbsoluteFill style={{ background: ESCURO }}>
      <Planos midia={midia} duracao={duracao} cortes={corte && midia.length === 2 ? [corte] : undefined} />
      <Veu />
      <div style={{ position: "absolute", left: M, top: 930, transform: `translateX(${s * 260}px)` }}>
        <Sobe t={prog(f, 3, 18)} style={{ ...tx(104), color: "#FFF" }}>Mais de</Sobe>
        <div style={{ marginTop: 14 }}>
          <Placa abre={prog(f, 8, 18)} sobe={prog(f, 12, 18)} tamanho={122}><Conta ate={27} de={12} dur={18} /> serviços</Placa>
        </div>
        <div style={{ marginTop: -1 }}>
          <Placa abre={prog(f, 14, 18)} sobe={prog(f, 18, 18)} tamanho={122}>gratuitos</Placa>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 38 }}>
          <div style={{ transform: `scale(${prog(f, 28, 14)})`, transformOrigin: "50% 100%" }}><Pino tamanho={48} cor={LARANJA} furo={ESCURO} /></div>
          <Sobe t={prog(f, 30, 18)} style={{ ...tx(60, 700), color: "#FFF", whiteSpace: "nowrap" }}>5 regiões atendidas</Sobe>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 2 e 4. frase com a seta no lugar do fio ---------- */
const Frase: React.FC<{ duracao: number; titulo: string; apoio?: string; midia: Midia[] }> = ({ duracao, titulo, apoio, midia }) => {
  const f = useCurrentFrame();
  const s = saida(f, duracao);
  const linhas = titulo.split("\n");
  const base = 1180 - (linhas.length - 1) * 60;
  return (
    <AbsoluteFill style={{ background: ESCURO }}>
      <Planos midia={midia} duracao={duracao} />
      <Veu />
      <div style={{ position: "absolute", left: M, right: M, top: base, display: "flex", gap: 34, alignItems: "flex-start", transform: `translateX(${s * 260}px)` }}>
        <div style={{ transform: `translateX(${(1 - prog(f, 3, 20)) * -220}px)`, opacity: prog(f, 3, 8) }}>
          <Seta tamanho={linhas.length * 112} cima="#FFFFFF" />
        </div>
        <div>
          {linhas.map((l, i) => (
            <Sobe key={l} t={prog(f, 8 + i * 5, 20)} style={{ ...tx(98), color: "#FFF", whiteSpace: "nowrap", textShadow: "0 4px 22px rgba(0,0,0,0.35)" }}>{l}</Sobe>
          ))}
          {apoio ? <Sobe t={prog(f, 20, 18)} style={{ ...tx(46, 600), color: "#FFD08A", marginTop: 18, whiteSpace: "nowrap" }}>{apoio}</Sobe> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 3. calendário: a seta desce a rota ---------- */
type Parada = { dia: string; mes: string; regiao: string; bairro: string; escola: string };
const TOPO = 610;
const PASSO = 218;
const ROTA = M + 34;

const Calendario: React.FC<{ duracao: number; paradas: Parada[]; em: number[]; midia: Midia[] }> = ({ duracao, paradas, em, midia }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = saida(f, duracao);
  // posição da seta: sai de cima e viaja até cada parada, chegando junto da batida
  let y = TOPO + 8;
  em.forEach((q, i) => {
    const de = i ? TOPO + (i - 1) * PASSO + 78 : TOPO + 8;
    if (f >= q - 14) y = interpolate(f, [q - 14, q], [de, TOPO + i * PASSO + 78], { extrapolateRight: "clamp", easing: inOut });
  });
  return (
    <AbsoluteFill style={{ background: CLARO }}>
      {/* imagem de fundo lavada, como no card */}
      <AbsoluteFill style={{ filter: "grayscale(0.75)", opacity: 0.2 }}><Planos midia={midia} duracao={duracao} /></AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${rgba(CLARO, 0.5)} 0%, ${rgba(CLARO, 0.86)} 26%, ${rgba(CLARO, 0.86)} 78%, ${rgba(CLARO, 0.35)} 100%)` }} />
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${s * 260}px)` }}>
        <div style={{ position: "absolute", left: M, top: 318 }}>
          <Sobe t={prog(f, 4, 18)} style={{ ...tx(78), color: VERDE, whiteSpace: "nowrap" }}>Todos os sábados</Sobe>
          <div style={{ marginTop: 12 }}>
            <Placa abre={prog(f, 8, 18)} sobe={prog(f, 12, 18)} tamanho={84}>das 8h às 11h30</Placa>
          </div>
        </div>
        {/* rota */}
        <div style={{ position: "absolute", left: ROTA - 3, top: TOPO, width: 6, height: PASSO * 3 + 78, borderRadius: 3, background: `repeating-linear-gradient(180deg, ${rgba(VERDE, 0.3)} 0 14px, transparent 14px 28px)`, opacity: prog(f, 10, 16) }} />
        <div style={{ position: "absolute", left: ROTA - 4, top: TOPO, width: 8, height: Math.max(0, y - TOPO), borderRadius: 4, background: VERDE }} />
        {paradas.map((p, i) => {
          const q = em[i];
          const pino = spring({ frame: f - q, fps, config: { damping: 13, stiffness: 170, mass: 0.7 } });
          const yy = TOPO + i * PASSO;
          return (
            <React.Fragment key={p.dia + p.mes}>
              <div style={{ position: "absolute", left: ROTA - 34, top: yy + 78 - 72, transform: `scale(${f < q ? 0 : pino})`, transformOrigin: "50% 100%" }}>
                <Pino tamanho={68} cor={LARANJA} furo="#FFFFFF" />
              </div>
              <div style={{ position: "absolute", left: M + 104, right: M, top: yy, height: PASSO - 26, display: "flex", alignItems: "stretch", clipPath: `inset(-40px ${(1 - prog(f, q - 1, 18)) * 100}% -60px 0)`, filter: "drop-shadow(0 10px 22px rgba(20,48,31,0.14))" }}>
                <div style={{ width: 170, background: VERDE, borderRadius: "14px 0 0 14px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ ...tx(92), lineHeight: 0.98, color: "#FFF" }}>{p.dia}</div>
                  <div style={{ ...tx(38, 700), color: "#FFD08A", letterSpacing: 5, marginRight: -5 }}>{p.mes}</div>
                </div>
                <div style={{ flex: 1, background: "#FFFFFF", borderRadius: "0 14px 14px 0", padding: "0 0 0 28px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ ...tx(34, 600), color: "#B36D0B" }}>{p.regiao}</div>
                  <div style={{ ...tx(56), color: TINTA, whiteSpace: "nowrap", lineHeight: 1.12 }}>{p.bairro}</div>
                  <div style={{ ...tx(35, 500), color: "#3E4742", whiteSpace: "nowrap", marginTop: 5, letterSpacing: -0.4 }}>{p.escola}</div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
        {/* seta viajante, some depois da última parada */}
        <div style={{ position: "absolute", left: ROTA - 27, top: y - 62, opacity: prog(f, em[0] - 14, 4) * (1 - prog(f, em[em.length - 1] - 1, 4)) * (em.some((q) => f >= q - 14 && f <= q) ? 1 : 0), transform: "rotate(90deg)" }}>
          <Seta tamanho={88} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 5. fechamento da prefeita ---------- */
const Fim: React.FC<{ duracao: number }> = ({ duracao }) => {
  const f = useCurrentFrame();
  const respira = 1 + interpolate(f, [0, duracao], [0, 0.025]);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(110% 70% at 50% 42%, #FFFFFF 0%, ${CLARO} 60%, #E2E6DF 100%)` }}>
      {[0, 1, 2].map((i) => {
        const p = prog(f, 4 + i * 4, 32);
        return (
          <div key={i} style={{ position: "absolute", right: -70 + i * 150, bottom: -90, opacity: i ? (i === 1 ? 0.5 : 0.22) : 1, transform: `translateX(${(1 - p) * -1400}px)` }}>
            <Seta tamanho={420} />
          </div>
        );
      })}
      <AbsoluteFill style={{ alignItems: "center", transform: `scale(${respira})` }}>
        <div style={{ marginTop: 520, clipPath: `inset(0 ${(1 - prog(f, 10, 24)) * 100}% 0 0)` }}>
          <Img src={staticFile("arte/acelera.png")} style={{ width: 800, display: "block" }} />
        </div>
        <div style={{ marginTop: 92, width: 220 * prog(f, 24, 18), height: 6, borderRadius: 3, background: LARANJA }} />
        <div style={{ marginTop: 92, opacity: prog(f, 28, 14), transform: `translateY(${(1 - prog(f, 28, 22)) * 40}px)` }}>
          <Img src={staticFile("arte/flavia_verde.png")} style={{ width: 520, display: "block" }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- transição: a seta atravessa e cobre a troca (24 quadros, corte no 11) ---------- */
const PassagemSeta: React.FC = () => {
  const f = useCurrentFrame();
  const P = 620; // avanço da ponta
  const corpo = 1080 + P + 260;
  const camada = (cor: string, atraso: number, larg: number, extra: number) => {
    const p = interpolate(f, [atraso, atraso + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: inOut });
    const x = interpolate(p, [0, 1], [-larg - P - 80, 1080 + 120 + extra]);
    return <polygon key={cor} points={`${x},0 ${x + larg},0 ${x + larg + P},960 ${x + larg},1920 ${x},1920 ${x + P},960`} fill={cor} />;
  };
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        {camada(LARANJA, 0, corpo, 0)}
        {camada(VERDE, 1.5, corpo - 260, 0)}
        {camada("#FFFFFF", 3, 70, 0)}
      </svg>
    </AbsoluteFill>
  );
};

const SeloCampanha: React.FC = () => {
  const f = useCurrentFrame();
  const t = prog(f, 6, 18);
  return (
    <div style={{ position: "absolute", left: M, top: 148, background: "#FFF", borderRadius: 18, padding: "12px 22px", boxShadow: "0 8px 30px rgba(0,0,0,0.2)", opacity: t, transform: `translateY(${(1 - t) * -24}px)` }}>
      <Img src={staticFile("arte/acelera.png")} style={{ height: 92, display: "block" }} />
    </div>
  );
};

export const Video: React.FC<{ dados: any }> = ({ dados }) => {
  const f = useCurrentFrame();
  const fim = total(dados);
  const inicioFim = fim - dados.cenas[dados.cenas.length - 1].duracao;
  const tr = dados.trilha;
  return (
    <TemaProvider value={montarTema(dados.tema)}>
      <AbsoluteFill style={{ background: ESCURO }}>
        <Audio
          src={staticFile(tr.arquivo)} startFrom={tr.inicio}
          volume={(q) => interpolate(q, [0, 8, fim - 24, fim - 1], [0, tr.volumeSemVoz, tr.volumeSemVoz, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
        <Series>
          {dados.cenas.map((c: any, i: number) => (
            <Series.Sequence key={i} durationInFrames={c.duracao}>
              {c.tipo === "abertura" ? <Abertura {...c} />
                : c.tipo === "calendario" ? <Calendario {...c} />
                : c.tipo === "legenda" ? <Frase {...c} />
                : <Fim duracao={c.duracao} />}
            </Series.Sequence>
          ))}
        </Series>
        {f < inicioFim ? <SeloCampanha /> : null}
        {f < inicioFim ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 16, background: `linear-gradient(90deg, ${VERDE} 0%, ${VERDE} 35%, ${LARANJA} 100%)` }} /> : null}
        {cortes(dados).map((c: number) => <Sequence key={c} from={c - 11} durationInFrames={24}><PassagemSeta /></Sequence>)}
      </AbsoluteFill>
    </TemaProvider>
  );
};
