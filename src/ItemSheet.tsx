import { useMemo, useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { addonGroupsFor, addonKey, allowsHalf, halfOptions, money, resolveLine, sizesOf, type CartLine } from "./cart";
import type { Product, Restaurant } from "./types";
import { Price } from "./Price";

type Props = {
  restaurant: Restaurant;
  product: Product;
  onClose: () => void;
  /** Sem esta função, a janela só mostra os detalhes (cardápio sem carrinho). */
  onAdd?: (line: CartLine) => void;
};

export function ItemSheet({ restaurant: r, product, onClose, onAdd }: Props) {
  const sizes = sizesOf(product);
  const [size, setSize] = useState(sizes[sizes.length - 1]?.label);
  const [half, setHalf] = useState(false);
  const [halfId, setHalfId] = useState("");
  const [addons, setAddons] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [qty, setQty] = useState(1);

  const groups = addonGroupsFor(r, product);
  const flavors = useMemo(() => halfOptions(r, product, size), [r, product, size]);
  const halfReady = !half || flavors.some((p) => p.id === halfId);
  const draft: CartLine = { key: "", productId: product.id, size, halfId: half && halfReady ? halfId : undefined, addonIds: addons, note, qty };
  const resolved = resolveLine(r, draft);

  const toggleAddon = (key: string, groupKeys: string[], single?: boolean) => setAddons((current) => {
    if (current.includes(key)) return current.filter((k) => k !== key);
    return single ? [...current.filter((k) => !groupKeys.includes(k)), key] : [...current, key];
  });

  const add = () => {
    if (!onAdd || !halfReady || !resolved) return;
    onAdd({ ...draft, key: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, note: note.trim() });
  };

  return <div className="cdp-modal" role="dialog" aria-modal="true" aria-label={product.name} onClick={onClose}>
    <div className="cdp-sheet" onClick={(event) => event.stopPropagation()}>
      <div className="cdp-sheet-top"><span className="cdp-grip" aria-hidden="true" /><button type="button" className="cdp-sheet-close" onClick={onClose} aria-label="Fechar"><X size={22} /></button></div>
      <div className="cdp-sheet-body">
        {product.photo && <img className="cdp-sheet-photo" src={product.photo} alt={`Foto de ${product.name}`} />}
        <div className="cdp-sheet-pad">
          {product.badge && <span className="cdp-badge">{product.badge}</span>}
          <h2>{product.name}</h2>
          {product.description && <p className="cdp-sheet-desc">{product.description}</p>}
          {!onAdd && <Price price={product.price} />}

          {onAdd && sizes.length > 0 && <fieldset className="cdp-field">
            <legend>Tamanho</legend>
            {sizes.map((s) => <label key={s.label} className="cdp-option">
              <input type="radio" name="size" checked={size === s.label} onChange={() => setSize(s.label)} />
              <span>{s.label}</span><strong>{money(s.price)}</strong>
            </label>)}
          </fieldset>}

          {onAdd && allowsHalf(r, product) && flavors.length > 0 && <fieldset className="cdp-field">
            <legend>Sabores</legend>
            <label className="cdp-option">
              <input type="radio" name="half" checked={!half} onChange={() => setHalf(false)} />
              <span>Inteira de {product.name}</span>
            </label>
            <label className="cdp-option">
              <input type="radio" name="half" checked={half} onChange={() => setHalf(true)} />
              <span>Meio a meio</span>
            </label>
            {half && <label className="cdp-select">
              <span>Outra metade</span>
              <select value={halfId} onChange={(event) => setHalfId(event.target.value)}>
                <option value="">Escolha o sabor</option>
                {flavors.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <small>Vale o preço do sabor mais caro.</small>
            </label>}
          </fieldset>}

          {onAdd && groups.map((group) => {
            const groupKeys = group.options.map((addon) => addonKey(group, addon));
            return <fieldset className="cdp-field" key={group.id}>
              <legend>{group.name} <small>{group.single ? "escolha 1 (opcional)" : "opcional"}</small></legend>
              {group.options.map((addon) => {
                const key = addonKey(group, addon);
                return <label key={key} className="cdp-option">
                  <input type="checkbox" checked={addons.includes(key)} onChange={() => toggleAddon(key, groupKeys, group.single)} />
                  <span>{addon.name}</span><strong>+ {money(addon.price)}</strong>
                </label>;
              })}
            </fieldset>;
          })}

          {onAdd && <label className="cdp-field cdp-note">
            <span className="cdp-legend">Observação</span>
            <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={2} maxLength={140} placeholder="Ex.: sem cebola, ponto da carne..." />
          </label>}
        </div>
      </div>

      {onAdd && <div className="cdp-sheet-foot">
        <div className="cdp-qty" aria-label="Quantidade">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuir"><Minus size={18} /></button>
          <span aria-live="polite">{qty}</span>
          <button type="button" onClick={() => setQty((q) => Math.min(30, q + 1))} aria-label="Aumentar"><Plus size={18} /></button>
        </div>
        <button type="button" className="cdp-primary" onClick={add} disabled={!halfReady || !resolved}>
          {halfReady ? <>Adicionar <span>{resolved ? money(resolved.total) : ""}</span></> : "Escolha a outra metade"}
        </button>
      </div>}
    </div>
  </div>;
}
