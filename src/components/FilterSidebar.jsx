export default function FilterSidebar({
  categories, brands,
  selectedCategories, setSelectedCategories,
  selectedBrand, setSelectedBrand,
  selectedPrice, setSelectedPrice,
  selectedRating, setSelectedRating,
}) {
  const PRICES = [
    {key:"-5000",  label:"Hasta $5.000",       min:0,     max:5000},
    {key:"5-15",   label:"$5.000 – $15.000",   min:5000,  max:15000},
    {key:"15-50",  label:"$15.000 – $50.000",  min:15000, max:50000},
    {key:"50+",    label:"Más de $50.000",     min:50000, max:Infinity},
  ];

  const toggleCategory = (cat) => {
    const set = new Set(selectedCategories);
    set.has(cat) ? set.delete(cat) : set.add(cat);
    setSelectedCategories(Array.from(set));
  };

  const Section = ({title, children}) => (
    <section style={{
      background:"#fff", borderRadius:12, padding:12,
      boxShadow:"0 6px 20px rgba(0,0,0,.06)", display:"grid", gap:8
    }}>
      <strong>{title}</strong>
      {children}
    </section>
  );

  return (
    <div style={{display:"grid", gap:12}}>
      <Section title="Categorías">
        <div style={{display:"grid", gap:6}}>
          {categories.map(c => (
            <label key={c} style={{display:"flex", gap:8, alignItems:"center"}}>
              <input type="checkbox" checked={selectedCategories.includes(c)} onChange={()=>toggleCategory(c)}/>
              <span>{c}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section title="Precio">
        <div style={{display:"grid", gap:6}}>
          {PRICES.map(p => (
            <label key={p.key} style={{display:"flex", gap:8, alignItems:"center"}}>
              <input type="radio" name="price" checked={selectedPrice?.key === p.key} onChange={()=>setSelectedPrice(p)}/>
              <span>{p.label}</span>
            </label>
          ))}
          <button className="btn btn--ghost" onClick={()=>setSelectedPrice(null)}>Limpiar precio</button>
        </div>
      </Section>

      <Section title="Marcas">
        <div style={{display:"grid", gap:6}}>
          {brands.map(b => (
            <label key={b} style={{display:"flex", gap:8, alignItems:"center"}}>
              <input type="radio" name="brand" checked={selectedBrand === b} onChange={()=>setSelectedBrand(b)}/>
              <span>{b}</span>
            </label>
          ))}
          <button className="btn btn--ghost" onClick={()=>setSelectedBrand(null)}>Todas</button>
        </div>
      </Section>

      <Section title="Calificación">
        <div style={{display:"grid", gap:6}}>
          {[5,4,3].map(r => (
            <label key={r} style={{display:"flex", gap:8, alignItems:"center"}}>
              <input type="radio" name="rating" checked={selectedRating === r} onChange={()=>setSelectedRating(r)}/>
              <span>{"★".repeat(r)} y más</span>
            </label>
          ))}
          <button className="btn btn--ghost" onClick={()=>setSelectedRating(null)}>Cualquiera</button>
        </div>
      </Section>
    </div>
  );
}
