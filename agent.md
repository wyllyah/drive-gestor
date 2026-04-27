# agent.md — DriveGestor

## 1. Visão geral do projeto

O **DriveGestor** é um MVP web para gestão simples de aluguel de carros para autônomos.

O objetivo é criar um sistema moderno, simples e funcional para:

- Cadastro de clientes
- Cadastro de carros
- Gestão de pagamentos
- Dashboard com indicadores básicos

O projeto deve ser construído com tecnologias modernas de mercado, mantendo o escopo enxuto e organizado.

---

## 2. Stack obrigatória

O projeto deve usar:

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router DOM
- React Hook Form
- Zod
- Lucide React
- Supabase
- @supabase/supabase-js

---

## 3. Regras principais do projeto

### 3.1 O que o projeto deve ter

O sistema deve conter apenas as funcionalidades essenciais do MVP:

- Dashboard
- Clientes
- Carros
- Pagamentos

### 3.2 O que o projeto NÃO deve ter neste momento

Não implementar:

- Backend próprio
- Node.js/Express
- API externa
- Autenticação
- Controle de usuários
- Permissões por usuário
- Gateway de pagamento
- App mobile
- Integração com GPS
- Relatórios avançados
- Multiempresa
- Controle de contratos
- Assinatura digital
- Upload de arquivos
- Envio de e-mails
- Notificações automáticas

---

## 4. Banco de dados

O projeto deve usar **Supabase** como banco de dados.

Não usar:

- localStorage
- sessionStorage
- IndexedDB
- JSON fake como fonte principal de dados

O Supabase deve ser acessado pelo frontend usando o client oficial:

```js
import { createClient } from "@supabase/supabase-js";
```

---

## 5. Variáveis de ambiente

O arquivo `.env` deve existir na raiz do projeto.

Variáveis obrigatórias:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Nunca usar no frontend:

```env
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_SECRET_KEY
```

Essas chaves são privadas e não devem aparecer no código do projeto.

---

## 6. Client do Supabase

Criar o arquivo:

```txt
src/lib/supabase.js
```

Conteúdo esperado:

```js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Variáveis de ambiente do Supabase não foram configuradas.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
```

Importação padrão nos services:

```js
import { supabase } from "../lib/supabase";
```

---

## 7. Estrutura de pastas recomendada

Usar a seguinte organização:

```txt
src/
├── components/
│   ├── Sidebar.jsx
│   ├── Header.jsx
│   ├── CardDashboard.jsx
│   ├── StatusBadge.jsx
│   ├── EmptyState.jsx
│   ├── Loading.jsx
│   └── ErrorMessage.jsx
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
├── services/
│   ├── clientesService.js
│   ├── carrosService.js
│   └── pagamentosService.js
│
├── lib/
│   └── supabase.js
│
├── schemas/
│   ├── clienteSchema.js
│   ├── carroSchema.js
│   └── pagamentoSchema.js
│
├── App.jsx
├── main.jsx
└── index.css
```

---

## 8. Rotas do sistema

Usar React Router DOM.

Rotas obrigatórias:

```txt
/              Dashboard
/clientes      Clientes
/carros        Carros
/pagamentos    Pagamentos
```

---

## 9. Tabelas do Supabase

As tabelas principais são:

- clientes
- carros
- pagamentos

### 9.1 Tabela clientes

Campos:

```txt
id
nome
cpf
telefone
email
created_at
```

Regras:

- `id` deve ser UUID
- `nome` obrigatório
- `cpf` obrigatório
- `telefone` obrigatório
- `email` obrigatório

### 9.2 Tabela carros

Campos:

```txt
id
marca
modelo
ano
placa
valor_diaria
status
created_at
```

Status permitidos:

```txt
Disponível
Alugado
Manutenção
```

Regras:

- `id` deve ser UUID
- `marca` obrigatório
- `modelo` obrigatório
- `ano` obrigatório
- `placa` obrigatório
- `valor_diaria` obrigatório
- `status` obrigatório

### 9.3 Tabela pagamentos

Campos:

```txt
id
cliente_id
carro_id
valor
data_vencimento
status
forma_pagamento
created_at
```

Status permitidos:

```txt
Pago
Pendente
```

Formas de pagamento permitidas:

```txt
Pix
Dinheiro
Cartão
```

Regras:

- `cliente_id` deve referenciar `clientes.id`
- `carro_id` deve referenciar `carros.id`
- `valor` obrigatório
- `data_vencimento` obrigatório
- `status` obrigatório
- `forma_pagamento` obrigatório

---

## 10. SQL base recomendado

Quando necessário, usar este SQL para criar as tabelas:

