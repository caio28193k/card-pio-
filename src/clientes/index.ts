import type { Restaurant } from "../types";
import brasa47 from "./brasa47";
import lenha21 from "./lenha21";

/**
 * Cada cardápio fica em seusite.com/<slug>.
 * Para um cliente novo: copie um arquivo desta pasta, troque os dados e adicione aqui.
 */
export const restaurants: Restaurant[] = [brasa47, lenha21];

/** Página aberta em seusite.com/ (sem caminho). */
export const defaultRestaurant = brasa47;

export function findRestaurant(pathname: string): Restaurant {
  const slug = decodeURIComponent(pathname.split("/").filter(Boolean)[0] ?? "").toLowerCase();
  return restaurants.find((restaurant) => restaurant.slug === slug) ?? defaultRestaurant;
}
