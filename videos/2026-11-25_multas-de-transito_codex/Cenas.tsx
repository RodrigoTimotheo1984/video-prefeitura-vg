import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ASSINATURA_PADRAO, FONTE, useTema } from "../../motor/src/marca";
import { Dados, Trilho, cortes, total } from "../../motor/src/Padrao";
import { Fechamento } from "../../motor/src/pecas";

export { total };

const progresso = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    easing: Easing.bezier(0.33, 0, 0.15, 1),
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
const mistura = (de: number, ate: number, p: number) => de + (ate - de) * p;

const Letra: React.FC<{
  x?: number; y: number; corpo: number; cor?: string; largura?: number;
  peso?: 600 | 800; espaco?: number; children: React.ReactNode;
}> = ({ x = 82, y, corpo, cor = "white", largura, peso = 800, espaco = 0, children }) => (
  <text x={x} y={y} fill={cor} fontFamily={FONTE} fontStyle="italic" fontWeight={peso}
    fontSize={corpo} letterSpacing={espaco} textLength={largura} lengthAdjust="spacingAndGlyphs">
    {children}
  </text>
);

const Sinalizacao: React.FC<{f: number}> = ({ f }) => {
  const drift = mistura(0, -38, progresso(f, 0, 420));
  const curva = "M 1250,-380 C 1480,155 1164,190 1019,368 S 958,630 1260,718";
  const avenida = "M -255,1310 C 116,1490 137,1744 452,1831 S 924,1860 1280,2220";
  return (
    <g fill="none">
      <g transform={`translate(0 ${drift})`}>
        <path d={curva} stroke="#8ac683" strokeOpacity=".19" strokeWidth="146"/>
        <path d={curva} stroke="#134c26" strokeWidth="142"/>
        <path d={curva} stroke="#b4d65d" strokeOpacity=".47" strokeWidth="4" strokeDasharray="34 36" strokeDashoffset={-f * 0.39}/>
      </g>
      <g transform={`translate(${-drift} ${drift * 0.35})`}>
        <path d={avenida} stroke="#8dbf80" strokeOpacity=".23" strokeWidth="126"/>
        <path d={avenida} stroke="#104423" strokeWidth="122"/>
        <path d={avenida} stroke="#e9ce45" strokeOpacity=".62" strokeWidth="4" strokeDasharray="29 34" strokeDashoffset={f * -0.38}/>
      </g>
    </g>
  );
};

