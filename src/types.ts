/** Preço em centavos. Ex.: 3290 = R$ 32,90 */
export type Cents = number;

export type Size = { label: string; price: Cents };

export type Product = {
  id: string;
  name: string;
  category: string;
  description?: string;
  /** Um preço único ou uma lista de tamanhos (ex.: pizza broto/média/grande). */
  price: Cents | Size[];
  /** Caminho a partir de /public. Sem foto, o item aparece só com texto. */
  photo?: string;
  badge?: string;
  /** Substitui os adicionais da categoria só para este produto. [] = sem adicionais. */
  addonGroups?: AddonGroup[];
};

export type Addon = { id: string; name: string; price: Cents };

export type AddonGroup = {
  id: string;
  name: string;
  options: Addon[];
  /** true = o cliente escolhe no máximo um (ex.: borda). */
  single?: boolean;
};

export type Category = {
  name: string;
  note?: string;
  /** Permite meio a meio. Categorias com o mesmo grupo se misturam (ex.: "salgadas" com "salgadas"). */
  halfAndHalf?: string;
  /** Adicionais oferecidos para todos os produtos da categoria. */
  addonGroups?: AddonGroup[];
};

/** days: 0 = domingo … 6 = sábado. Horário "HH:MM". Se close <= open, fecha depois da meia-noite. */
export type OpeningHours = { days: number[]; open: string; close: string };

export type Ordering = {
  /** Taxa de entrega fixa. */
  deliveryFee: Cents;
  /** Permite retirada no local (sem taxa). */
  pickup?: boolean;
  /** Formas de pagamento no pedido. A opção "Dinheiro" pede o troco. */
  payments: string[];
};

export type Restaurant = {
  /** Endereço da página: seusite.com/<slug> */
  slug: string;
  name: string;
  /** Logo em texto: a parte em destaque aparece na cor da marca. */
  logo: { text: string; highlight?: string; icon?: "flame" | "pizza" | "utensils" };
  kicker?: string;
  tagline: string;
  heroImage?: string;
  /** "fotos" = fotos grandes (cardápio curto e com boas fotos). "lista" = lista compacta (cardápio longo). */
  layout?: "fotos" | "lista";
  theme: {
    /** Cor de destaque (botões, preços, categoria selecionada). */
    accent: string;
    /** Cor do texto em cima da cor de destaque. */
    accentInk: string;
  };
  /** Só números, com DDI e DDD. Ex.: 5511999998888. Vazio = mostra uma prévia da mensagem em vez de abrir o WhatsApp. */
  whatsapp?: string;
  whatsappMessage?: string;
  /** Usuário sem @ */
  instagram?: string;
  address?: string;
  hours?: OpeningHours[];
  payments?: string[];
  delivery?: string;
  /** Liga o carrinho. Sem isto, a página é só cardápio de consulta. */
  ordering?: Ordering;
  categories: Category[];
  products: Product[];
  /** Mostra a faixa e os avisos de "demonstração". */
  demo?: boolean;
  description?: string;
};
