import { useEffect, useState } from "react";
import type { Addon, AddonGroup, Cents, Product, Restaurant, Size } from "./types";

/** O carrinho guarda só referências; preços e nomes são lidos do cardápio atual. */
export type CartLine = {
  key: string;
  productId: string;
  size?: string;
  /** Segundo sabor (meio a meio). */
  halfId?: string;
  /** "grupo:adicional" */
  addonIds: string[];
  note: string;
  qty: number;
};

export type Customer = {
  mode: "entrega" | "retirada";
  name: string;
  address: string;
  complement: string;
  payment: string;
  change: string;
};

export type ResolvedLine = {
  line: CartLine;
  product: Product;
  half?: Product;
  size?: string;
  /** Adicionais escolhidos, por grupo. */
  groups: { group: AddonGroup; addons: Addon[] }[];
  unit: Cents;
  total: Cents;
  title: string;
};

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const money = (cents: number) => currency.format(cents / 100);

export const sizesOf = (product: Product): Size[] => (typeof product.price === "number" ? [] : product.price);

export function priceFor(product: Product, size?: string): Cents | undefined {
  if (typeof product.price === "number") return product.price;
  return product.price.find((s) => s.label === size)?.price;
}

export const categoryOf = (r: Restaurant, product: Product) => r.categories.find((c) => c.name === product.category);

export const addonGroupsFor = (r: Restaurant, product: Product): AddonGroup[] =>
  product.addonGroups ?? categoryOf(r, product)?.addonGroups ?? [];

const halfGroup = (r: Restaurant, product: Product) => categoryOf(r, product)?.halfAndHalf;
export const allowsHalf = (r: Restaurant, product: Product) => Boolean(halfGroup(r, product));

/** Sabores que podem formar meio a meio com o produto, no tamanho escolhido. */
export function halfOptions(r: Restaurant, product: Product, size?: string): Product[] {
  const group = halfGroup(r, product);
  if (!group) return [];
  return r.products.filter((p) => p.id !== product.id && halfGroup(r, p) === group && priceFor(p, size) !== undefined && (sizesOf(p).length > 0) === (sizesOf(product).length > 0));
}

export const addonKey = (group: AddonGroup, addon: Addon) => `${group.id}:${addon.id}`;

export function resolveLine(r: Restaurant, line: CartLine): ResolvedLine | null {
  const product = r.products.find((p) => p.id === line.productId);
  if (!product) return null;
  const hasSizes = sizesOf(product).length > 0;
  const size = hasSizes ? line.size : undefined;
  const base = priceFor(product, size);
  if (base === undefined) return null;

  let half: Product | undefined;
  let unit = base;
  if (line.halfId) {
    half = halfOptions(r, product, size).find((p) => p.id === line.halfId);
    if (!half) return null;
    unit = Math.max(base, priceFor(half, size) ?? 0);
  }

  const groups = addonGroupsFor(r, product)
    .map((group) => ({ group, addons: group.options.filter((addon) => line.addonIds.includes(addonKey(group, addon))) }))
    .filter((g) => g.addons.length > 0);
  unit += groups.reduce((sum, g) => sum + g.addons.reduce((s, a) => s + a.price, 0), 0);

  const name = half ? `½ ${product.name} + ½ ${half.name}` : product.name;
  const title = size ? `${name} (${size})` : name;
  return { line, product, half, size, groups, unit, total: unit * line.qty, title };
}

export function buildOrderMessage(r: Restaurant, items: ResolvedLine[], customer: Customer, fee: Cents): string {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const out: string[] = [`*Novo pedido - ${r.name}*`, ""];
  for (const item of items) {
    out.push(`*${item.line.qty}x ${item.title}* - ${money(item.total)}`);
    for (const { group, addons } of item.groups) out.push(`   ${group.name}: ${addons.map((a) => a.name).join(", ")}`);
    if (item.line.note.trim()) out.push(`   Obs.: ${item.line.note.trim()}`);
  }
  out.push("", `Subtotal: ${money(subtotal)}`);
  if (customer.mode === "entrega") out.push(`Entrega: ${money(fee)}`);
  out.push(`*Total: ${money(subtotal + (customer.mode === "entrega" ? fee : 0))}*`, "");
  out.push(`*${customer.mode === "entrega" ? "Entrega" : "Retirada no local"}*`);
  out.push(`Nome: ${customer.name.trim()}`);
  if (customer.mode === "entrega") {
    out.push(`Endereço: ${customer.address.trim()}`);
    if (customer.complement.trim()) out.push(`Complemento: ${customer.complement.trim()}`);
  }
  const change = customer.payment === "Dinheiro" && customer.change.trim() ? ` (troco para ${customer.change.trim()})` : "";
  out.push(`Pagamento: ${customer.payment}${change}`);
  return out.join("\n");
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Estado salvo no navegador, separado por restaurante. */
export function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => load(key, fallback));
  useEffect(() => {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* modo privado */ }
  }, [key, value]);
  return [value, setValue] as const;
}

export const emptyCustomer: Customer = { mode: "entrega", name: "", address: "", complement: "", payment: "", change: "" };
