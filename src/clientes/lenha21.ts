import type { Restaurant, Size } from "../types";

const sizes = (broto: number, media: number, grande: number): Size[] => [
  { label: "Broto", price: broto },
  { label: "Média", price: media },
  { label: "Grande", price: grande },
];

const tradicional = sizes(3990, 5490, 6490);
const especial = sizes(4590, 6290, 7490);

const lenha21: Restaurant = {
  slug: "pizzaria",
  name: "Lenha 21",
  logo: { text: "LENHA", highlight: "21", icon: "pizza" },
  kicker: "Pizzaria no forno a lenha",
  tagline: "Massa de fermentação lenta, borda alta e muito recheio.",
  theme: { accent: "#ff6b3d", accentInk: "#160803" },
  whatsapp: "",
  whatsappMessage: "Olá! Vi o cardápio e quero fazer um pedido.",
  instagram: "lenha21pizzaria",
  address: "Av. Exemplo, 21 · Jardim",
  hours: [
    { days: [2, 3, 4, 5], open: "18:30", close: "23:30" },
    { days: [6, 0], open: "18:00", close: "00:30" },
  ],
  payments: ["Pix", "Crédito", "Débito", "Dinheiro", "VR/VA"],
  delivery: "Entrega e retirada. Taxa conforme o bairro.",
  description: "Cardápio de demonstração Lenha 21. Pizzas tradicionais, especiais, doces, bordas e bebidas com tamanhos e preços.",
  demo: true,
  categories: [
    { name: "Tradicionais", note: "Broto 4 fatias · Média 6 fatias · Grande 8 fatias. Meio a meio: vale o preço do sabor mais caro." },
    { name: "Especiais", note: "Broto 4 fatias · Média 6 fatias · Grande 8 fatias." },
    { name: "Doces", note: "Broto 4 fatias · Média 6 fatias." },
    { name: "Bordas recheadas", note: "Valor adicional por pizza." },
    { name: "Bebidas" },
  ],
  products: [
    { id: "mussarela", name: "Mussarela", category: "Tradicionais", description: "Molho de tomate, mussarela, rodelas de tomate e orégano.", price: tradicional, badge: "Mais pedida" },
    { id: "calabresa", name: "Calabresa", category: "Tradicionais", description: "Molho de tomate, calabresa fatiada, cebola e azeitonas.", price: tradicional },
    { id: "marguerita", name: "Marguerita", category: "Tradicionais", description: "Molho de tomate, mussarela, tomate e manjericão fresco.", price: tradicional },
    { id: "napolitana", name: "Napolitana", category: "Tradicionais", description: "Mussarela, tomate, parmesão ralado e orégano.", price: tradicional },
    { id: "frango-catupiry", name: "Frango com requeijão", category: "Tradicionais", description: "Frango desfiado temperado coberto com requeijão cremoso.", price: tradicional },
    { id: "portuguesa", name: "Portuguesa", category: "Tradicionais", description: "Presunto, ovos, cebola, ervilha, mussarela e azeitonas.", price: tradicional },
    { id: "quatro-queijos", name: "Quatro queijos", category: "Especiais", description: "Mussarela, provolone, parmesão e gorgonzola.", price: especial, badge: "Favorita" },
    { id: "lombo", name: "Lombo com requeijão", category: "Especiais", description: "Lombo canadense, requeijão cremoso e cebola roxa.", price: especial },
    { id: "pepperoni", name: "Pepperoni", category: "Especiais", description: "Mussarela e pepperoni fatiado fininho.", price: especial },
    { id: "da-casa", name: "Lenha 21", category: "Especiais", description: "Mussarela de búfala, tomate-cereja, rúcula e parmesão.", price: especial, badge: "Da casa" },
    { id: "brigadeiro", name: "Brigadeiro", category: "Doces", description: "Chocolate ao leite e granulado.", price: [{ label: "Broto", price: 3690 }, { label: "Média", price: 4990 }] },
    { id: "romeu-julieta", name: "Romeu e Julieta", category: "Doces", description: "Mussarela e goiabada cremosa.", price: [{ label: "Broto", price: 3690 }, { label: "Média", price: 4990 }] },
    { id: "borda-catupiry", name: "Borda de requeijão", category: "Bordas recheadas", price: 1000 },
    { id: "borda-cheddar", name: "Borda de cheddar", category: "Bordas recheadas", price: 1000 },
    { id: "borda-chocolate", name: "Borda de chocolate", category: "Bordas recheadas", price: 1200 },
    { id: "refri-2l", name: "Refrigerante 2 L", category: "Bebidas", description: "Consulte os sabores disponíveis.", price: 1400 },
    { id: "refri-lata", name: "Refrigerante lata", category: "Bebidas", description: "350 ml.", price: 700 },
    { id: "suco", name: "Suco natural", category: "Bebidas", description: "Laranja, limão ou maracujá. 500 ml.", price: 1100 },
  ],
};

export default lenha21;
