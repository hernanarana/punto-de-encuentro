export default function ActiveFilters({
  query, setQuery,
  category, setCategory,
  minRating, setMinRating
}) {

  const tokens = query.trim()
    ? query.trim().split(/\s+/).slice(0, 8)   // hasta 8 palabras
    : []

  const removeToken = (t) => {
    const parts = query.trim().split(/\s+/).filter(w => w.toLowerCase() !== t.toLowerCase())
    setQuery(parts.join(' '))
  }

  const clearQuery = () => setQuery('')
  const clearCategory = () => setCategory('Todas')
  const clearRating = () => setMinRating(0)

  const hasSomething = tokens.length || category !== 'Todas' || minRating > 0

  return (
    <div className="summary-bar">
      <span className="summary-title">Filtros activos:</span>

      {!hasSomething && <span className="muted">Sin filtros</span>}

      {/* tokens de búsqueda */}
      {tokens.map((t, i) => (
        <button key={i} className="chip chip--clear" onClick={() => removeToken(t)} title={`Quitar "${t}"`}>
          “{t}” <span className="chip-x">×</span>
        </button>
      ))}

      {/* categoría */}
      {category !== 'Todas' && (
        <button className="chip chip--clear" onClick={clearCategory} title="Quitar categoría">
          Categoría: {category} <span className="chip-x">×</span>
        </button>
      )}

      {/* rating */}
      {minRating > 0 && (
        <button className="chip chip--clear" onClick={clearRating} title="Quitar calificación">
          Calificación: {minRating}+ <span className="chip-x">×</span>
        </button>
      )}

      {/* botón limpiar todo */}
      {hasSomething && (
        <button
          className="chip chip--danger"
          onClick={() => { clearQuery(); clearCategory(); clearRating(); }}
          title="Limpiar todos los filtros"
        >
          Limpiar todo
        </button>
      )}
    </div>
  )
}
