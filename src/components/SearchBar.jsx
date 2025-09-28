// src/components/SearchBar.jsx
import { useState } from "react";
import useIsAndroid from "../hooks/useIsAndroid";

/**
 * SearchBar "blindado" (Android + IME) con botón Buscar opcional.
 * Props: value, onChange, onSubmit?, placeholder?
 */
export default function SearchBar({ value, onChange, onSubmit, placeholder = "Buscar productos…" }) {
  const isAndroid = useIsAndroid();
  const [composing, setComposing] = useState(false);

  const handleChange = (e) => onChange?.(e.target.value);
  const handleInputAndroid = (e) => { if (!composing) onChange?.(e.target.value); };
  const submit = () => { if (typeof onSubmit === "function") onSubmit(); };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={isAndroid ? undefined : handleChange}
        onInput={isAndroid ? handleInputAndroid : undefined}
        onCompositionStart={() => setComposing(true)}
        onCompositionEnd={(e) => { setComposing(false); if (isAndroid) onChange?.(e.target.value); }}
        onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        inputMode="search"
        enterKeyHint="search"
        style={{
          width: "100%", padding: "10px 12px", borderRadius: 12,
          border: "1px solid var(--border, rgba(255,255,255,.12))",
          background: "var(--card, #101a2f)", color: "var(--text, #e6f0ff)",
        }}
      />
      <button
        type="button"
        onClick={submit}
        style={{
          padding: "10px 14px", borderRadius: 12, border: 0,
          background: "var(--primary, #0ea5e9)", color: "#fff", fontWeight: 800,
        }}
      >
        Buscar
      </button>
    </div>
  );
}
