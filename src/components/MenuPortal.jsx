// src/components/MenuPortal.jsx
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function useMenuTarget() {
  const [target, setTarget] = useState(null);
  useEffect(() => {
    const find = () => {
      const el =
        document.querySelector(".side-menu.is-open .side-menu__body") ||
        document.querySelector(".side-menu .side-menu__body");
      setTarget(el || null);
    };
    find();
    const mo = new MutationObserver(find);
    mo.observe(document.body, { childList: true, subtree: true });
    const iv = setInterval(find, 250);
    return () => {
      mo.disconnect();
      clearInterval(iv);
    };
  }, []);
  return target;
}

export default function MenuPortal({ children }) {
  const target = useMenuTarget();

  useEffect(() => {
    if (!target) return;
    // banderas para CSS
    document.body.setAttribute("data-filter-mounted", "1");
    target.classList.add("with-filter-panel");
    const side = target.closest(".side-menu");
    side?.classList.add("menu-has-filter");
    return () => {
      target.classList.remove("with-filter-panel");
      target.closest(".side-menu")?.classList.remove("menu-has-filter");
      document.body.removeAttribute("data-filter-mounted");
    };
  }, [target]);

  if (!target) return null;
  return createPortal(children, target);
}
