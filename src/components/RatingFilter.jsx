import RatingStars from './RatingStars.jsx'

export default function RatingFilter({ value, onChange }) {
  const set = (n) => onChange(n)
  return (
    <div className="filter-item">
      <label className="label">Calificación mínima</label>
      <div className="rating-filter">
        {[0,1,2,3,4,5].map(n => (
          <button
            key={n}
            className={`chip ${value === n ? 'chip--active' : ''}`}
            onClick={() => set(n)}
            type="button"
            title={n === 0 ? 'Sin filtro' : `${n}+`}
          >
            {n === 0 ? 'Todas' : `${n}+`}
          </button>
        ))}
      </div>
      <div className="rating-current">
        <small>Actual:</small> <RatingStars value={value} />
      </div>
    </div>
  )
}