```sql
create table clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cpf text not null,
  telefone text not null,
  email text not null,
  created_at timestamp with time zone default now()
);

create table carros (
  id uuid primary key default gen_random_uuid(),
  marca text not null,
  modelo text not null,
  ano int not null,
  placa text not null,
  valor_diaria numeric(10,2) not null,
  status text not null check (status in ('Disponível', 'Alugado', 'Manutenção')),
  created_at timestamp with time zone default now()
);

create table pagamentos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  carro_id uuid not null references carros(id) on delete cascade,
  valor numeric(10,2) not null,
  data_vencimento date not null,
  status text not null check (status in ('Pago', 'Pendente')),
  forma_pagamento text not null check (forma_pagamento in ('Pix', 'Dinheiro', 'Cartão')),
  created_at timestamp with time zone default now()
);
```

---

## 10.1 Migrations do Supabase

As migrations do Supabase ficam em:

```txt
supabase/migrations
```

Toda alteração de estrutura do banco deve ser feita por migration.

Não alterar tabelas manualmente pelo Table Editor ou SQL Editor como fluxo principal.

Para aplicar migrations no banco remoto, usar:

```bash
npx supabase login
npx supabase link --project-ref SEU_PROJECT_REF
npx supabase db push
```

---

## 11. Services

Toda comunicação com Supabase deve ficar na pasta:

```txt
src/services/
```

As páginas não devem conter queries grandes diretamente.

### 11.1 clientesService.js

Funções obrigatórias:

```js
listarClientes()
criarCliente(cliente)
atualizarCliente(id, cliente)
excluirCliente(id)
```

### 11.2 carrosService.js

Funções obrigatórias:

```js
listarCarros()
criarCarro(carro)
atualizarCarro(id, carro)
excluirCarro(id)
```

### 11.3 pagamentosService.js

Funções obrigatórias:

```js
listarPagamentos()
criarPagamento(pagamento)
marcarPagamentoComoPago(id)
excluirPagamento(id)
```

A listagem de pagamentos deve trazer os dados relacionados de cliente e carro:

```js
.select(`
  *,
  clientes (
    nome,
    cpf
  ),
  carros (
    marca,
    modelo,
    placa
  )
`)
```

---

## 12. Validações com Zod

Todos os formulários devem usar:

- React Hook Form
- Zod
- @hookform/resolvers/zod

Criar schemas na pasta:

```txt
src/schemas/
```

### 12.1 clienteSchema.js

Campos:

- nome obrigatório
- cpf obrigatório
- telefone obrigatório
- email obrigatório e válido

### 12.2 carroSchema.js

Campos:

- marca obrigatório
- modelo obrigatório
- ano obrigatório
- placa obrigatório
- valor_diaria obrigatório
- status obrigatório

### 12.3 pagamentoSchema.js

Campos:

- cliente_id obrigatório
- carro_id obrigatório
- valor obrigatório
- data_vencimento obrigatório
- status obrigatório
- forma_pagamento obrigatório

---

## 13. Regras de interface

A interface deve seguir estilo SaaS moderno.

### 13.1 Layout

Obrigatório:

- Sidebar lateral
- Header superior simples
- Área principal com conteúdo
- Layout responsivo
- Espaçamento confortável
- Design limpo

### 13.2 Componentes visuais

Usar:

- Cards
- Tabelas
- Badges
- Botões com hover
- Inputs organizados
- Mensagens de erro
- Estado vazio
- Estado de loading

### 13.3 Cores sugeridas

Usar Tailwind CSS com esta direção visual:

```txt
Fundo geral: slate-50
Sidebar: slate-900
Texto principal: slate-900
Texto secundário: slate-500
Destaque principal: blue-600
Sucesso: green-600
Atenção: amber-500
Erro: red-600
```

### 13.4 Ícones

Usar Lucide React.

Ícones sugeridos:

- LayoutDashboard
- Users
- Car
- CreditCard
- Plus
- Edit
- Trash
- CheckCircle
- Search
- Menu

---

## 14. Dashboard

A página Dashboard deve exibir:

- Total de clientes
- Total de carros
- Quantidade de pagamentos pendentes
- Total recebido em pagamentos pagos

Regras:

- Buscar dados reais do Supabase
- Não usar dados fake
- Não usar localStorage
- Mostrar loading enquanto carrega
- Mostrar mensagem de erro caso falhe

Cálculos:

```txt
Total de clientes = quantidade de registros em clientes
Total de carros = quantidade de registros em carros
Pagamentos pendentes = quantidade de pagamentos com status "Pendente"
Total recebido = soma dos valores dos pagamentos com status "Pago"
```

---

## 15. Página Clientes

A página `/clientes` deve permitir:

- Listar clientes
- Cadastrar cliente
- Editar cliente
- Excluir cliente
- Buscar cliente por nome, CPF ou telefone, se possível

Campos:

- nome
- cpf
- telefone
- email

Regras:

- Usar formulário validado
- Atualizar lista após criar, editar ou excluir
- Mostrar EmptyState quando não houver clientes
- Mostrar loading ao buscar dados
- Mostrar erro em caso de falha

---

## 16. Página Carros

