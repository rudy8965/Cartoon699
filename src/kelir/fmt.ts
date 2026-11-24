import React from "react";

// Format kanvas. Semua scene digambar dengan koordinat portrait (1080x1920, lantai y=1250)
// lalu dipetakan ke format aktif lewat X()/Y() dan skala k.
export type Fmt = { W: number; H: number; GY: number; k: number; wide: boolean };
export const PORTRAIT: Fmt = { W: 1080, H: 1920, GY: 1250, k: 1, wide: false };
export const LANDSCAPE: Fmt = { W: 1920, H: 1080, GY: 770, k: 0.64, wide: true };

export const FmtCtx = React.createContext<Fmt>(PORTRAIT);
export const useFmt = (): Fmt => React.useContext(FmtCtx);

export const useScene = () => {
  const f = useFmt();
  return {
    ...f,
    X: (x: number) => f.W / 2 + (x - 540) * f.k,
    Y: (y: number) => f.GY - (1250 - y) * f.k,
  };
};
