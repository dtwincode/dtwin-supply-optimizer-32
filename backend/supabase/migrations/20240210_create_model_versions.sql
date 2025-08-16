
create table if not exists public.model_versions (
  id uuid default gen_random_uuid() primary key,
  model_name text not null,
  version text not null,
  parameters jsonb default '{}'::jsonb,
  accuracy_metrics jsonb default '{}'::jsonb,
  metadata jsonb default '{}'::jsonb,
  validation_metrics jsonb default '{}'::jsonb,
  training_data_snapshot jsonb default '{}'::jsonb,
  is_active boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table public.model_versions enable row level security;

create policy "Enable read access for all users"
  on public.model_versions for select
  using (true);

create policy "Enable insert for authenticated users only"
  on public.model_versions for insert
  to authenticated
  with check (true);

create policy "Enable update for authenticated users only"
  on public.model_versions for update
  to authenticated
  using (true);

create policy "Enable delete for authenticated users only"
  on public.model_versions for delete
  to authenticated
  using (true);

-- Add updated_at trigger
create trigger handle_updated_at
  before update on public.model_versions
  for each row
  execute function handle_updated_at();
