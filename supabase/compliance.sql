-- ========== TABLES CONFORMITÉ RGPD + CNIL ==========
-- À exécuter dans Supabase SQL Editor après schema.sql

-- JOURNAL DES CONSENTEMENTS COOKIES (preuve juridique CNIL)
create table if not exists cookie_consents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete set null,
  session_id text,
  consent text not null check (consent in ('accept', 'refuse', 'partial')),
  ip_hash text,
  user_agent text,
  created_at timestamptz default now()
);

-- DEMANDES RGPD (export, suppression, rectification)
create table if not exists rgpd_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  type text not null check (type in ('export', 'deletion', 'rectification')),
  status text default 'pending' check (status in ('pending', 'completed', 'rejected')),
  notes text,
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- RLS
alter table cookie_consents enable row level security;
alter table rgpd_requests enable row level security;

-- Tout le monde peut insérer un consentement (y compris anonymes)
create policy "Anyone can insert consent" on cookie_consents for insert with check (true);

-- Les users voient et gèrent leurs propres demandes RGPD
create policy "Users see own rgpd requests" on rgpd_requests for all using (auth.uid() = user_id);
create policy "Users insert own rgpd requests" on rgpd_requests for insert with check (auth.uid() = user_id);
