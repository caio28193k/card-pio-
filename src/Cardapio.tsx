import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Bike, Clock, CreditCard, Flame, MapPin, MessageCircle, Pizza, Search, Utensils, X } from "lucide-react";
import { hoursLines, isOpenAt, todayLabel } from "./hours";
import type { Product, Restaurant } from "./types";

const ALL = "Todos";
const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const money = (cents: number) => currency.format(cents / 100);
const normalize = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

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

function Price({ price }: { price: Product["price"] }) {
  if (typeof price === "number") return <strong className="cdp-price">{money(price)}</strong>;
  return <ul className="cdp-sizes">{price.map((size) => <li key={size.label}><span>{size.label}</span><strong>{money(size.price)}</strong></li>)}</ul>;
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
  const [zoom, setZoom] = useState<Product | null>(null);
  const [toast, setToast] = useState(false);

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
    if (!zoom) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setZoom(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(false), 3500);
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

  const pickCategory = (name: string) => {
    setCategory(name);
    setQuery("");
    document.getElementById("cardapio")?.scrollIntoView({ block: "start" });
  };

  return <div className="cdp" style={style}>
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
        : groups.map(({ category: c, items }) => <section className="cdp-group" key={c.name} aria-labelledby={`cat-${normalize(c.name).replace(/[^a-z0-9]+/g, "-")}`}>
          <div className="cdp-group-head">
            <h2 id={`cat-${normalize(c.name).replace(/[^a-z0-9]+/g, "-")}`}>{c.name}</h2>
            {c.note && <p>{c.note}</p>}
          </div>
          <div className="cdp-items">
            {items.map((p) => <article className="cdp-item" key={p.id}>
              <div className="cdp-item-text">
                {p.badge && <span className="cdp-badge">{p.badge}</span>}
                <h3>{p.name}</h3>
                {p.description && <p>{p.description}</p>}
                <Price price={p.price} />
              </div>
              {p.photo && <button type="button" className="cdp-item-photo" onClick={() => setZoom(p)} aria-label={`Ampliar foto de ${p.name}`}>
                <img src={p.photo} alt="" width={512} height={512} loading="lazy" decoding="async" />
              </button>}
            </article>)}
          </div>
        </section>)}
    </main>

    <section className="cdp-container cdp-info" id="info" aria-labelledby="cdp-info-title">
      <h2 id="cdp-info-title">Informações</h2>
      <div className="cdp-info-grid">
        {r.hours?.length ? <div className="cdp-card"><h3><Clock size={17} /> Horário</h3>{hoursLines(r.hours).map((line) => <p key={line}>{line}</p>)}</div> : null}
        {r.address && <div className="cdp-card"><h3><MapPin size={17} /> Endereço</h3><p>{r.address}</p>{!r.demo && <a href={mapsHref} target="_blank" rel="noreferrer">Ver no mapa</a>}</div>}
        {r.delivery && <div className="cdp-card"><h3><Bike size={17} /> Entrega</h3><p>{r.delivery}</p></div>}
        {r.payments?.length ? <div className="cdp-card"><h3><CreditCard size={17} /> Pagamento</h3><ul className="cdp-chips">{r.payments.map((p) => <li key={p}>{p}</li>)}</ul></div> : null}
        {r.instagram && <div className="cdp-card"><h3><InstagramIcon size={17} /> Instagram</h3>{r.demo ? <p>@{r.instagram}</p> : <a href={`https://instagram.com/${r.instagram}`} target="_blank" rel="noreferrer">@{r.instagram}</a>}</div>}
      </div>
    </section>

    <footer className="cdp-footer"><div className="cdp-container">
      <Logo restaurant={r} />
      <p>© {now.getFullYear()} {r.name}{r.demo && " · Marca, fotos, preços e endereço ilustrativos. Exemplo de cardápio digital para restaurantes."}</p>
    </div></footer>

    {whatsappHref
      ? <a className="cdp-wa" href={whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={20} /> Pedir no WhatsApp</a>
      : <button type="button" className="cdp-wa" onClick={() => setToast(true)}><MessageCircle size={20} /> Pedir no WhatsApp</button>}

    {toast && <div className="cdp-toast" role="status">No cardápio de verdade, este botão abre o WhatsApp do restaurante com a mensagem pronta.</div>}

    {zoom && <div className="cdp-zoom" role="dialog" aria-modal="true" aria-label={zoom.name} onClick={() => setZoom(null)}>
      <figure onClick={(event) => event.stopPropagation()}>
        <button type="button" className="cdp-zoom-close" onClick={() => setZoom(null)} aria-label="Fechar"><X size={22} /></button>
        <img src={zoom.photo} alt={`Foto de ${zoom.name}`} />
        <figcaption><strong>{zoom.name}</strong>{zoom.description && <span>{zoom.description}</span>}<Price price={zoom.price} /></figcaption>
      </figure>
    </div>}
  </div>;
}
