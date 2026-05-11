import { PixelMatrix, PixelPalette } from "./PixelSprite";

/**
 * Pixel matrix for each character. 16 cols × 20 rows.
 * Legend per character defines what each letter means.
 *
 * Conventions:
 *   .  transparent
 *   k  outline / dark
 *   s  skin
 *   h  hair
 *   c  primary clothing
 *   d  secondary clothing
 *   a  accent (jewellery, gadget)
 *   e  eyes
 *   m  mouth
 */

// ---------- ROBUSCA · Chief of Staff ----------
// Female · warm SA-English · yellow blouse, gold earrings
export const robusca: { matrix: PixelMatrix; palette: PixelPalette } = {
  matrix: [
    "................",
    "....khhhhhk.....",
    "...hhhhhhhhh....",
    "..hh ssssss hh..",
    "..h sssssss h...",
    "..h se s se h...",
    "..h sssm sss h..",
    "..h sssssss h...",
    "...hsssssss h...",
    "....sssssss.....",
    "...accccccca....",
    "...ccccccccc....",
    "...cc ccccc cc..",
    "...c  ccccc  c..",
    "...c  ccccc  c..",
    "...c  ccccc  c..",
    "...d  ccccc  d..",
    "...d  ddddd  d..",
    "...kk       kk..",
    "................",
  ],
  palette: {
    k: "#2A1A05",
    h: "#4A2C12",
    s: "#A06B47",
    c: "#FFD60A",
    d: "#FF7A1A",
    a: "#FFE066",
    e: "#0B0E14",
    m: "#7B2D1A",
  },
};

// ---------- ADAM · Sales (CashClaw) ----------
// Male · confident dealmaker · suit + tie
export const adam: { matrix: PixelMatrix; palette: PixelPalette } = {
  matrix: [
    "................",
    ".....khhhhk.....",
    "....hhhhhhhh....",
    "....hsssss h....",
    "....h se s h....",
    "....hsssms h....",
    "....hsssss h....",
    "....hsssssh.....",
    "....sssssss.....",
    "...cc s s cc....",
    "..cccc a cccc...",
    "..cccc a cccc...",
    "..cccc a cccc...",
    "..cccc a cccc...",
    "..cccc a cccc...",
    "..cccc   cccc...",
    "..cccc   cccc...",
    "..cccc   cccc...",
    "..kk       kk...",
    "................",
  ],
  palette: {
    k: "#0A0A0A",
    h: "#1A1A1A",
    s: "#B07A50",
    c: "#1F2533",
    a: "#FFD60A",
    e: "#0B0E14",
    m: "#7B2D1A",
  },
};

// ---------- CHARLIE · Customer (Studex Meat) ----------
// Friendly SA-English · apron + cap
export const charlie: { matrix: PixelMatrix; palette: PixelPalette } = {
  matrix: [
    "................",
    "....kdddddk.....",
    "...ddddddddd....",
    "...d ksssk d....",
    "....sssssss.....",
    "....se s se.....",
    "....sssmsss.....",
    "....sssssss.....",
    "....sssssss.....",
    "...cccccccccc...",
    "...c ccccc  c...",
    "...c c   c  c...",
    "...c c a c  c...",
    "...c c a c  c...",
    "...c c   c  c...",
    "...c ccccc  c...",
    "...c        c...",
    "...c        c...",
    "...kk      kk...",
    "................",
  ],
  palette: {
    k: "#2C1810",
    d: "#7B2D1A",
    s: "#C18B65",
    c: "#F2E8DC",
    a: "#FF7A1A",
    e: "#0B0E14",
    m: "#5A1A0A",
  },
};

