import { useState } from "react";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { money, type CartLine, type Customer, type ResolvedLine } from "./cart";
import type { Restaurant } from "./types";

type Props = {
  restaurant: Restaurant;
  items: ResolvedLine[];
  open: boolean | undefined;
  customer: Customer;
  setCustomer: (update: (c: Customer) => Customer) => void;
  setQty: (key: CartLine["key"], qty: number) => void;
  onClose: () => void;
  onSend: () => void;
  sent: boolean;
  onReset: () => void;
};

export function CartSheet({ restaurant: r, items, open, customer, setCustomer, setQty, onClose, onSend, sent, onReset }: Props) {
  const ordering = r.ordering!;
  const [tried, setTried] = useState(false);
  const delivery = customer.mode === "entrega";
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const fee = delivery ? ordering.deliveryFee : 0;

  const errors = {
    name: !customer.name.trim(),
    address: delivery && !customer.address.trim(),
    payment: !customer.payment,
  };
  const invalid = errors.name || errors.address || errors.payment;
  const field = (key: keyof Customer) => ({
    value: customer[key],
    onChange: (event: { target: { value: string } }) => setCustomer((c) => ({ ...c, [key]: event.target.value })),
  });

  const send = () => {
    setTried(true);
    if (!invalid && items.length) onSend();
  };

  return <div className="cdp-modal" role="dialog" aria-modal="true" aria-labelledby="cdp-cart-title" onClick={onClose}>
    <div className="cdp-sheet" onClick={(event) => event.stopPropagation()}>
      <div className="cdp-sheet-top"><span className="cdp-grip" aria-hidden="true" /><button type="button" className="cdp-sheet-close" onClick={onClose} aria-label="Fechar"><X size={22} /></button></div>
      <div className="cdp-sheet-body"><div className="cdp-sheet-pad">
        <h2 id="cdp-cart-title">Seu pedido</h2>

        {sent && <div className="cdp-notice is-ok">
          <p>{r.whatsapp ? "Abrimos o WhatsApp com o seu pedido. Confira e toque em enviar." : "Pedido montado."}</p>
          <button type="button" onClick={onReset}>Começar um novo pedido</button>
        </div>}

        {open === false && !sent && <div className="cdp-notice">
          <p>Estamos fechados agora. Você pode enviar o pedido, e a loja responde quando abrir.</p>
        </div>}

        {items.length === 0
          ? <p className="cdp-muted">Seu carrinho está vazio.</p>
          : <ul className="cdp-lines">
            {items.map((item) => <li key={item.line.key}>
              <div className="cdp-line-text">
                <strong>{item.title}</strong>
                {item.groups.map(({ group, addons }) => <span key={group.id}>{group.name}: {addons.map((a) => a.name).join(", ")}</span>)}
                {item.line.note && <span>Obs.: {item.line.note}</span>}
                <b>{money(item.total)}</b>
              </div>
              <div className="cdp-qty is-small">
                <button type="button" onClick={() => setQty(item.line.key, item.line.qty - 1)} aria-label={item.line.qty === 1 ? `Remover ${item.title}` : "Diminuir"}>{item.line.qty === 1 ? <Trash2 size={16} /> : <Minus size={16} />}</button>
                <span>{item.line.qty}</span>
                <button type="button" onClick={() => setQty(item.line.key, item.line.qty + 1)} aria-label="Aumentar"><Plus size={16} /></button>
              </div>
            </li>)}
          </ul>}

        {items.length > 0 && <>
          <fieldset className="cdp-field">
            <legend>Como você quer receber?</legend>
            <label className="cdp-option"><input type="radio" name="mode" checked={delivery} onChange={() => setCustomer((c) => ({ ...c, mode: "entrega" }))} /><span>Entrega</span><strong>{money(ordering.deliveryFee)}</strong></label>
            {ordering.pickup && <label className="cdp-option"><input type="radio" name="mode" checked={!delivery} onChange={() => setCustomer((c) => ({ ...c, mode: "retirada" }))} /><span>Retirar no local</span><strong>Grátis</strong></label>}
          </fieldset>

          <div className="cdp-field">
            <label className={`cdp-input ${tried && errors.name ? "has-error" : ""}`}><span>Seu nome</span><input {...field("name")} autoComplete="name" /></label>
            {delivery && <>
              <label className={`cdp-input ${tried && errors.address ? "has-error" : ""}`}><span>Endereço (rua, número e bairro)</span><input {...field("address")} autoComplete="street-address" /></label>
              <label className="cdp-input"><span>Complemento ou referência (opcional)</span><input {...field("complement")} /></label>
            </>}
          </div>

          <fieldset className={`cdp-field ${tried && errors.payment ? "has-error" : ""}`}>
            <legend>Pagamento</legend>
            {ordering.payments.map((p) => <label key={p} className="cdp-option"><input type="radio" name="payment" checked={customer.payment === p} onChange={() => setCustomer((c) => ({ ...c, payment: p }))} /><span>{p}</span></label>)}
            {customer.payment === "Dinheiro" && <label className="cdp-input"><span>Troco para quanto? (opcional)</span><input {...field("change")} inputMode="decimal" placeholder="Ex.: R$ 100" /></label>}
          </fieldset>

          <dl className="cdp-totals">
            <div><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
            {delivery && <div><dt>Entrega</dt><dd>{money(fee)}</dd></div>}
            <div className="is-total"><dt>Total</dt><dd>{money(subtotal + fee)}</dd></div>
          </dl>
          {tried && invalid && <p className="cdp-error" role="alert">Preencha {[errors.name && "seu nome", errors.address && "o endereço", errors.payment && "a forma de pagamento"].filter(Boolean).join(", ")}.</p>}
        </>}
      </div></div>

      {items.length > 0 && <div className="cdp-sheet-foot">
        <button type="button" className="cdp-primary is-wide" onClick={send}>Enviar pedido no WhatsApp <span>{money(subtotal + fee)}</span></button>
      </div>}
    </div>
  </div>;
}
