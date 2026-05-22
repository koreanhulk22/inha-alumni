-- ================================================
-- 동문 인증 신청 테이블
-- ================================================

create type verification_status as enum ('pending', 'approved', 'rejected');

create table public.alumni_verification_requests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name varchar(100) not null,
  department varchar(100) not null,
  entry_year smallint not null,
  graduation_year smallint not null,
  student_id varchar(20),
  phone varchar(20),
  file_url text,                          -- 졸업증명서 파일 URL (Storage)
  status verification_status default 'pending' not null,
  admin_note text,                        -- 관리자 메모 (거절 사유 등)
  reviewed_at timestamptz,
  created_at timestamptz default now() not null
);

-- 인덱스
create index on public.alumni_verification_requests(user_id);
create index on public.alumni_verification_requests(status);
create index on public.alumni_verification_requests(created_at desc);

-- RLS
alter table public.alumni_verification_requests enable row level security;

-- 본인 신청 내역만 조회
create policy "users can view own verification requests"
  on public.alumni_verification_requests for select
  using (auth.uid() = user_id);

-- 본인만 신청 가능
create policy "users can insert own verification requests"
  on public.alumni_verification_requests for insert
  with check (auth.uid() = user_id);

-- 관리자는 전체 조회/수정 가능 (service role로 처리)

-- Storage bucket for verification files (run separately in Supabase dashboard)
-- insert into storage.buckets (id, name, public) values ('verification-files', 'verification-files', false);
