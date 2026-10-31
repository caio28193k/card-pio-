import type { Restaurant } from "../types";
import brasa47 from "./brasa47";

/**
 * Demo do cardápio só de consulta (salão / QR code na mesa): mesmos produtos e fotos,
 * sem carrinho, sem botão de WhatsApp e sem informações de entrega.
 */
const brasa47Mesa: Restaurant = {
  ...brasa47,
  slug: "mesa",
  ordering: undefined,
  whatsapp: undefined,
  delivery: undefined,
  description: "Cardápio de demonstração Brasa 47 para consulta no salão, pelo QR code da mesa.",
};

export default brasa47Mesa;
