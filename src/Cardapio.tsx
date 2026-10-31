import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Bike, Clock, CreditCard, Flame, MapPin, MessageCircle, Pizza, Plus, Search, ShoppingBag, Utensils, X } from "lucide-react";
import { buildOrderMessage, emptyCustomer, money, resolveLine, useStored, type CartLine, type Customer, type ResolvedLine } from "./cart";
import { CartSheet } from "./CartSheet";
import { hoursLines, isOpenAt, todayLabel } from "./hours";
import { ItemSheet } from "./ItemSheet";
import { Price } from "./Price";
import type { Product, Restaurant } from "./types";

const ALL = "Todos";
const normalize = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const slugify = (text: string) => normalize(text).replace(/[^a-z0-9]+/g, "-");

function InstagramIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" /></svg>;
}

function LogoIcon({ icon }: { icon: Restaurant["logo"]["icon"] }) {
  const Icon = icon === "pizza" ? Pizza : icon === "utensils" ? Utensils : Flame;
  return <span className="cdp-logo-icon"><Icon size={18} strokeWidth={2.5} /></span>;
}

function Logo({ restaurant }: { restaurant: Restaurant }) {
  const { text, highlight, icon } = restaurant.logo;
  return <a href="#topo" className="cdp-logo" aria-label={`${restaurant.name}, voltar ao início`}>
    <LogoIcon icon={icon} /><span>{text}{highlight && <> <b>{highlight}</b></>}</span>
  </a>;
}

/** Mostra o texto do WhatsApp com *negrito*. */
function WhatsappText({ text }: { text: string }) {
  return <>{text.split("\n").map((line, i) => <p key={i}>{line.split(/\*(.+?)\*/g).map((part, j) => (j % 2 ? <strong key={j}>{part}</strong> : part))}{!line && " "}</p>)}</>;
}

function setMeta(name: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) { tag = document.createElement("meta"); tag.name = name; document.head.appendChild(tag); }
  tag.content = content;
}

