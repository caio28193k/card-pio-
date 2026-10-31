import type { Restaurant } from "../types";
import brasa47 from "./brasa47";
import lenha21 from "./lenha21";

/**
 * Páginas de teste: iguais às demos, mas o pedido abre o WhatsApp de verdade.
 * Não mande estes links para leads. Apague este arquivo quando terminar de testar.
 */
const TEST_WHATSAPP = "5538988035618";

export const brasa47Teste: Restaurant = { ...brasa47, slug: "teste", whatsapp: TEST_WHATSAPP };
export const lenha21Teste: Restaurant = { ...lenha21, slug: "teste-pizzaria", whatsapp: TEST_WHATSAPP };