A página `/carros` deve permitir:

- Listar carros
- Cadastrar carro
- Editar carro
- Excluir carro
- Filtrar por status, se possível
- Buscar por placa, marca ou modelo, se possível

Campos:

- marca
- modelo
- ano
- placa
- valor_diaria
- status

Status:

- Disponível
- Alugado
- Manutenção

Regras:

- Usar badge visual para status
- Atualizar lista após criar, editar ou excluir
- Mostrar EmptyState quando não houver carros
- Mostrar loading ao buscar dados
- Mostrar erro em caso de falha

---

## 17. Página Pagamentos

A página `/pagamentos` deve permitir:

- Listar pagamentos
- Cadastrar pagamento
- Excluir pagamento
- Marcar pagamento como pago
- Filtrar por status

Campos:

- cliente_id
- carro_id
- valor
- data_vencimento
- status
- forma_pagamento

Status:

- Pago
- Pendente

Formas de pagamento:

- Pix
- Dinheiro
- Cartão

Regras:

- Um pagamento deve estar vinculado a cliente e carro já cadastrados
- O select de cliente deve buscar clientes do Supabase
- O select de carro deve buscar carros do Supabase
- A tabela deve mostrar nome do cliente e dados do carro
- Usar badge visual para status
- Mostrar EmptyState quando não houver pagamentos
- Mostrar loading ao buscar dados
- Mostrar erro em caso de falha

---

## 18. Padrões de código

### 18.1 Componentização

Evitar arquivos gigantes.

Criar componentes reutilizáveis quando fizer sentido.

Exemplos:

- StatusBadge
- CardDashboard
- EmptyState
- Loading
- ErrorMessage

### 18.2 Nomenclatura

Usar nomes em português para entidades do domínio:

```txt
clientes
carros
pagamentos
```

Usar nomes claros para funções:

```js
listarClientes
criarCliente
atualizarCliente
excluirCliente
```

### 18.3 Tratamento de erros

Toda chamada ao Supabase deve tratar erro:

```js
if (error) throw error;
```

Nas páginas, capturar erro com `try/catch`.

### 18.4 Loading

Toda página que busca dados deve ter estado de loading.

Exemplo:

```js
const [loading, setLoading] = useState(false);
```

### 18.5 Estado vazio

Toda listagem deve mostrar uma mensagem amigável quando não houver registros.

---

## 19. Segurança

Neste MVP, o projeto ainda não terá autenticação.

Mesmo assim:

- Não expor `service_role`
- Não expor chaves secretas
- Não colocar credenciais diretamente no código
- Usar somente variáveis `VITE_` no frontend
- Não fazer commits do arquivo `.env`

Adicionar ao `.gitignore`:

```txt
.env
```

---

## 20. Regras para o Codex

Sempre que for modificar o projeto:

1. Respeitar este arquivo `agent.md`.
2. Não adicionar funcionalidades fora do MVP sem solicitação.
3. Não trocar a stack definida.
4. Não substituir Supabase por localStorage.
5. Não criar backend próprio.
6. Não implementar autenticação até ser solicitado.
7. Não usar TypeScript, a menos que seja solicitado.
8. Manter JavaScript.
9. Manter React com Vite.
10. Manter Tailwind CSS.
11. Preservar a estrutura de pastas definida.
12. Priorizar código simples, limpo e fácil de entender.
13. Criar componentes reutilizáveis quando necessário.
14. Evitar soluções complexas demais para o escopo.
15. Sempre tratar loading, erro e estado vazio.
16. Sempre usar Supabase services para acesso ao banco.
17. Sempre usar React Hook Form + Zod nos formulários.
18. Sempre manter visual moderno e profissional.
19. Não criar dados mockados como fonte principal.
20. Garantir que o projeto rode com:

```bash
npm install
npm run dev
```

---

## 21. Critérios de conclusão

Uma implementação está concluída quando:

- O projeto inicia com `npm run dev`
- As rotas funcionam
- O Supabase está configurado
- Clientes podem ser cadastrados, listados, editados e excluídos
- Carros podem ser cadastrados, listados, editados e excluídos
- Pagamentos podem ser cadastrados, listados, marcados como pagos e excluídos
- Dashboard mostra dados reais do Supabase
- Todas as telas possuem loading
- Todas as telas possuem tratamento de erro
- Todas as tabelas possuem estado vazio
- O layout está responsivo
- Não há uso de localStorage
- Não há backend próprio
- Não há autenticação ainda

---

## 22. Próximas evoluções futuras

Não implementar agora, mas deixar como possíveis melhorias futuras:

- Login com Supabase Auth
- Vincular registros ao usuário logado
- Row Level Security por usuário
- Controle de contratos
- Controle de locações
- Controle de manutenções
- Relatórios mensais
- Exportação para PDF
- Notificações de vencimento
- Upload de documentos do cliente
- Deploy na Vercel
