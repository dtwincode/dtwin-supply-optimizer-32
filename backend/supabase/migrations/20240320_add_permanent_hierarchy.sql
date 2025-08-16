
create table if not exists permanent_hierarchy_data (
  id uuid default gen_random_uuid() primary key,
  hierarchy_type text not null,
  data jsonb not null,
  is_active boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add indexes for better query performance
create index if not exists idx_hierarchy_type on permanent_hierarchy_data(hierarchy_type);
create index if not exists idx_is_active on permanent_hierarchy_data(is_active);

-- Add a trigger to update the updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

create trigger update_permanent_hierarchy_data_updated_at
    before update on permanent_hierarchy_data
    for each row
    execute procedure update_updated_at_column();
