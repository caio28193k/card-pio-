import type { Restaurant } from "../types";
import brasa47 from "./brasa47";
import brasa47Mesa from "./brasa47-mesa";
import lenha21 from "./lenha21";
import { brasa47Teste, lenha21Teste } from "./teste";

/**
 * Cada cardápio fica em seusite.com/<slug>.
 * Para um cliente novo: copie um arquivo desta pasta, troque os dados e adicione aqui.
 */
export const restaurants: Restaurant[] = [brasa47, lenha21, brasa47Mesa, brasa47Teste, lenha21Teste];

/** Página aberta em seusite.com/ (sem caminho). */
export const defaultRestaurant = brasa47;

export function findRestaurant(pathname: string): Restaurant {
  const slug = decodeURIComponent(pathname.split("/").filter(Boolean)[0] ?? "").toLowerCase();
  return restaurants.find((restaurant) => restaurant.slug === slug) ?? defaultRestaurant;
}
