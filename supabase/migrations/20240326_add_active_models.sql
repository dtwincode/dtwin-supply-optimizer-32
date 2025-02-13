
create table if not exists public.active_models (
  id uuid default uuid_generate_v4() primary key,
  model_id text not null,
  model_name text not null,
  is_running boolean default true,
  last_run timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  product_filters jsonb default '{}'::jsonb,
  model_parameters jsonb default '{}'::jsonb
);

-- Enable row level security
alter table public.active_models enable row level security;

-- Create policies
create policy "Enable all access for authenticated users"
  on public.active_models
  for all
  to authenticated
  using (true)
  with check (true);

-- Add updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_active_models_updated_at
  before update on public.active_models
  for each row
  execute function public.handle_updated_at();

-- Enable realtime
alter publication supabase_realtime add table public.active_models;
alter table public.active_models replica identity full;
