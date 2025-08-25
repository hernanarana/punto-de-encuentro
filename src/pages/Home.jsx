import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import PRODUCTS from "../data/products.js";

import OfferBanner from "../components/OfferBanner.jsx";
import FeaturedSidebar from "../components/FeaturedSidebar.jsx";
import FilterSidebar from "../components/FilterSidebar.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import MobileFilters from "../components/MobileFilters.jsx";

const toSlug = (s = "") =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")
   .replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");

export default function Home() {
  const { slug } = useParams();

  const categories = useMemo(() => Array.from(new Set(PRODUCTS.map(p=>p.category).filter(Boolean))), []);
  const brands     = useMemo(() => Array.from(new Set(PRODUCTS.map(p=>p.brand).filter(Boolean))), []);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrand, setSelectedBrand]           = useState(null);
  const [selectedPrice, setSelectedPrice]           = useState(null);
  const [selectedRating, setSelectedRating]         = useState(null);
  const [showFilters, setShowFilters]               = useState(false);

  const slugCategory = useMemo(() => {
    if (!slug) return null;
    return categories.find(c => toSlug(c) === slug) || null;
  }, [slug, categories]);

  const filtered = useMemo(() => {
    let list = PRODUCTS || [];
    if (slugCategory) list = list.filter(p => p.category && toSlug(p.category) === toSlug(slugCategory));
    if (selectedCategories.length) list = list.filter(p => selectedCategories.includes(p.category));
    if (selectedBrand) list = list.filter(p => p.brand === selectedBrand);
    if (selectedPrice){
      const {min,max} = selectedPrice;
      list = list.filter(p => {
        const price = Number(p.price)||0;
        return price>=min && price<=max;
      });
    }
    if (selectedRating) list = list.filter(p => (p.rating||0) >= selectedRating);
    return list;
  }, [slugCategory, selectedCategories, selectedBrand, selectedPrice, selectedRating]);

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedBrand(null);
    setSelectedPrice(null);
    setSelectedRating(null);
  };

  return (
    <main className="container">
      {slugCategory ? <h2 style={{margin:"0 0 12px"}}>Categoría: {slugCategory}</h2> : null}

      {/* Barra móvil: acciones */}
      <div className="mobile-only mobile-stickybar">
        <button className="btn btn--ghost" onClick={()=>setShowFilters(true)}>Filtros</button>
        <button className="btn btn--ghost" onClick={clearAll}>Limpiar</button>
      </div>

      {/* Chips resumen de filtros activos */}
      <div className="chips">
        {slugCategory && <span className="chip">{slugCategory}</span>}
        {selectedCategories.map(c => (
          <span key={c} className="chip">{c}
            <button onClick={() => setSelectedCategories(selectedCategories.filter(x=>x!==c))}>×</button>
          </span>
        ))}
        {selectedBrand && (
          <span className="chip">Marca: {selectedBrand}
            <button onClick={()=>setSelectedBrand(null)}>×</button>
          </span>
        )}
        {selectedPrice && (
          <span className="chip">{selectedPrice.label}
            <button onClick={()=>setSelectedPrice(null)}>×</button>
          </span>
        )}
        {selectedRating && (
          <span className="chip">{"★".repeat(selectedRating)}+
            <button onClick={()=>setSelectedRating(null)}>×</button>
          </span>
        )}
      </div>

      <section className="layout-grid">
        {/* Filtros (desktop) */}
        <div className="desktop-only">
          <FilterSidebar
            categories={categories} brands={brands}
            selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories}
            selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand}
            selectedPrice={selectedPrice} setSelectedPrice={setSelectedPrice}
            selectedRating={selectedRating} setSelectedRating={setSelectedRating}
          />
        </div>

        {/* Centro */}
        <div style={{display:"grid", gap:16}}>
          <OfferBanner/>
          <ProductGrid products={filtered} selectedPrice={selectedPrice}/>
        </div>

        {/* Derecha (desktop) */}
        <div className="desktop-only">
          <FeaturedSidebar/>
        </div>
      </section>

      {/* Modal de filtros para móvil */}
      <MobileFilters open={showFilters} onClose={()=>setShowFilters(false)}>
        <FilterSidebar
          categories={categories} brands={brands}
          selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories}
          selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand}
          selectedPrice={selectedPrice} setSelectedPrice={setSelectedPrice}
          selectedRating={selectedRating} setSelectedRating={setSelectedRating}
        />
        <div style={{display:"flex", gap:8, marginTop:12}}>
          <button className="btn btn--ghost" onClick={clearAll} style={{flex:1}}>Limpiar</button>
          <button className="btn btn--primary" onClick={()=>setShowFilters(false)} style={{flex:1}}>Aplicar</button>
        </div>
      </MobileFilters>
    </main>
  );
}
