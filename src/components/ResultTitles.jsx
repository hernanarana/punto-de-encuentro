import { Link } from 'react-router-dom'

export default function ResultTitles({ items }) {
  if (!items?.length) return null

  // Mostramos hasta 20 para no saturar
  const list = items.slice(0, 20)

  return (
    <div className="titles-bar">
      <div className="titles-head">
        <span className="summary-title">Títulos coincidentes</span>
        <span className="muted">({items.length})</span>
      </div>
      <div className="chips-row">
        {list.map(p => (
          <Link key={p.id} to={`/producto/${p.id}`} className="chip chip--link" title={`Ver ${p.name}`}>
            {p.name}
          </Link>
        ))}
        {items.length > list.length && (
          <span className="chip chip--muted">+{items.length - list.length} más</span>
        )}
      </div>
    </div>
  )
}
