create table if not exists payment_records (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) on delete cascade,
  stripe_payment_intent_id text,
  stripe_checkout_session_id text,
  amount numeric(12,2) not null default 0,
  currency text default 'usd',
  status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists payout_records (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  property_id uuid references properties(id) on delete cascade,
  statement_id uuid references owner_statements(id) on delete set null,
  amount numeric(12,2) not null default 0,
  payout_method text,
  payout_status text default 'pending',
  paid_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists notification_logs (
  id uuid primary key default gen_random_uuid(),
  recipient_type text,
  recipient_value text,
  channel text not null,
  template_name text,
  payload jsonb,
  status text default 'queued',
  created_at timestamptz default now()
);

create table if not exists calendar_sync_logs (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  channel_name text not null default 'airbnb',
  sync_status text default 'pending',
  synced_at timestamptz,
  external_reference text,
  notes text,
  created_at timestamptz default now()
);