// ---------- DENCHCLAW · Customer (cross-business) ----------
// Headset, casual
export const denchclaw: { matrix: PixelMatrix; palette: PixelPalette } = {
  matrix: [
    "................",
    "....khhhhhk.....",
    "...hhhhhhhhh....",
    "..a hsssssh a...",
    "..a hssssshh a..",
    "..a h se sh a...",
    "..ahhsssmsshha..",
    "...hhsssssshh...",
    "....sssssss.....",
    "....cccccccc....",
    "...cccccccccc...",
    "...c cccccc c...",
    "...c cccccc c...",
    "...c cccccc c...",
    "...c cccccc c...",
    "...c cccccc c...",
    "...c        c...",
    "...c        c...",
    "...kk      kk...",
    "................",
  ],
  palette: {
    k: "#2A1A05",
    h: "#3A2410",
    s: "#A06B47",
    c: "#2D6F4E",
    a: "#FFD60A",
    e: "#0B0E14",
    m: "#7B2D1A",
  },
};

// ---------- RESEARCH · curious analyst ----------
// Glasses, hooded
export const research: { matrix: PixelMatrix; palette: PixelPalette } = {
  matrix: [
    "................",
    "....khhhhhk.....",
    "...hhhhhhhhh....",
    "..hhsssssss hh..",
    "..h aaaaa  h....",
    "..h aaeaae h....",
    "..h sssmsss h...",
    "..h sssssss h...",
    "....sssssss.....",
    "....cccccccc....",
    "...cc cccc cc...",
    "...c  cccc  c...",
    "...c  cccc  c...",
    "...c  cccc  c...",
    "...c  cccc  c...",
    "...c  cccc  c...",
    "...c        c...",
    "...c        c...",
    "...kk      kk...",
    "................",
  ],
  palette: {
    k: "#2A1A05",
    h: "#4D2A0E",
    s: "#A06B47",
    c: "#5B3A8C",
    a: "#FFD60A",
    e: "#0B0E14",
    m: "#7B2D1A",
  },
};

// ---------- OPENFANG · sharp web scraper ----------
// Asymmetric hair, hoodie
export const openfang: { matrix: PixelMatrix; palette: PixelPalette } = {
  matrix: [
    "................",
    "...khhhhhk......",
    "..hhhhhhhh......",
    ".hhhsssssh......",
    ".h hssssshh.....",
    ".h hseesseh.....",
    ".h hsssmsh......",
    ".hhhsssssh......",
    "....sssss.......",
    "....ccccc.......",
    "...ccccccc......",
    "..cc     cc.....",
    "..c   a   c.....",
    "..c       c.....",
    "..c       c.....",
    "..c       c.....",
    "..c       c.....",
    "..c       c.....",
    "..kk     kk.....",
    "................",
  ],
  palette: {
    k: "#0B0E14",
    h: "#FF7A1A",
    s: "#B07A50",
    c: "#1F2533",
    a: "#FFD60A",
    e: "#FFD60A",
    m: "#7B2D1A",
  },
};

// ---------- CTO · DevOps lead ----------
// Hoodie, laptop emanating glow
export const cto: { matrix: PixelMatrix; palette: PixelPalette } = {
  matrix: [
    "................",
    "....khhhhhk.....",
    "...hhhhhhhhh....",
    "..hhsssssss hh..",
    "..h se   se h...",
    "..h sssmsss h...",
    "..h sssssss h...",
    "....sssssss.....",
    "...ccccccccc....",
    "..ccccccccccc...",
    "..c    a    c...",
    "..c   aaa   c...",
    "..c  aaaaa  c...",
    "..c    a    c...",
    "..c   ddd   c...",
    "..c  ddddd  c...",
    "..c ddddddd c...",
    "..c         c...",
    "..kk       kk...",
    "................",
  ],
  palette: {
    k: "#0B0E14",
    h: "#1A1A1A",
    s: "#B07A50",
    c: "#11151F",
    a: "#FFD60A",
    d: "#FF7A1A",
    e: "#FFD60A",
    m: "#7B2D1A",
  },
};

