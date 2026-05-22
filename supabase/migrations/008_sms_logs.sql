-- ================================================
-- 문자 발송 내역 테이블
-- ================================================

create table public.sms_logs (
  id uuid default uuid_generate_v4() primary key,
  message text not null,
  sender_no varchar(20) not null default '032-887-2345',
  recipient_type varchar(30) not null, -- 'all' | 'verified' | 'custom'
  recipient_count integer not null default 0,
  status varchar(20) not null default 'pending', -- 'pending' | 'sent' | 'failed'
  error_message text,
  sent_by uuid references public.users(id),
  created_at timestamptz default now() not null
);

create index on public.sms_logs(created_at desc);

alter table public.sms_logs enable row level security;

-- 관리자만 접근 (service role로 처리)
