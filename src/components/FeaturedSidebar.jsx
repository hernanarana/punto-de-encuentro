// src/components/FeaturedSidebar.jsx
export default function FeaturedSidebar({ items }) {
  // Si te pasan items por props los usa; si no, muestra 4 de ejemplo.
  const featured = (items && items.length ? items : [
    { id: 1, name: 'Producto 1', price: 0, img: '/productos/placeholder.jpg' },
    { id: 2, name: 'Producto 2', price: 0, img: '/productos/placeholder.jpg' },
    { id: 3, name: 'Producto 3', price: 0, img: '/productos/placeholder.jpg' },
    { id: 4, name: 'Producto 4', price: 0, img: '/productos/placeholder.jpg' },
  ]);

  return (
    <aside className="featured-aside" aria-label="Destacados">
      <h3 className="featured-title">Destacados</h3>

      <ul className="featured-list">
        {featured.map(p => (
          <li key={p.id}>
            <a className="featured-card" href={`/producto/${p.id}`}>
              <div className="featured-thumb">
                <img src={p.img} alt={p.name} />
              </div>

              <div className="featured-info">
                <div className="featured-name">{p.name}</div>
                <div className="featured-price">${p.price}</div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