// ---------- SKUNK WORKS · build/CI ----------
// Hard hat + tool
export const skunkworks: { matrix: PixelMatrix; palette: PixelPalette } = {
  matrix: [
    "................",
    "....aaaaaaaa....",
    "...aaaaaaaaaa...",
    "...aaaaaaaaaa...",
    "....ksssssk.....",
    "....s se se.....",
    "....s sssms.....",
    "....s sssss.....",
    "....sssssss.....",
    "...cccccccc.....",
    "..cc cccc cc....",
    "..c  cccc  c....",
    "..c  cccc  c....",
    "..c  cccc  c....",
    "..c  cccc  c....",
    "..c        c....",
    "..c    d   c....",
    "..c   ddd  c....",
    "..kk  ddd kk....",
    "................",
  ],
  palette: {
    k: "#2A1A05",
    a: "#FFD60A",
    s: "#A06B47",
    c: "#2C5F9E",
    d: "#9C9C9C",
    e: "#0B0E14",
    m: "#7B2D1A",
  },
};

// ---------- DR FIX-IT · heartbeat/repair ----------
// Lab coat, wrench, stethoscope
export const drfixit: { matrix: PixelMatrix; palette: PixelPalette } = {
  matrix: [
    "................",
    ".....khhhhk.....",
    "....hhhhhhhh....",
    "....hsssss h....",
    "....h se s h....",
    "....h sssm h....",
    "....hsssssh.....",
    "....sssssss.....",
    "...cccccccc.....",
    "..ccddddddd cc..",
    "..c  ccccc   c..",
    "..c  ccccc   c..",
    "..c  ccccc   c..",
    "..c  ccccc   c..",
    "..c  cccdc   c..",
    "..c  cccdc   c..",
    "..c     d    c..",
    "..c     d    c..",
    "..kk        kk..",
    "................",
  ],
  palette: {
    k: "#2A1A05",
    h: "#4A2C12",
    s: "#A06B47",
    c: "#F2F4F8",
    d: "#FF7A1A",
    e: "#0B0E14",
    m: "#7B2D1A",
  },
};

// ---------- THE LADY · Media ----------
// Polished, camera/microphone
export const theLady: { matrix: PixelMatrix; palette: PixelPalette } = {
  matrix: [
    "................",
    "...khhhhhhhk....",
    "..hhhhhhhhhhh...",
    "..hhsssssss hh..",
    "..h se s se h...",
    "..h sssmmss h...",
    "..h sssssss h...",
    "...hsssssssh....",
    "....sssssss.....",
    "...ccccccccc....",
    "..cccccccccc....",
    "..cc aaaaa cc...",
    "..c aaaaaaa c...",
    "..c  aaaaa  c...",
    "..c  ccccc  c...",
    "..c  ccccc  c...",
    "..c  ccccc  c...",
    "..c         c...",
    "..kk       kk...",
    "................",
  ],
  palette: {
    k: "#2A1A05",
    h: "#1A1A1A",
    s: "#C18B65",
    c: "#7B2D1A",
    a: "#FFD60A",
    e: "#0B0E14",
    m: "#A03050",
  },
};

// ---------- TUMELO · Iron Man ----------
// Full red and gold armor, arc reactor, classic stance
export const tumeloIronMan: { matrix: PixelMatrix; palette: PixelPalette } = {
  matrix: [
    "................",
    ".....akkkka.....",
    "....aaaaaaaa....",
    "....a aeea a....",
    "....a aeea a....",
    "....aaaaaaaa....",
    "....aa kk aa....",
    ".....aakkaa.....",
    "..kkccccccccskk.",
    ".kccccccccccccck",
    ".kc ccccccccc ck",
    ".kc cc abc cc ck",
    ".kc cc abc cc ck",
    ".kc cc abc cc ck",
    ".kc ccccccccc ck",
    ".kc ccc   ccc ck",
    ".kkc cc   cc ckk",
    "...kkk     kkk..",
    "...kcc     cck..",
    "...kcc     cck..",
  ],
  palette: {
    k: "#1A0500",
    c: "#B11226",
    a: "#FFD60A",
    s: "#FF7A1A",
    e: "#7DF9FF",
    b: "#7DF9FF",
  },
};

export const characters = {
  robusca,
  adam,
  charlie,
  denchclaw,
  research,
  openfang,
  cto,
  skunkworks,
  drfixit,
  "the-lady": theLady,
  "tumelo-ironman": tumeloIronMan,
} as const;

export type CharacterKey = keyof typeof characters;
