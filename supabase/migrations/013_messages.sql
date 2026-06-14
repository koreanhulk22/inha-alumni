-- ================================================
-- 관리자 메일함 (messages)
-- ================================================

create table if not exists public.messages (
  id           uuid default uuid_generate_v4() primary key,
  from_user_id uuid references public.users(id) on delete set null,
  to_user_id   uuid references public.users(id) on delete set null,  -- null = 전체 발송
  subject      varchar(200) not null,
  body         text not null,
  is_read      boolean default false not null,
  is_from_admin boolean default false not null,
  parent_id    uuid references public.messages(id) on delete set null,
  created_at   timestamptz default now() not null
);

alter table public.messages enable row level security;

-- 관리자: 전체 접근
create policy "admin full access messages" on public.messages
  for all using (
    exists (select 1 from public.users where id = auth.uid() and is_admin = true)
  );

-- 일반 회원: 자신이 보낸/받은 메시지만
create policy "member read own messages" on public.messages
  for select using (
    auth.uid() = from_user_id or auth.uid() = to_user_id or to_user_id is null
  );

create policy "member insert own messages" on public.messages
  for insert with check (
    auth.uid() = from_user_id and is_from_admin = false
  );

create index if not exists idx_messages_to on public.messages(to_user_id, created_at desc);
create index if not exists idx_messages_from on public.messages(from_user_id, created_at desc);
create index if not exists idx_messages_created on public.messages(created_at desc);
