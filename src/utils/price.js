// src/utils/price.js
export const formatMilesAR = (n) =>
  Number(n ?? 0).toLocaleString("es-AR", {
    maximumFractionDigits: 0,
    useGrouping: true,
  });

export const formatARS = (n, withDecimals = false) =>
  Number(n ?? 0).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: withDecimals ? 2 : 0,
  });
