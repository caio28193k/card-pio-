import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, Flame, Menu, Search, Utensils, X } from "lucide-react";

type Product = {
  id: string; name: string; category: string; description: string;
  price: number; photo: "1" | "2"; position: "tl" | "tr" | "bl" | "br"; badge?: string;
};

const products: Product[] = [
  { id: "classic", name: "Brasa Clássico", category: "Burgers", description: "Blend 160g, cheddar, alface, tomate e molho da casa no brioche.", price: 3290, photo: "1", position: "tl", badge: "Mais pedido" },
  { id: "double", name: "Double Smash", category: "Burgers", description: "Dois smash burgers, cheddar duplo, cebola grelhada e molho especial.", price: 3690, photo: "1", position: "tr" },
  { id: "bacon", name: "Bacon da Brasa", category: "Burgers", description: "Blend 160g, bacon crocante, cheddar e maionese defumada.", price: 3590, photo: "2", position: "tr", badge: "Favorito" },
  { id: "chicken", name: "Chicken da Casa", category: "Burgers", description: "Frango grelhado, alface, tomate e molho de ervas no brioche.", price: 2990, photo: "2", position: "tl" },
  { id: "combo", name: "Combo Brasa 47", category: "Combos", description: "Brasa Clássico + fritas individuais + refrigerante gelado.", price: 4690, photo: "1", position: "bl", badge: "Melhor escolha" },
  { id: "fries", name: "Fritas da Casa", category: "Acompanhamentos", description: "Fritas crocantes com tempero da casa e molho cremoso.", price: 1890, photo: "1", position: "br" },
  { id: "onion", name: "Onion Rings", category: "Acompanhamentos", description: "Anéis de cebola empanados, crocantes e acompanhados de molho.", price: 1990, photo: "2", position: "bl" },
  { id: "lemonade", name: "Limonada da Casa", category: "Bebidas", description: "Limonada gelada com limão e hortelã. Copo de 400 ml.", price: 1290, photo: "2", position: "br" },
];
const categories = ["Todos", "Burgers", "Combos", "Acompanhamentos", "Bebidas"];
const format = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const money = (cents: number) => format.format(cents / 100);
const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function ProductPhoto({ product, className = "" }: { product: Product; className?: string }) {
  return <img className={`burger-product-photo photo-${product.photo} pos-${product.position} ${className}`} src={`/brasa-${product.photo}-${product.position}.webp`} alt={`Foto ilustrativa de ${product.name}`} width={512} height={512} loading="lazy" decoding="async" />;
}

