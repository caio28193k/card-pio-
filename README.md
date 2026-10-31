# Cardápio digital

Cardápio de consulta para restaurantes: tema escuro, busca, filtros por categoria, preços por tamanho (pizza), foto ampliável, horário com "Aberto agora", informações da loja e botão fixo "Pedir no WhatsApp".
Não tem carrinho, login nem banco de dados. Cada restaurante é um arquivo de dados.

## Endereços

| Caminho | Página |
|---|---|
| `/` ou `/hamburgueria` | Demo Brasa 47 (hamburgueria) |
| `/pizzaria` | Demo Lenha 21 (pizzaria, sem fotos) |

Qualquer caminho desconhecido abre a demo da hamburgueria.

## Criar o cardápio de um cliente

1. Copie `src/clientes/brasa47.ts` (ou `lenha21.ts` para pizzaria) para `src/clientes/<nome>.ts`.
2. Troque os dados:
   - `slug`: o caminho da página (ex.: `donna` → `seusite.com/donna`).
   - `logo`, `kicker`, `tagline`, `heroImage`.
   - `theme.accent` (cor da marca) e `theme.accentInk` (cor do texto sobre ela; preto ou branco, o que tiver mais contraste).
   - `whatsapp`: só números, com 55 + DDD (ex.: `5511999998888`).
   - `instagram`, `address`, `hours`, `payments`, `delivery`.
   - `categories` e `products`. Preços em **centavos** (`3290` = R$ 32,90). Pizza: `price: [{ label: "Broto", price: 3990 }, ...]`.
   - Apague `demo: true` (tira a faixa de demonstração e ativa os links de Instagram e mapa).
3. Coloque as fotos em `public/<nome>/` e aponte em `photo: "/<nome>/arquivo.webp"`. Produto sem `photo` aparece só com texto.
4. Importe o arquivo em `src/clientes/index.ts` e adicione na lista `restaurants`.

O nome de `category` em cada produto precisa ser igual a um `name` em `categories`. Se não for, o produto não aparece.

Horários: `days` usa 0 = domingo … 6 = sábado. Se `close` for menor que `open` (ex.: 18:00 às 00:30), o sistema entende que fecha depois da meia-noite. O "Aberto agora" usa o relógio do celular do cliente.

## Executar

Requer Node.js 22.

```sh
npm ci
npm run dev
```

## Publicar na Vercel

Importe o repositório com a pasta raiz como diretório do projeto. O `vercel.json` configura o build e redireciona todos os caminhos para o app, então `/pizzaria` e `/<cliente>` funcionam direto.

As fotos da demo de hamburgueria foram geradas para demonstração. Em cardápios de clientes, use fotos reais dos produtos.
