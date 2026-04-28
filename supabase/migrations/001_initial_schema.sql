-- ================================================
-- 인하대학교 총동창회 초기 스키마 마이그레이션
-- ================================================

-- UUID 확장
create extension if not exists "uuid-ossp";

-- ================================================
-- ENUM 타입 정의
-- ================================================

create type post_type as enum (
  '총동창회소식',
  '단위동문회소식',
  '모교소식',
  '동문동정',
  '공지사항',
  '자유게시판',
  '경조사알림',
  '구인구직'
);

create type fund_type as enum (
  '회비발전기금',
  '장학기금',
  '건립기금'
);

create type business_category as enum (
  '요식업',
  '의료',
  '사무소',
  '교육',
  '서비스',
  '기타'
);

create type payment_status as enum (
  'pending',
  'completed',
  'failed',
  'cancelled'
);

create type pledge_cycle as enum (
  'monthly',
  'quarterly',
  'yearly'
);

-- ================================================
-- users 테이블 (auth.users 확장)
-- ================================================

create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  name varchar(100) not null,
  student_id varchar(20),           -- 학번
  department varchar(100),          -- 학과
  graduation_year smallint,         -- 졸업연도
  phone varchar(20),
  is_alumni_verified boolean default false,
  is_admin boolean default false,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ================================================
-- posts 테이블 (통합 게시판)
-- ================================================

create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  type post_type not null,
  title varchar(500) not null,
  content text not null,
  summary varchar(500),
  author_id uuid references public.users(id) on delete set null,
  views integer default 0,
  is_pinned boolean default false,
  is_popup boolean default false,
  attachments text[],               -- 첨부파일 URL 배열
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_posts_type on public.posts(type);
create index idx_posts_created_at on public.posts(created_at desc);
create index idx_posts_is_pinned on public.posts(is_pinned) where is_pinned = true;

-- ================================================
-- alumni_businesses 테이블 (인하플레이스)
-- ================================================

