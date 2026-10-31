import type { AddonGroup, Restaurant } from "../types";

const adicionais: AddonGroup = {
  id: "adicionais",
  name: "Adicionais",
  options: [
    { id: "bacon", name: "Bacon", price: 500 },
    { id: "cheddar", name: "Cheddar extra", price: 400 },
    { id: "ovo", name: "Ovo", price: 300 },
    { id: "blend", name: "Blend extra 160g", price: 900 },
  ],
};

const brasa47: Restaurant = {
  slug: "hamburgueria",
  name: "Brasa 47",
  logo: { text: "BRASA", highlight: "47", icon: "flame" },
  kicker: "Hamburgueria artesanal",
  tagline: "Pão macio, carne suculenta e cheddar derretendo.",
  heroImage: "/brasa-hero.webp",
  layout: "fotos",
  theme: { accent: "#ffc400", accentInk: "#000000" },
  whatsapp: "",
  whatsappMessage: "Olá! Vi o cardápio e quero fazer um pedido.",
  instagram: "brasa47",
  address: "Rua Exemplo, 47 · Centro",
  hours: [{ days: [2, 3, 4, 5, 6, 0], open: "11:00", close: "23:30" }],
  payments: ["Pix", "Crédito", "Débito", "Dinheiro"],
  delivery: "Entrega na região central. Retirada no balcão.",
  ordering: { deliveryFee: 600, pickup: true, payments: ["Pix", "Cartão na entrega", "Dinheiro"] },
  description: "Cardápio de demonstração Brasa 47. Burgers, combos, acompanhamentos e bebidas com fotos, ingredientes e preços.",
  demo: true,
  categories: [
    { name: "Burgers", addonGroups: [adicionais] },
    {
      name: "Combos",
      note: "Acompanha fritas individuais e refrigerante lata.",
      addonGroups: [adicionais, { id: "troca", name: "Trocar acompanhamento", single: true, options: [{ id: "onion", name: "Onion rings no lugar das fritas", price: 400 }] }],
    },
    { name: "Acompanhamentos" },
    { name: "Bebidas" },
  ],
  products: [
    { id: "classic", name: "Brasa Clássico", category: "Burgers", description: "Blend 160g, cheddar, alface, tomate e molho da casa no brioche.", price: 3290, photo: "/brasa-1-tl.webp", badge: "Mais pedido" },
    { id: "double", name: "Double Smash", category: "Burgers", description: "Dois smash burgers, cheddar duplo, cebola grelhada e molho especial.", price: 3690, photo: "/brasa-1-tr.webp" },
    { id: "bacon", name: "Bacon da Brasa", category: "Burgers", description: "Blend 160g, bacon crocante, cheddar e maionese defumada.", price: 3590, photo: "/brasa-2-tr.webp", badge: "Favorito" },
    { id: "chicken", name: "Chicken da Casa", category: "Burgers", description: "Frango grelhado, alface, tomate e molho de ervas no brioche.", price: 2990, photo: "/brasa-2-tl.webp" },
    { id: "combo", name: "Combo Brasa 47", category: "Combos", description: "Brasa Clássico + fritas individuais + refrigerante gelado.", price: 4690, photo: "/brasa-1-bl.webp", badge: "Melhor escolha" },
    { id: "fries", name: "Fritas da Casa", category: "Acompanhamentos", description: "Fritas crocantes com tempero da casa e molho cremoso.", price: 1890, photo: "/brasa-1-br.webp" },
    { id: "onion", name: "Onion Rings", category: "Acompanhamentos", description: "Anéis de cebola empanados, crocantes e acompanhados de molho.", price: 1990, photo: "/brasa-2-bl.webp" },
    { id: "lemonade", name: "Limonada da Casa", category: "Bebidas", description: "Limonada gelada com limão e hortelã. Copo de 400 ml.", price: 1290, photo: "/brasa-2-br.webp" },
    { id: "soda", name: "Refrigerante lata", category: "Bebidas", description: "350 ml. Consulte os sabores disponíveis.", price: 700 },
  ],
};

export default brasa47;
