export default function CategoryFilter({ categories, value, onChange }) {
  return (
    <div className="filter-item">
      <label className="label">Categoría</label>
      <select
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {categories.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  )
}
