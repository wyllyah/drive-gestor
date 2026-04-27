alter table public.clientes
add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table public.carros
add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table public.pagamentos
add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table public.clientes enable row level security;
alter table public.carros enable row level security;
alter table public.pagamentos enable row level security;

create policy "Usuários podem ver seus próprios clientes"
on public.clientes
for select
using (auth.uid() = user_id);

create policy "Usuários podem criar seus próprios clientes"
on public.clientes
for insert
with check (auth.uid() = user_id);

create policy "Usuários podem atualizar seus próprios clientes"
on public.clientes
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Usuários podem excluir seus próprios clientes"
on public.clientes
for delete
using (auth.uid() = user_id);

create policy "Usuários podem ver seus próprios carros"
on public.carros
for select
using (auth.uid() = user_id);

create policy "Usuários podem criar seus próprios carros"
on public.carros
for insert
with check (auth.uid() = user_id);

create policy "Usuários podem atualizar seus próprios carros"
on public.carros
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Usuários podem excluir seus próprios carros"
on public.carros
for delete
using (auth.uid() = user_id);

create policy "Usuários podem ver seus próprios pagamentos"
on public.pagamentos
for select
using (auth.uid() = user_id);

create policy "Usuários podem criar seus próprios pagamentos"
on public.pagamentos
for insert
with check (auth.uid() = user_id);

create policy "Usuários podem atualizar seus próprios pagamentos"
on public.pagamentos
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Usuários podem excluir seus próprios pagamentos"
on public.pagamentos
for delete
using (auth.uid() = user_id);

notify pgrst, 'reload schema';
