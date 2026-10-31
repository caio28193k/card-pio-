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
};

export type Category = { name: string; note?: string };

/** days: 0 = domingo … 6 = sábado. Horário "HH:MM". Se close <= open, fecha depois da meia-noite. */
export type OpeningHours = { days: number[]; open: string; close: string };

export type Restaurant = {
  /** Endereço da página: seusite.com/<slug> */
  slug: string;
  name: string;
  /** Logo em texto: a parte em destaque aparece na cor da marca. */
  logo: { text: string; highlight?: string; icon?: "flame" | "pizza" | "utensils" };
  kicker?: string;
  tagline: string;
  heroImage?: string;
  theme: {
    /** Cor de destaque (botões, preços, categoria selecionada). */
    accent: string;
    /** Cor do texto em cima da cor de destaque. */
    accentInk: string;
  };
  /** Só números, com DDI e DDD. Ex.: 5511999998888. Vazio = botão mostra aviso de demonstração. */
  whatsapp?: string;
  whatsappMessage?: string;
  /** Usuário sem @ */
  instagram?: string;
  address?: string;
  hours?: OpeningHours[];
  payments?: string[];
  delivery?: string;
  categories: Category[];
  products: Product[];
  /** Mostra a faixa e os avisos de "demonstração". */
  demo?: boolean;
  description?: string;
};