const Painel: React.FC<{dados: Dados}> = ({dados}) => {
  const f = useCurrentFrame();
  const t = useTema();
  const [condicao, vencimento, chamada, assinatura] = cortes(dados);
  const entra = progresso(f, -11, 13);
  const detalhe = progresso(f, condicao - 5, condicao + 8);
  const faixa = progresso(f, condicao - 9, condicao + 7);
  const giro = progresso(f, vencimento - 13, vencimento + 11);
  const saiOferta = progresso(f, vencimento - 13, vencimento);
  const data = progresso(f, vencimento - 1, vencimento + 13);
  const saiData = progresso(f, chamada - 11, chamada + 1);
  const regularize = progresso(f, chamada - 3, chamada + 11);
  const some = progresso(f, assinatura - 9, assinatura);
  const amarelo = t.destaque;
  const deX = mistura(675, 84, giro);
  const deY = mistura(947, 1046, giro);
  const ateX = mistura(867, 970, giro);
  const ateY = mistura(652, 1046, giro);

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 67% 33%, #146632 0%, #094527 49%, #042e19 100%)" }}>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: "absolute" }}>
        <Sinalizacao f={f}/>
      </svg>
      <AbsoluteFill style={{ backgroundImage: `url("${staticFile("grao.png")}")`, backgroundSize: "320px 320px", opacity: 0.44 }}/>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: "absolute", opacity: 1 - some }}>
        <defs>
          <clipPath id="titulo"><rect x="60" y="530" width="930" height="452"/></clipPath>
          <clipPath id="mensagem"><rect x="65" y="631" width="944" height="402"/></clipPath>
        </defs>

        <g opacity={1 - saiData}>
          <path d="M84 403 L159 403" stroke={amarelo} strokeWidth="9"/>
          <Letra y={473} corpo={53} peso={600} espaco={1}>MULTAS DE TRÂNSITO MUNICIPAIS</Letra>
          <Letra y={530} corpo={48} peso={600} cor="#c8e6ca">DE VÁRZEA GRANDE</Letra>
        </g>

        <g opacity={1 - saiOferta}>
          <g clipPath="url(#titulo)">
            <g transform={`translate(0 ${(1 - entra) * 70 - saiOferta * 40})`}>
              <Letra x={68} y={951} corpo={480} largura={542} cor={amarelo}>50</Letra>
            </g>
          </g>
          <g fill="none" stroke={amarelo} strokeWidth="24">
            <ellipse cx="682" cy="707" rx="43" ry="53" transform="rotate(17 682 707)"/>
            <ellipse cx="861" cy="900" rx="43" ry="53" transform="rotate(17 861 900)"/>
          </g>
          <Letra x={79} y={1080} corpo={128} espaco={-1}>DE DESCONTO</Letra>
          <g opacity={detalhe} transform={`translate(0 ${(1 - detalhe) * 15})`}>
            <Letra y={1162} corpo={55} peso={600}>SOBRE O VALOR ATUALIZADO</Letra>
          </g>
        </g>

        <g opacity={1 - saiData}>
          <path d={`M ${deX},${deY} L ${ateX},${ateY}`} stroke={amarelo} strokeWidth={mistura(29, 13, giro)}/>
          <path d={`M ${deX},${deY} L ${ateX},${ateY}`} stroke="#23522a" strokeOpacity={giro * 0.9}
            strokeWidth="3" strokeDasharray="29 24" strokeDashoffset={-giro * 56}/>
        </g>
        <g opacity={data * (1 - saiData)} transform={`translate(0 ${(1 - data) * 33 - saiData * 30})`}>
          <Letra y={770} corpo={79}>MULTAS VENCIDAS ATÉ</Letra>
          <Letra x={70} y={985} corpo={207} largura={891} cor={amarelo}>31/12/2025</Letra>
        </g>

        <g opacity={1 - saiData} clipPath={`inset(0 ${(1 - faixa) * 100}% 0 0)`}>
          <path d="M82 1264 H914 L895 1369 H64 Z" fill={amarelo}/>
          <Letra x={110} y={1337} corpo={59} largura={747} cor="#093c22">PAGAMENTO INTEGRAL À VISTA</Letra>
        </g>

        <g opacity={regularize} clipPath="url(#mensagem)">
          <g transform={`translate(0 ${(1 - regularize) * 72})`}>
            <Letra x={76} y={817} corpo={157} largura={806}>REGULARIZE</Letra>
            <Letra x={76} y={1007} corpo={232} largura={882} cor={amarelo}>SUA MULTA</Letra>
          </g>
        </g>
        <path d="M85 1108 H840 L805 1138 M840 1108 L816 1078"
          fill="none" stroke={amarelo} strokeWidth="9"
          pathLength="1" strokeDasharray="1 1" strokeDashoffset={1 - regularize} opacity={regularize}/>
      </svg>
    </AbsoluteFill>
  );
};

export const Video: React.FC<{dados: Dados}> = ({dados}) => {
  const fim = dados.cenas[dados.cenas.length - 1].duracao;
  const inicio = total(dados) - fim;
  return (
    <Trilho dados={dados}>
      <Sequence durationInFrames={inicio}><Painel dados={dados}/></Sequence>
      <Sequence from={inicio} durationInFrames={fim}>
        <Fechamento duracao={fim} {...ASSINATURA_PADRAO}/>
      </Sequence>
    </Trilho>
  );
};
