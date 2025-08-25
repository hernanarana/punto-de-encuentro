export default function SearchBar({ value, onChange }) {
  return (
    <div className="filter-item">
      <label className="label">Buscar</label>
      <input
        className="input"
        placeholder="Buscar por nombre…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
