import { useState } from "react";
import { SectionHeading } from "./ui/SectionHeading.jsx";
import "./DemoLab.css";

const PRODUCTS = [
  { id: "lamp", name: "Lámpara Arco", category: "Escritorio", price: 890, color: "#d9a66c", kind: "lamp", detail: "Luz cálida para tu espacio de trabajo." },
  { id: "book", name: "Libreta Trazo", category: "Papelería", price: 180, color: "#8ca9cd", kind: "book", detail: "Ideas, bocetos y planes por escribir." },
  { id: "cup", name: "Taza Bruma", category: "Accesorios", price: 240, color: "#c1b5d7", kind: "cup", detail: "Una pausa entre grandes ideas." },
  { id: "plant", name: "Maceta Nido", category: "Escritorio", price: 320, color: "#8faf93", kind: "plant", detail: "Un toque verde en tu escritorio." },
  { id: "notes", name: "Agenda Horizonte", category: "Papelería", price: 290, color: "#d69c8f", kind: "book", detail: "Organiza tu próxima semana." },
  { id: "mug", name: "Taza Arena", category: "Accesorios", price: 260, color: "#c7b598", kind: "cup", detail: "Diseño simple para todos los días." },
];
const money = (value) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(value);
const normalize = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function ProductArt({ product }) {
  return <svg viewBox="0 0 240 160" aria-hidden="true" className="demo-product-art">
    <ellipse cx="120" cy="140" rx="61" ry="8" fill="#18263a" opacity=".1" />
    <g fill={product.color} stroke="#26364b" strokeWidth="2" strokeLinejoin="round">
      {product.kind === "cup" && <><path d="M153 66h13c33 0 33 45 0 45h-13v-12h12c16 0 16-21 0-21h-12z" /><path d="M70 54h86v57q0 27-43 27t-43-27z" /><ellipse cx="113" cy="54" rx="43" ry="10" fill="#eee8df" /><ellipse cx="113" cy="55" rx="33" ry="5" fill="#79523f" stroke="none" /></>}
      {product.kind === "book" && <><path d="M75 30l93 12v94l-93-12z" /><path d="M75 124l93 12v7l-93-12z" fill="#faf6ed" /><path d="M84 31v94M98 62l47 6M98 76l35 5" fill="none" /><path d="M148 40v54l-8-8-7 6V38" fill="#faf6ed" stroke="none" /></>}
      {product.kind === "lamp" && <><path d="M120 132V65q0-29 28-29" fill="none" strokeWidth="7" /><path d="M104 62l44-35 38 35z" /><path d="M90 133q30-16 60 0v6H90z" /><path d="M141 65h13" stroke="#f7dea0" strokeWidth="6" /></>}
      {product.kind === "plant" && <><path d="M118 91V44" fill="none" stroke="#527963" strokeWidth="4" /><path d="M118 70Q76 65 83 34q36 0 35 36M119 55q38 1 37-33-37 0-37 33" fill="#527963" stroke="none" /><path d="M81 87h78l-11 50H92z" /><path d="M78 85h84v12H78z" /></>}
    </g>
  </svg>;
}