create table public.alumni_businesses (
  id uuid default uuid_generate_v4() primary key,
  name varchar(200) not null,
  category business_category not null,
  address varchar(500) not null,
  lat double precision,
  lng double precision,
  phone varchar(30),
  description text,
  benefit text,                     -- 동문 우대 혜택
  owner_id uuid references public.users(id) on delete set null,
  is_approved boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_businesses_category on public.alumni_businesses(category);
create index idx_businesses_approved on public.alumni_businesses(is_approved) where is_approved = true;

-- ================================================
-- donations 테이블 (기부/결제)
-- ================================================

create table public.donations (
  id uuid default uuid_generate_v4() primary key,
  fund_type fund_type not null,
  amount integer not null,          -- 원 단위
  donor_name varchar(100) not null,
  user_id uuid references public.users(id) on delete set null,
  is_anonymous boolean default false,
  payment_key varchar(200),         -- Toss Payments key
  payment_status payment_status default 'pending',
  message text,                     -- 응원 메시지
  created_at timestamptz default now()
);

create index idx_donations_fund_type on public.donations(fund_type);
create index idx_donations_user_id on public.donations(user_id);

-- ================================================
-- pledges 테이블 (약정/정기결제)
-- ================================================

create table public.pledges (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  fund_type fund_type not null,
  amount integer not null,
  cycle pledge_cycle not null,
  billing_key varchar(200),         -- Toss 자동결제 키
  is_active boolean default true,
  next_payment_date date,
  created_at timestamptz default now(),
  cancelled_at timestamptz
);

-- ================================================
-- condolence_events 테이블 (경조사 알림)
-- ================================================

create table public.condolence_events (
  id uuid default uuid_generate_v4() primary key,
  type varchar(20) not null check (type in ('경사', '부고')),
  content text not null,
  author_id uuid references public.users(id) on delete set null,
  created_at timestamptz default now()
);

-- ================================================
-- banners 테이블 (히어로 배너 CMS)
-- ================================================

create table public.banners (
  id uuid default uuid_generate_v4() primary key,
  title varchar(200),
  image_url varchar(1000) not null,
  link_url varchar(1000),
  sort_order smallint default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ================================================
-- alumni_network 테이블 (동문 네트워크/단위동문회)
-- ================================================

create table public.alumni_network (
  id uuid default uuid_generate_v4() primary key,
  name varchar(200) not null,       -- 동문회명 (예: 기계과 동문회)
  department varchar(100),
  president_name varchar(100),
  contact_email varchar(200),
  contact_phone varchar(30),
  description text,
  website_url varchar(500),
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ================================================
-- scholarship_fund 테이블 (장학회 기금 현황)
-- ================================================

create table public.scholarship_fund (
  id uuid default uuid_generate_v4() primary key,
  name varchar(200) not null,       -- 장학금명
  fund_type varchar(50) not null check (fund_type in ('지정위탁', '단체', '개인')),
  description text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ================================================
-- access_logs 테이블 (접근 로그 - 90일 보관)
-- ================================================

create table public.access_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete set null,
  action varchar(100) not null,
  resource varchar(200),
  ip_address inet,
  user_agent text,
  created_at timestamptz default now()
);

create index idx_access_logs_created_at on public.access_logs(created_at desc);
create index idx_access_logs_user_id on public.access_logs(user_id);

-- 90일 지난 로그 자동 삭제 (pg_cron 필요 시 별도 설정)

-- ================================================
-- message_logs 테이블 (SMS/이메일 발송 로그)
-- ================================================

create table public.message_logs (
  id uuid default uuid_generate_v4() primary key,
  type varchar(10) not null check (type in ('sms', 'email')),
  recipient varchar(200) not null,
  subject varchar(500),
  content text,
  status varchar(20) default 'sent',
  created_at timestamptz default now()
);

-- ================================================
-- updated_at 자동 갱신 트리거
-- ================================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at
  before update on public.users
  for each row execute function update_updated_at();

create trigger posts_updated_at
  before update on public.posts
  for each row execute function update_updated_at();

create trigger businesses_updated_at
  before update on public.alumni_businesses
  for each row execute function update_updated_at();

-- ================================================
-- RLS (Row Level Security) 설정
-- ================================================

alter table public.users enable row level security;
alter table public.posts enable row level security;
alter table public.alumni_businesses enable row level security;
alter table public.donations enable row level security;
alter table public.pledges enable row level security;
alter table public.condolence_events enable row level security;
alter table public.banners enable row level security;
alter table public.alumni_network enable row level security;
alter table public.scholarship_fund enable row level security;
alter table public.access_logs enable row level security;
alter table public.message_logs enable row level security;

-- users 정책
create policy "본인 프로필 조회" on public.users
  for select using (auth.uid() = id);

create policy "본인 프로필 수정" on public.users
  for update using (auth.uid() = id);

create policy "관리자 전체 조회" on public.users
  for all using (
    exists (select 1 from public.users where id = auth.uid() and is_admin = true)
  );

-- posts 정책 (게시판)
create policy "게시글 전체 공개 조회" on public.posts
  for select using (true);

create policy "인증 동문 게시글 작성" on public.posts
  for insert with check (
    auth.uid() is not null and
    exists (select 1 from public.users where id = auth.uid() and is_alumni_verified = true)
  );

create policy "본인 게시글 수정" on public.posts
  for update using (author_id = auth.uid());

create policy "관리자 게시글 전체 관리" on public.posts
  for all using (
    exists (select 1 from public.users where id = auth.uid() and is_admin = true)
  );

-- alumni_businesses 정책
create policy "승인된 업소 공개 조회" on public.alumni_businesses
  for select using (is_approved = true);

create policy "인증 동문 업소 등록" on public.alumni_businesses
  for insert with check (
    auth.uid() is not null and
    exists (select 1 from public.users where id = auth.uid() and is_alumni_verified = true)
  );

create policy "관리자 업소 전체 관리" on public.alumni_businesses
  for all using (
    exists (select 1 from public.users where id = auth.uid() and is_admin = true)
  );

-- donations 정책
create policy "기부 내역 공개 조회 (익명 처리)" on public.donations
  for select using (true);

create policy "기부 등록 (비회원 포함)" on public.donations
  for insert with check (true);

create policy "관리자 기부 전체 관리" on public.donations
  for all using (
    exists (select 1 from public.users where id = auth.uid() and is_admin = true)
  );

-- banners 정책
create policy "배너 공개 조회" on public.banners
  for select using (is_active = true);

create policy "관리자 배너 전체 관리" on public.banners
  for all using (
    exists (select 1 from public.users where id = auth.uid() and is_admin = true)
  );

-- alumni_network, scholarship_fund 공개 조회
create policy "동문네트워크 공개 조회" on public.alumni_network
  for select using (true);

create policy "장학기금 공개 조회" on public.scholarship_fund
  for select using (true);

-- condolence_events 정책
create policy "경조사 공개 조회" on public.condolence_events
  for select using (true);

create policy "인증 동문 경조사 등록" on public.condolence_events
  for insert with check (
    auth.uid() is not null and
    exists (select 1 from public.users where id = auth.uid() and is_alumni_verified = true)
  );

-- access_logs: 본인 로그만 조회, 삽입은 서버에서만 (service role)
create policy "본인 접근 로그 조회" on public.access_logs
  for select using (user_id = auth.uid());

-- ================================================
-- 초기 데이터 시딩 (뉴스)
-- ================================================

-- 관리자 게시글은 auth.users 없이 직접 삽입 (service role 사용)
-- 아래는 참고용 — 실제 시딩은 seed.sql에서 진행

