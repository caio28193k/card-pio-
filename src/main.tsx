import { createRoot } from "react-dom/client";
import { inject } from "@vercel/analytics";
import { Cardapio } from "./Cardapio";
import { findRestaurant } from "./clientes";
import "./base.css";
import "./cardapio.css";

/**
 * Visitas contadas no Vercel Web Analytics, por caminho. Ex.: /pizzaria/donna = lead Donna.
 * Abrir qualquer página com ?ignorar faz este aparelho parar de contar (para seus próprios testes).
 * ?contar desfaz.
 */
const IGNORE_KEY = "cdp-ignorar";
try {
  const params = new URLSearchParams(window.location.search);
  if (params.has("ignorar")) window.localStorage.setItem(IGNORE_KEY, "1");
  if (params.has("contar")) window.localStorage.removeItem(IGNORE_KEY);
} catch { /* navegador sem localStorage */ }

const ignored = () => { try { return window.localStorage.getItem(IGNORE_KEY) === "1"; } catch { return false; } };
inject({ beforeSend: (event) => (ignored() ? null : event) });

createRoot(document.getElementById("root")!).render(<Cardapio restaurant={findRestaurant(window.location.pathname)} />);
