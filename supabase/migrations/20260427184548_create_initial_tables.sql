create table if not exists public.clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cpf text not null,
  telefone text not null,
  email text not null,
  created_at timestamp with time zone default now()
);

create table if not exists public.carros (
  id uuid primary key default gen_random_uuid(),
  marca text not null,
  modelo text not null,
  ano int not null,
  placa text not null,
  valor_diaria numeric(10,2) not null,
  status text not null check (status in ('Disponível', 'Alugado', 'Manutenção')),
  created_at timestamp with time zone default now()
);

create table if not exists public.pagamentos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  carro_id uuid not null references public.carros(id) on delete cascade,
  valor numeric(10,2) not null,
  data_vencimento date not null,
  status text not null check (status in ('Pago', 'Pendente')),
  forma_pagamento text not null check (forma_pagamento in ('Pix', 'Dinheiro', 'Cartão')),
  created_at timestamp with time zone default now()
);

create index if not exists idx_pagamentos_cliente_id
on public.pagamentos(cliente_id);

create index if not exists idx_pagamentos_carro_id
on public.pagamentos(carro_id);

create index if not exists idx_pagamentos_status
on public.pagamentos(status);

create index if not exists idx_carros_status
on public.carros(status);