export function BurgerDemo() {
  const [category, setCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const visible = useMemo(() => products.filter((product) => (category === "Todos" || category === product.category) && normalize(`${product.name} ${product.description} ${product.category}`).includes(normalize(query.trim()))), [category, query]);

  useEffect(() => {
    if (!selected || !dialog.current) return;
    dialog.current.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [selected]);
  function closeDetails() { dialog.current?.close(); setSelected(null); }

  return <div className="burger-demo" id="inicio">
    <link rel="preload" as="image" href="/brasa-hero.webp" />
    <div className="burger-demo-strip"><span className="burger-demo-dot" /> Cardápio de demonstração <span className="burger-demo-detail">· Marca, fotos e preços ilustrativos</span></div>
    <header className="burger-header"><div className="burger-container burger-header-inner">
      <a href="#inicio" className="burger-logo" aria-label="Brasa 47, voltar ao início"><span className="burger-logo-icon"><Flame size={19} strokeWidth={2.5} /></span><span>BRASA <b>47</b></span></a>
      <nav className={`burger-nav ${mobileMenuOpen ? "is-open" : ""}`} aria-label="Navegação principal">
        <a href="#cardapio" onClick={() => setMobileMenuOpen(false)}>Cardápio</a>
        <a href="#mais-pedidos" onClick={() => setMobileMenuOpen(false)}>Combo da casa</a>
        <a href="#sobre" onClick={() => setMobileMenuOpen(false)}>Nossa essência</a>
      </nav>
      <div className="burger-header-actions"><a className="burger-cart-top" href="#cardapio"><Utensils size={17} /><span>Ver cardápio</span></a><button type="button" className="burger-mobile-toggle" onClick={() => setMobileMenuOpen((open) => !open)} aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={mobileMenuOpen}>{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button></div>
    </div></header>
    <main>
      <section className="burger-hero" aria-labelledby="burger-hero-title"><div className="burger-hero-image" role="img" aria-label="Hambúrguer artesanal com cheddar e cebola caramelizada" /><div className="burger-hero-shade" /><div className="burger-container burger-hero-content"><span className="burger-kicker"><Flame size={15} /> HAMBURGUERIA ARTESANAL</span><h1 id="burger-hero-title">A FOME PEDE <em>BRASA.</em></h1><p>Pão macio, carne suculenta e cheddar derretendo. Seu próximo burger favorito está aqui.</p><div className="burger-hero-actions"><a className="burger-btn burger-btn-gold" href="#cardapio">EXPLORAR CARDÁPIO <ArrowRight size={18} /></a><a className="burger-hero-secondary" href="#mais-pedidos">Conhecer o combo da casa <ArrowRight size={16} /></a></div><div className="burger-hero-proof"><span><Flame size={16} /> Burgers artesanais</span><span><Check size={16} /> Ingredientes à vista</span><span><Utensils size={16} /> Sabor em cada detalhe</span></div></div><div className="burger-hero-caption"><span>O CLÁSSICO NUNCA FALHA.</span><strong>Feito para a sua fome.</strong></div></section>
      <section className="burger-container burger-menu-section" id="cardapio" aria-labelledby="burger-menu-title"><div className="burger-section-heading"><div><span className="burger-eyebrow">BATEU A FOME?</span><h2 id="burger-menu-title">ESCOLHA SEU <em>FAVORITO.</em></h2><p>Do primeiro burger à última batata. Conheça os sabores da casa.</p></div><div className="burger-mini-note"><Utensils size={17} /> Tem uma boa escolha para cada vontade</div></div>
        <div className="burger-discovery"><label className="burger-search"><Search size={19} aria-hidden="true" /><span className="sr-only">Buscar no cardápio</span><input value={query} onChange={(event) => { setQuery(event.target.value); if (event.target.value) setCategory("Todos"); }} placeholder="Buscar burger, fritas, bebida..." />{query && <button type="button" onClick={() => setQuery("")} aria-label="Limpar busca"><X size={18} /></button>}</label><span className="burger-results" aria-live="polite">{visible.length} {visible.length === 1 ? "opção" : "opções"}</span></div>
        <div className="burger-categories" role="group" aria-label="Filtrar por categoria">{categories.map((name) => <button type="button" key={name} aria-pressed={category === name} className={category === name ? "selected" : ""} onClick={() => { setCategory(name); setQuery(""); }}>{name}</button>)}</div>
        {visible.length === 0 ? <div className="burger-empty"><Search size={28} /><h3>Nada encontrado</h3><p>Tente outra busca ou veja todas as opções.</p><button type="button" onClick={() => { setCategory("Todos"); setQuery(""); }}>Ver tudo</button></div> : <div className="burger-products">{visible.map((product) => <article className="burger-product" key={product.id}><ProductPhoto product={product} /><div className="burger-product-content"><div className="burger-product-top">{product.badge && <span className="burger-product-badge">{product.badge}</span>}<span className="burger-product-category">{product.category}</span></div><h3>{product.name}</h3><p>{product.description}</p><div className="burger-product-bottom"><strong>{money(product.price)}</strong><button type="button" onClick={() => setSelected(product)} aria-label={`Ver detalhes de ${product.name}`}><span>VER DETALHES</span><ArrowRight size={17} /></button></div></div></article>)}</div>}
      </section>
      <section className="burger-combo-section" id="mais-pedidos" aria-labelledby="burger-best-title"><div className="burger-container burger-combo-panel"><div className="burger-combo-visual"><ProductPhoto product={products[4]} /><span className="burger-combo-stamp">BURGER<br /><b>+ FRITAS</b><br />+ REFRI</span></div><div className="burger-combo-copy"><span className="burger-eyebrow">A COMBINAÇÃO COMPLETA</span><h2 id="burger-best-title">FOME GRANDE?<br /><em>VAI DE COMBO.</em></h2><p>O Brasa Clássico encontra as fritas crocantes e o refri gelado. Tudo junto para resolver sua fome.</p><div className="burger-combo-price"><span>Combo Brasa 47<strong>{money(products[4].price)}</strong></span><button type="button" className="burger-btn burger-btn-gold" onClick={() => setSelected(products[4])}>CONHECER O COMBO <ArrowRight size={18} /></button></div><small>Imagem e preço ilustrativos para demonstração.</small></div></div></section>
      <section className="burger-container burger-how" id="sobre" aria-labelledby="burger-how-title"><div><span className="burger-eyebrow">A ESSÊNCIA DA BRASA</span><h2 id="burger-how-title">SIMPLES NO JEITO.<br /><em>MARCANTE NO SABOR.</em></h2><p>Uma combinação de texturas e sabores que começa no pão e termina na vontade de repetir.</p></div><div className="burger-steps"><div><span>01</span><h3>O burger</h3><p>Carne, queijo e molho em uma combinação que faz sentido a cada mordida.</p></div><div><span>02</span><h3>Os acompanhamentos</h3><p>Fritas e onion rings para dividir — ou guardar só para você.</p></div><div><span>03</span><h3>O toque final</h3><p>Uma bebida gelada para completar a experiência.</p></div></div></section>
    </main>
    <footer className="burger-footer"><div className="burger-container burger-footer-inner"><div><a href="#inicio" className="burger-logo"><span className="burger-logo-icon"><Flame size={19} /></span><span>BRASA <b>47</b></span></a><p>O sabor começa na escolha.</p></div><div><strong>EXPLORE</strong><a href="#cardapio">Cardápio</a><a href="#mais-pedidos">Combo da casa</a><a href="#sobre">Nossa essência</a></div><div className="burger-footer-disclaimer"><strong>SOBRE ESTA DEMONSTRAÇÃO</strong><p>Marca, fotos, preços e produtos ilustrativos. Este site apresenta um exemplo de cardápio digital para restaurantes.</p></div></div><div className="burger-container burger-footer-base">© {new Date().getFullYear()} Brasa 47 · Cardápio de demonstração</div></footer>
    <dialog className="burger-detail-dialog" ref={dialog} onClose={() => setSelected(null)} onClick={(event) => { if (event.target === event.currentTarget) closeDetails(); }} aria-label={selected?.name || "Detalhes do produto"}>
      {selected && <div className="burger-detail-inner"><button type="button" className="burger-detail-close" onClick={closeDetails} aria-label="Fechar detalhes"><X size={22} /></button><ProductPhoto product={selected} /><div className="burger-detail-copy"><span className="burger-eyebrow">{selected.category}</span><h2>{selected.name}</h2><p>{selected.description}</p><strong>{money(selected.price)}</strong><small>Foto e preço ilustrativos.</small><button type="button" onClick={closeDetails}>Voltar ao cardápio <ArrowRight size={17} /></button></div></div>}
    </dialog>
  </div>;
}
