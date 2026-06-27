-- Phase 1b: core tables for StockMemo platform MVP

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.stocks (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  exchange text not null,
  name text not null,
  sector text,
  industry text,
  country text not null default 'US',
  currency text not null default 'USD',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint stocks_symbol_exchange_key unique (symbol, exchange)
);

create index if not exists stocks_symbol_idx on public.stocks (symbol);
create index if not exists stocks_name_idx on public.stocks (name);

drop trigger if exists stocks_set_updated_at on public.stocks;
create trigger stocks_set_updated_at
before update on public.stocks
for each row
execute function public.set_updated_at();

create table if not exists public.ai_stock_summaries (
  id uuid primary key default gen_random_uuid(),
  stock_id uuid not null references public.stocks (id) on delete cascade,
  summary text not null,
  bull_case text not null,
  bear_case text not null,
  key_risks jsonb not null default '[]'::jsonb,
  what_to_watch jsonb not null default '[]'::jsonb,
  source_snapshot_hash text not null,
  generated_at timestamptz not null default now(),
  model text not null,
  constraint ai_stock_summaries_stock_hash_key unique (stock_id, source_snapshot_hash)
);

create index if not exists ai_stock_summaries_stock_id_idx
  on public.ai_stock_summaries (stock_id);

create index if not exists ai_stock_summaries_generated_at_idx
  on public.ai_stock_summaries (generated_at desc);

alter table public.stocks enable row level security;
alter table public.ai_stock_summaries enable row level security;

-- Server-side API uses the service role key and bypasses RLS.
-- Direct client access stays blocked until auth policies are added.

insert into public.stocks (symbol, exchange, name, sector, industry)
values
  ('AAPL', 'NASDAQ', 'Apple Inc.', 'Technology', 'Consumer Electronics'),
  ('MSFT', 'NASDAQ', 'Microsoft Corporation', 'Technology', 'Software'),
  ('NVDA', 'NASDAQ', 'NVIDIA Corporation', 'Technology', 'Semiconductors'),
  ('GOOGL', 'NASDAQ', 'Alphabet Inc.', 'Communication Services', 'Internet Content & Information'),
  ('AMZN', 'NASDAQ', 'Amazon.com, Inc.', 'Consumer Cyclical', 'Internet Retail')
on conflict (symbol, exchange) do nothing;
