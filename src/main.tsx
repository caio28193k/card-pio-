import { createRoot } from "react-dom/client";
import { Cardapio } from "./Cardapio";
import { findRestaurant } from "./clientes";
import "./base.css";
import "./cardapio.css";

createRoot(document.getElementById("root")!).render(<Cardapio restaurant={findRestaurant(window.location.pathname)} />);