export function DemoLab({ onQuote }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [sort, setSort] = useState("featured");
  const [cart, setCart] = useState({});
  const [notice, setNotice] = useState("");
  const visible = PRODUCTS.filter((p) => (category === "Todos" || p.category === category) && normalize(`${p.name} ${p.category}`).includes(normalize(query))).sort((a, b) => sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : 0);
  const selected = PRODUCTS.filter((p) => cart[p.id]);
  const count = selected.reduce((sum, p) => sum + cart[p.id], 0);
  const total = selected.reduce((sum, p) => sum + cart[p.id] * p.price, 0);
  function change(product, delta) {
    setCart((previous) => ({ ...previous, [product.id]: Math.max(0, Math.min(20, (previous[product.id] || 0) + delta)) }));
    setNotice(delta > 0 ? `${product.name} añadido a tu lista de ejemplo.` : `Cantidad de ${product.name} actualizada.`);
  }
  return <section id="demos" aria-labelledby="demos-title" className="demo-lab scroll-mt-24 py-16 sm:py-20">
    <div className="container-page">
      <SectionHeading id="demos-title" eyebrow="Laboratorio de demos" title="No solo lo veas. Pruébalo." description="Explora una solución que podríamos adaptar a tu negocio. Busca productos, arma una lista y descubre cómo sería la experiencia de tus clientes." />
      <div className="demo-window">
        <header className="demo-window-bar"><span><i /><i /><i /></span><span>ESTUDIO / CATÁLOGO</span><span className="demo-badge">DEMO INTERACTIVA</span></header>
        <div className="demo-shop-intro"><div><p className="demo-eyebrow">OBJETOS PARA CREAR</p><h3>Pequeños detalles.<br />Grandes ideas.</h3><p>Una tienda de escritorio imaginaria, una experiencia que puedes probar.</p></div><div className="demo-intro-note"><strong>01 / Catálogo digital</strong><span>Útil para tiendas, distribuidores y negocios que cotizan por WhatsApp.</span></div></div>
        <p className="demo-warning">Productos y precios ficticios en MXN. Esta demo no realiza compras, pagos ni pedidos.</p>
        <div className="demo-toolbar"><label>Buscar productos<input type="search" placeholder="Prueba «taza» o «lámpara»" value={query} onChange={(e) => setQuery(e.target.value)} /></label><label>Ordenar<select value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">Selección del estudio</option><option value="low">Precio: menor a mayor</option><option value="high">Precio: mayor a menor</option></select></label></div>
        <div className="demo-filters" role="group" aria-label="Categorías del catálogo">{["Todos", "Escritorio", "Papelería", "Accesorios"].map((c) => <button type="button" key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>)}</div>
        <div className="demo-layout"><div><p className="demo-results" aria-live="polite">{visible.length} productos de ejemplo</p><div className="demo-grid">{visible.map((p) => <article key={p.id} className="demo-card"><div className="demo-art-wrap"><ProductArt product={p} /><span>{p.category}</span></div><div className="demo-card-body"><h4>{p.name}</h4><p>{p.detail}</p><div><strong>{money(p.price)}</strong><button type="button" aria-label={`Añadir ${p.name}`} onClick={() => change(p, 1)} disabled={cart[p.id] >= 20}>Añadir +</button></div></div></article>)}</div>{!visible.length && <div className="demo-empty"><strong>No encontramos productos.</strong><p>Prueba otra búsqueda o categoría.</p><button type="button" onClick={() => { setQuery(""); setCategory("Todos"); }}>Limpiar filtros</button></div>}</div>
          <aside className="demo-list" aria-label="Lista de cotización de ejemplo"><div className="demo-list-title"><h4>Tu lista de ejemplo</h4><span>{count}</span></div><p>Así podría cotizar un visitante de tu negocio.</p>{!selected.length ? <div className="demo-empty">Añade un producto para comenzar.<small>No necesitas registrarte.</small></div> : <><ul>{selected.map((p) => <li key={p.id}><div><strong>{p.name}</strong><span>{money(p.price * cart[p.id])}</span></div><div className="demo-quantity"><button type="button" aria-label={`Reducir ${p.name}`} onClick={() => change(p, -1)}>−</button><span aria-label={`Cantidad de ${p.name}`}>{cart[p.id]}</span><button type="button" aria-label={`Aumentar ${p.name}`} disabled={cart[p.id] >= 20} onClick={() => change(p, 1)}>+</button><button type="button" className="demo-remove" onClick={() => { setCart((prev) => ({ ...prev, [p.id]: 0 })); setNotice(`${p.name} eliminado.`); }}>Quitar <span className="sr-only">{p.name}</span></button></div></li>)}</ul><div className="demo-total"><span>Total de ejemplo</span><strong>{money(total)} MXN</strong></div><details className="demo-preview"><summary>Ver solicitud de ejemplo</summary><p>{`Hola, me interesan estos productos:\n${selected.map((p) => `• ${p.name} × ${cart[p.id]}`).join("\n")}\nTotal de ejemplo: ${money(total)} MXN\n\nSimulación: este mensaje no se envía.`}</p></details><button type="button" onClick={() => { setCart({}); setNotice("Lista vaciada."); }}>Vaciar lista</button></>}
            <div className="demo-convert"><h4>¿Un catálogo para tu negocio?</h4><p>Lo adaptamos a tu marca, productos y forma de cotizar.</p><button type="button" onClick={onQuote}>Quiero un catálogo así ↗</button><small>Solicita el desarrollo del catálogo, no los productos de esta demo.</small></div>
          </aside></div>
        <p className="sr-only" role="status">{notice}</p>
        <footer className="demo-foot"><span>BUSCAR · FILTRAR · SELECCIONAR · COTIZAR</span><span>Tu marca, tu catálogo, tus clientes.</span></footer>
      </div>
    </div>
  </section>;
}
