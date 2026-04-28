-- PROFILS users
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  first_name text,
  last_name text,
  email text unique,
  plan text default 'free' check (plan in ('free', 'starter', 'builder', 'empire')),
  credits integer default 0,
  created_at timestamptz default now()
);

-- PLANS générés
create table if not exists plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  name text not null,
  idea text,
  sector text,
  city text,
  budget text,
  profile_level text,
  availability text,
  score integer,
  sections jsonb,
  created_at timestamptz default now()
);

-- CONVERSATIONS chat
create table if not exists chat_conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  plan_id uuid references plans on delete cascade,
  messages jsonb default '[]'::jsonb,
  updated_at timestamptz default now()
);

-- ACHATS
create table if not exists purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  pack text not null,
  amount_cents integer,
  credits_added integer,
  status text default 'pending',
  stripe_session_id text,
  created_at timestamptz default now()
);

-- RLS
alter table profiles enable row level security;
alter table plans enable row level security;
alter table chat_conversations enable row level security;
alter table purchases enable row level security;

create policy "Users see own profile" on profiles for select using (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);
create policy "Users see own plans" on plans for all using (auth.uid() = user_id);
create policy "Users see own chats" on chat_conversations for all using (auth.uid() = user_id);
create policy "Users see own purchases" on purchases for select using (auth.uid() = user_id);

-- Trigger profil auto à l'inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'first_name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
