# Brasa 47 — Cardápio de demonstração

Página de cardápio responsiva com busca, filtros por categoria, fotos grandes, descrições completas e preços sempre visíveis. No celular, cada produto ocupa uma linha.
Conteúdo ilustrativo. O projeto é uma página de consulta, sem carrinho, pedidos, login ou banco de dados.

## Executar

Requer Node.js 22.

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run preview
```

## Publicar na Vercel

Importe este repositório e mantenha a pasta raiz como diretório do projeto.
O arquivo `vercel.json` configura Vite, comando `npm run build` e saída `dist`.
Não há variáveis de ambiente obrigatórias.

Todos os arquivos de imagem ficam em `public/` e usam caminhos do próprio site.
Funcionam no endereço `.vercel.app` e no domínio próprio conectado ao projeto.
As fontes Manrope e Bebas Neue são carregadas pelo Google Fonts.

## Personalizar

- Produtos, preços e textos: `src/BurgerDemo.tsx`.
- Estilo e regras mobile: `src/burger-demo.css`.
- Imagens locais: `public/brasa-*.webp`.
- Título e descrição da página: `index.html`.

As fotografias ilustrativas foram geradas para esta demonstração e otimizadas para WebP.