export function Cardapio({ restaurant: r }: { restaurant: Restaurant }) {
  const [category, setCategory] = useState(ALL);
  const [query, setQuery] = useState("");
  const [now, setNow] = useState(() => new Date());
  const [detail, setDetail] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [cart, setCart] = useStored<CartLine[]>(`cdp-carrinho:${r.slug}`, []);
  const [customer, setCustomer] = useStored<Customer>(`cdp-cliente:${r.slug}`, emptyCustomer);

  const ordering = r.ordering;
  const items = useMemo(() => (ordering ? cart.map((line) => resolveLine(r, line)).filter((item): item is ResolvedLine => item !== null) : []), [r, ordering, cart]);
  const count = items.reduce((sum, item) => sum + item.line.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const modalOpen = Boolean(detail || cartOpen || preview);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    document.title = `${r.name} · Cardápio${r.demo ? " de demonstração" : ""}`;
    setMeta("description", r.description ?? `Cardápio ${r.name}: ${r.tagline}`);
    setMeta("theme-color", "#000000");
  }, [r]);

  useEffect(() => {
    if (!modalOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (preview) setPreview(null); else if (cartOpen) setCartOpen(false); else setDetail(null);
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", onKey); };
  }, [modalOpen, preview, cartOpen]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const search = normalize(query.trim());
  const groups = useMemo(() => r.categories
    .filter((c) => category === ALL || c.name === category)
    .map((c) => ({
      category: c,
      items: r.products.filter((p) => p.category === c.name && (!search || normalize(`${p.name} ${p.description ?? ""} ${p.category}`).includes(search))),
    }))
    .filter((group) => group.items.length > 0), [r, category, search]);

  const open = r.hours?.length ? isOpenAt(r.hours, now) : undefined;
  const whatsappHref = r.whatsapp ? `https://wa.me/${r.whatsapp}?text=${encodeURIComponent(r.whatsappMessage ?? "Olá! Vi o cardápio e quero fazer um pedido.")}` : undefined;
  const mapsHref = r.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.name} ${r.address}`)}` : undefined;
  const style = { "--accent": r.theme.accent, "--accent-ink": r.theme.accentInk } as CSSProperties;
  const photos = r.layout === "fotos";

  const pickCategory = (name: string) => {
    setCategory(name);
    setQuery("");
    document.getElementById("cardapio")?.scrollIntoView({ block: "start" });
  };

  const addLine = (line: CartLine) => {
    if (sent) setSent(false);
    setCart((current) => [...current, line]);
    setDetail(null);
    setToast("Adicionado ao pedido");
  };

  const setQty = (key: string, qty: number) =>
    setCart((current) => (qty <= 0 ? current.filter((l) => l.key !== key) : current.map((l) => (l.key === key ? { ...l, qty: Math.min(30, qty) } : l))));

  const sendOrder = () => {
    if (!ordering) return;
    const message = buildOrderMessage(r, items, customer, ordering.deliveryFee);
    setSent(true);
    if (r.whatsapp) window.location.href = `https://wa.me/${r.whatsapp}?text=${encodeURIComponent(message)}`;
    else { setCartOpen(false); setPreview(message); }
  };

  const resetOrder = () => { setCart([]); setSent(false); setCartOpen(false); setPreview(null); };

  const addButton = (p: Product) => ordering && <button type="button" className="cdp-add" onClick={(event) => { event.stopPropagation(); setDetail(p); }} aria-label={`Adicionar ${p.name}`}><Plus size={16} /> Adicionar</button>;

  const hasBottomButton = Boolean(whatsappHref || (ordering && (count > 0 || r.demo)));

  return <div className={`cdp ${hasBottomButton ? "has-bottom-button" : ""}`} style={style}>
    {r.demo && <div className="cdp-strip"><span className="cdp-dot" /> Cardápio de demonstração <span className="cdp-strip-detail">· marca, fotos e preços ilustrativos</span></div>}

    <header className="cdp-header"><div className="cdp-container cdp-header-inner">
      <Logo restaurant={r} />
      {open !== undefined && <a href="#info" className={`cdp-status ${open ? "is-open" : ""}`}><span className="cdp-status-dot" />{open ? "Aberto agora" : "Fechado agora"}</a>}
    </div></header>

    <section className={`cdp-hero ${r.heroImage ? "has-image" : ""}`} id="topo" aria-labelledby="cdp-title">
      {r.heroImage && <img className="cdp-hero-img" src={r.heroImage} alt="" fetchPriority="high" decoding="async" />}
      <div className="cdp-hero-shade" />
      <div className="cdp-container cdp-hero-content">
        {r.kicker && <span className="cdp-kicker">{r.kicker}</span>}
        <h1 id="cdp-title">{r.name}</h1>
        <p>{r.tagline}</p>
        <ul className="cdp-hero-info">
          {r.hours?.length ? <li><Clock size={15} /> {todayLabel(r.hours, now)}</li> : null}
          {r.address && <li><MapPin size={15} /> {r.address}</li>}
          {ordering && <li><Bike size={15} /> Entrega {money(ordering.deliveryFee)}</li>}
        </ul>
      </div>
    </section>

    <main className="cdp-container cdp-menu" id="cardapio" aria-label="Cardápio">
      <label className="cdp-search">
        <Search size={19} aria-hidden="true" />
        <span className="sr-only">Buscar no cardápio</span>
        <input value={query} onChange={(event) => { setQuery(event.target.value); if (event.target.value) setCategory(ALL); }} placeholder="Buscar no cardápio..." />
        {query && <button type="button" onClick={() => setQuery("")} aria-label="Limpar busca"><X size={18} /></button>}
      </label>

      <div className="cdp-categories" role="group" aria-label="Filtrar por categoria">
        {[ALL, ...r.categories.map((c) => c.name)].map((name) => <button type="button" key={name} aria-pressed={category === name} className={category === name ? "selected" : ""} onClick={() => pickCategory(name)}>{name}</button>)}
      </div>

      {groups.length === 0
        ? <div className="cdp-empty"><Search size={26} /><h3>Nada encontrado</h3><p>Tente outra palavra ou veja o cardápio completo.</p><button type="button" onClick={() => pickCategory(ALL)}>Ver tudo</button></div>
        : groups.map(({ category: c, items: products }) => <section className="cdp-group" key={c.name} aria-labelledby={`cat-${slugify(c.name)}`}>
          <div className="cdp-group-head">
            <h2 id={`cat-${slugify(c.name)}`}>{c.name}</h2>
            {c.note && <p>{c.note}</p>}
          </div>
          {photos
            ? <div className="cdp-cards">
              {products.map((p) => <article className="cdp-card-item" key={p.id} onClick={() => setDetail(p)}>
                {p.photo && <button type="button" className="cdp-card-media" onClick={(event) => { event.stopPropagation(); setDetail(p); }} aria-label={`Ver ${p.name}`}>
                  <img src={p.photo} alt="" width={512} height={512} loading="lazy" decoding="async" />
                  {p.badge && <span className="cdp-badge">{p.badge}</span>}
                </button>}
                <div className="cdp-card-body">
                  {!p.photo && p.badge && <span className="cdp-badge">{p.badge}</span>}
                  <h3>{p.name}</h3>
                  {p.description && <p>{p.description}</p>}
                  <div className="cdp-card-foot"><Price price={p.price} />{addButton(p)}</div>
                </div>
              </article>)}
            </div>
            : <div className="cdp-items">
              {products.map((p) => <article className="cdp-item" key={p.id} onClick={() => setDetail(p)}>
                <div className="cdp-item-text">
                  {p.badge && <span className="cdp-badge">{p.badge}</span>}
                  <h3>{p.name}</h3>
                  {p.description && <p>{p.description}</p>}
                  <Price price={p.price} />
                  {addButton(p)}
                </div>
                {p.photo && <button type="button" className="cdp-item-photo" onClick={(event) => { event.stopPropagation(); setDetail(p); }} aria-label={`Ver ${p.name}`}>
                  <img src={p.photo} alt="" width={512} height={512} loading="lazy" decoding="async" />
                </button>}
              </article>)}
            </div>}
        </section>)}
    </main>

    <section className="cdp-container cdp-info" id="info" aria-labelledby="cdp-info-title">
      <h2 id="cdp-info-title">Informações</h2>
      <div className="cdp-info-grid">
        {r.hours?.length ? <div className="cdp-card"><h3><Clock size={17} /> Horário</h3>{hoursLines(r.hours).map((line) => <p key={line}>{line}</p>)}</div> : null}
        {r.address && <div className="cdp-card"><h3><MapPin size={17} /> Endereço</h3><p>{r.address}</p>{!r.demo && <a href={mapsHref} target="_blank" rel="noreferrer">Ver no mapa</a>}</div>}
        {(r.delivery || ordering) && <div className="cdp-card"><h3><Bike size={17} /> Entrega</h3>{ordering && <p>Taxa de entrega: {money(ordering.deliveryFee)}{ordering.pickup ? " · Retirada grátis" : ""}</p>}{r.delivery && <p>{r.delivery}</p>}</div>}
        {r.payments?.length ? <div className="cdp-card"><h3><CreditCard size={17} /> Pagamento</h3><ul className="cdp-chips">{r.payments.map((p) => <li key={p}>{p}</li>)}</ul></div> : null}
        {r.instagram && <div className="cdp-card"><h3><InstagramIcon size={17} /> Instagram</h3>{r.demo ? <p>@{r.instagram}</p> : <a href={`https://instagram.com/${r.instagram}`} target="_blank" rel="noreferrer">@{r.instagram}</a>}</div>}
      </div>
    </section>

    <footer className="cdp-footer"><div className="cdp-container">
      <Logo restaurant={r} />
      <p>© {now.getFullYear()} {r.name}{r.demo && " · Marca, fotos, preços e endereço ilustrativos. Exemplo de cardápio digital para restaurantes."}</p>
    </div></footer>

    {ordering && count > 0
      ? <button type="button" className="cdp-wa cdp-cartbar" onClick={() => setCartOpen(true)}>
        <span className="cdp-cartbar-count"><ShoppingBag size={18} /> {count}</span>
        <span>Ver pedido</span>
        <strong>{money(subtotal)}</strong>
      </button>
      : whatsappHref
        ? <a className="cdp-wa" href={whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={20} /> {ordering ? "Falar no WhatsApp" : "Pedir no WhatsApp"}</a>
        : r.demo && ordering && <button type="button" className="cdp-wa" onClick={() => setToast("Adicione itens para montar o pedido. No cardápio de verdade, este botão abre o WhatsApp do restaurante.")}><MessageCircle size={20} /> Falar no WhatsApp</button>}

    {toast && <div className="cdp-toast" role="status">{toast}</div>}

    {detail && <ItemSheet key={detail.id} restaurant={r} product={detail} onClose={() => setDetail(null)} onAdd={ordering ? addLine : undefined} />}

    {cartOpen && ordering && <CartSheet restaurant={r} items={items} open={open} customer={customer} setCustomer={setCustomer} setQty={setQty} onClose={() => setCartOpen(false)} onSend={sendOrder} sent={sent} onReset={resetOrder} />}

    {preview && <div className="cdp-modal" role="dialog" aria-modal="true" aria-labelledby="cdp-preview-title" onClick={() => setPreview(null)}>
      <div className="cdp-sheet" onClick={(event) => event.stopPropagation()}>
        <div className="cdp-sheet-top"><span className="cdp-grip" aria-hidden="true" /><button type="button" className="cdp-sheet-close" onClick={() => setPreview(null)} aria-label="Fechar"><X size={22} /></button></div>
        <div className="cdp-sheet-body"><div className="cdp-sheet-pad">
          <h2 id="cdp-preview-title">Assim o pedido chega no WhatsApp</h2>
          <p className="cdp-muted">Na demonstração, mostramos a mensagem aqui. No cardápio de verdade, o WhatsApp do restaurante abre com este texto pronto para enviar.</p>
          <div className="cdp-bubble"><WhatsappText text={preview} /></div>
        </div></div>
        <div className="cdp-sheet-foot"><button type="button" className="cdp-primary is-wide" onClick={resetOrder}>Começar um novo pedido</button></div>
      </div>
    </div>}
  </div>;
}
