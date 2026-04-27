# DriveGestor

MVP frontend para gestao de aluguel de carros, criado para autonomos controlarem clientes, frota e pagamentos de forma simples e responsiva.

O projeto foi construido com React, Vite, Tailwind CSS, React Router DOM, React Hook Form, Zod, Lucide React e Supabase client configurado para uso futuro em services.

## Funcionalidades

- Dashboard com totais de clientes, carros, pagamentos pendentes e pagamentos recebidos.
- Cadastro, edicao, listagem e exclusao de clientes.
- Cadastro, edicao, listagem e exclusao de carros.
- Badges visuais para status dos carros: Disponivel, Alugado e Manutencao.
- Cadastro, listagem, exclusao e filtro de pagamentos.
- Acao para marcar pagamento pendente como pago.
- Badges visuais para status dos pagamentos: Pago e Pendente.
- Persistencia local dos dados via `localStorage`.
- Layout responsivo estilo SaaS com sidebar, header, cards, formularios e tabelas.

## Tecnologias

- React
- Vite
- Tailwind CSS
- React Router DOM
- React Hook Form
- Zod
- Lucide React
- Supabase JS
- localStorage

## Requisitos

Antes de rodar o projeto, instale:

- Node.js 18 ou superior
- npm

## Instalacao

Na raiz do projeto, instale as dependencias:

```bash
npm install
```

## Variaveis de ambiente

O projeto possui um client do Supabase em `src/lib/supabase.js`.

Crie ou mantenha um arquivo `.env` na raiz com:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_publishable_ou_anon
```

Nao coloque chaves secretas, `service_role` ou credenciais privadas no frontend.

No momento, o app ainda usa `localStorage` para os dados do MVP. O client do Supabase esta pronto para ser importado em services futuros:

```js
import { supabase } from '../lib/supabase';
```

## Rodando em desenvolvimento

Inicie o servidor local:

```bash
npm run dev
```

Abra o endereco exibido no terminal, normalmente:

```txt
http://localhost:5173/
```

ou:

```txt
http://127.0.0.1:5173/
```

## Build de producao

Gere os arquivos finais:

```bash
npm run build
```

O Vite criara a pasta `dist/`. Essa pasta contem os arquivos que devem ser enviados para hospedagem ou servidor estatico.

Para testar a build localmente:

```bash
npm run preview
```

## Rotas

| Rota | Pagina |
| --- | --- |
| `/` | Dashboard |
| `/clientes` | Clientes |
| `/carros` | Carros |
| `/pagamentos` | Pagamentos |

## Estrutura principal

```txt
src/
├── components/
│   ├── Sidebar.jsx
│   ├── Header.jsx
│   ├── CardDashboard.jsx
│   ├── StatusBadge.jsx
│   └── EmptyState.jsx
│
├── lib/
│   └── supabase.js
│
├── pages/
│   ├── Dashboard.jsx
│   ├── Clientes.jsx
│   ├── Carros.jsx
│   └── Pagamentos.jsx
│
├── routes/
│   └── AppRoutes.jsx
│
├── utils/
│   └── storage.js
│
├── App.jsx
├── main.jsx
└── index.css
```

## Como os dados sao salvos

Neste MVP, clientes, carros e pagamentos sao persistidos no navegador com `localStorage`.

As funcoes reutilizaveis ficam em:

```txt
src/utils/storage.js
```

Elas permitem:

- listar registros;
- salvar colecoes;
- adicionar registros;
- atualizar registros;
- excluir registros.

## Scripts disponiveis

```bash
npm run dev
```

Roda o projeto em modo desenvolvimento.

```bash
npm run build
```

Gera a build de producao na pasta `dist/`.

```bash
npm run preview
```

Executa uma pre-visualizacao local da build.

## Deploy

Para publicar em uma hospedagem estatica:

1. Rode `npm install`.
2. Rode `npm run build`.
3. Envie o conteudo da pasta `dist/` para o servidor.
4. Configure a hospedagem para servir `index.html` como fallback das rotas do React Router.

Em plataformas como Vercel, Netlify ou Render Static Site, use:

```txt
Build command: npm run build
Publish directory: dist
```

Configure tambem as variaveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` no painel da plataforma.

## Observacoes

- Nao existe backend neste momento.
- Nao existe autenticacao implementada ainda.
- Nao existe banco de dados sendo usado pelas telas atuais.
- O Supabase esta apenas configurado como client para proximas etapas.
- O app foi pensado como MVP de portfolio, com visual limpo e organizacao simples para evolucao futura.
