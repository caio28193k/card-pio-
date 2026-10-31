import { money } from "./cart";
import type { Product } from "./types";

export function Price({ price }: { price: Product["price"] }) {
  if (typeof price === "number") return <strong className="cdp-price">{money(price)}</strong>;
  return <ul className="cdp-sizes">{price.map((size) => <li key={size.label}><span>{size.label}</span><strong>{money(size.price)}</strong></li>)}</ul>;
}
