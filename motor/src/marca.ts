// MARCA: o que é fixo em todo vídeo da Prefeitura de Várzea Grande.
// Logo, fonte e assinatura não mudam. As cores abaixo são o tema padrão;
// um vídeo pode trocar cores pelo campo "tema" do video.json (campanhas, arte enviada).
import React, { createContext, useContext, useEffect, useState } from "react";
import { continueRender, delayRender } from "remotion";
import { measureText } from "@remotion/layout-utils";
import { loadFont } from "@remotion/google-fonts/BarlowCondensed";
import logoArquivo from "./logo.png";

export const FPS = 30;
export const LARGURA = 1080;
export const ALTURA = 1920;
export const MARGEM = 68; // margem lateral dos textos
// Área segura do Reels: nenhum texto acima de 270 px nem abaixo de 1500 px.

export const LOGO = logoArquivo as unknown as string;
const fonte = loadFont("italic", { weights: ["600", "800"], subsets: ["latin"] });
export const FONTE = fonte.fontFamily;

export type Tema = {
  destaque: string; // placas, números, pinos (padrão: amarelo)
  sobreDestaque: string; // texto em cima do destaque
  base: string; // cor viva da marca (padrão: verde)
  fundo: string; // cartões e lâminas escuras
  noite: string; // base do escurecimento sob os textos
  texto: string; // texto sobre imagem
  selo?: string; // nome curto da campanha, opcional
};

// Medido nas peças oficiais do drive (estáticos de setembro/2026).
export const TEMA_PADRAO: Tema = {
  destaque: "#FFD400",
  sobreDestaque: "#07561B",
  base: "#0A9A2E",
  fundo: "#07561B",
  noite: "#04320F",
  texto: "#FFFFFF",
};

// Assinatura padrão: o slogan da gestão embaixo do logo. linha1 é opcional (ex.: "Secretaria Municipal de").
export const SLOGAN = "Transparência, trabalho e progresso.";
export const ASSINATURA_PADRAO = { linha1: "", linha2: SLOGAN };

const Ctx = createContext<Tema>(TEMA_PADRAO);
export const TemaProvider = Ctx.Provider;
export const useTema = () => useContext(Ctx);
export const montarTema = (t?: Partial<Tema>): Tema => ({ ...TEMA_PADRAO, ...(t ?? {}) });

// "#RRGGBB" + opacidade -> rgba()
export const rgba = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

// Título em caixa alta, condensado e itálico: a voz tipográfica das peças oficiais.
export const titulo = (tamanho: number, peso: 600 | 800 = 800): React.CSSProperties => ({
  fontFamily: FONTE, fontWeight: peso, fontStyle: "italic", fontSize: tamanho, lineHeight: 1,
  textTransform: "uppercase",
});

export const UTIL = LARGURA - 2 * MARGEM; // largura útil dos textos

// Mede a largura real do texto na fonte da marca (depois de a fonte carregar) e devolve o corpo que cabe.
// textos: uma ou mais linhas que devem ter o MESMO corpo. folga: espaço extra em "em" (ex.: o respiro da placa).
// minimo: abaixo disso o texto perde força; devolve o mínimo e quebra=true, para a linha quebrar em vez de encolher.
export const useCaber = (
  textos: string | string[], maximo: number,
  o: { largura?: number; folga?: number; peso?: 600 | 800; minimo?: number; espaco?: number } = {},
) => {
  const lista = Array.isArray(textos) ? textos : [textos];
  const chave = lista.join("\n");
  const { largura = UTIL, folga = 0, peso = 800, minimo = 0, espaco = 0 } = o;
  const [r, setR] = useState({ tamanho: Math.max(minimo, Math.min(maximo, 60)), quebra: false });
  const [espera] = useState(() => delayRender("medir texto"));
  useEffect(() => {
    let vivo = true;
    fonte.waitUntilDone().then(() => {
      if (!vivo) return;
      // largura de cada linha com corpo 100, em caixa alta; 4% de margem para o itálico
      const maior = Math.max(...lista.map((t) =>
        measureText({ text: t.toUpperCase(), fontFamily: FONTE, fontSize: 100, fontWeight: String(peso), letterSpacing: `${espaco}px`, additionalStyles: { fontStyle: "italic" } }).width));
      const cabe = Math.floor(largura / ((maior * 1.04) / 100 + folga));
      setR(cabe < minimo ? { tamanho: minimo, quebra: true } : { tamanho: Math.min(maximo, cabe), quebra: false });
      continueRender(espera);
    }).catch(() => continueRender(espera));
    return () => { vivo = false; };
  }, [chave, maximo, largura, folga, peso, minimo, espaco]);
  return r;
};
