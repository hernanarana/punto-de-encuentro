// src/pages/Home.jsx
import PRODUCTS from "../data/products.js";
import OfferBanner from "../components/OfferBanner.jsx";
import FilterSidebar from "../components/FilterSidebar.jsx";
import FeaturedSidebar from "../components/FeaturedSidebar.jsx";
import ProductGrid from "../components/ProductGrid.jsx";

export default function Home() {
  const products = PRODUCTS; // podés filtrar o paginar después

  return (
    <main className="container site-content">
      <div className="layout-grid">
        {/* Columna izquierda: FILTROS (solo desktop) */}
        <aside className="desktop-only">
          <FilterSidebar />
        </aside>

        {/* Columna central: banner + productos */}
        <section>
          <OfferBanner />
          <div className="grid grid--products" style={{ marginTop: 12 }}>
            <ProductGrid products={products} />
          </div>
        </section>

        {/* Columna derecha: DESTACADOS (solo desktop) */}
        <aside className="desktop-only">
          <FeaturedSidebar />
        </aside>
      </div>
    </main>
  );
}
