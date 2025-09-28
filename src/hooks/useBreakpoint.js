import { useEffect, useState } from "react";

/** Devuelve true si coincide el breakpoint (por defecto: mobile <= 767px) */
export default function useBreakpoint(query = "(max-width: 767px)") {
  const getMatch = () =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false;

  const [isMatch, setIsMatch] = useState(getMatch);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setIsMatch(e.matches);
    if (mql.addEventListener) mql.addEventListener("change", handler);
    else mql.addListener(handler);
    setIsMatch(mql.matches);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", handler);
      else mql.removeListener(handler);
    };
  }, [query]);

  return isMatch;
}
