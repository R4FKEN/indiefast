-- Newsletter subscribers for indiefa.st
-- Apply in Supabase SQL Editor or via supabase db push.

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  subscribed_at timestamptz not null default now(),
  constraint subscribers_email_unique unique (email)
);

comment on table public.subscribers is 'Homepage newsletter signups (server-only inserts via service role)';

alter table public.subscribers enable row level security;

-- No public policies: only the service role (backend) can read/write.
-- Do not use the anon key from the browser for inserts.
