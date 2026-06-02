-- ================================================
-- 행사 달력 / 유튜브 영상 / 회원 승인 기능
-- ================================================

-- 1. 회원 승인 컬럼 추가
alter table public.users
  add column if not exists is_approved boolean default false not null;

-- 기존 관리자 계정은 자동 승인
update public.users set is_approved = true where is_admin = true;

-- 2. 행사 달력 테이블
create table if not exists public.calendar_events (
  id uuid default uuid_generate_v4() primary key,
  title varchar(200) not null,
  description text,
  start_date date not null,
  end_date date,
  location varchar(300),
  category varchar(50) default '행사',
  color varchar(20) default '#003876',
  is_active boolean default true not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.calendar_events enable row level security;
create policy "public read calendar" on public.calendar_events
  for select using (is_active = true);
create policy "admin all calendar" on public.calendar_events
  for all using (
    exists (select 1 from public.users where id = auth.uid() and is_admin = true)
  );

create index if not exists idx_calendar_start on public.calendar_events(start_date desc);

-- 3. 유튜브 영상 테이블
create table if not exists public.videos (
  id uuid default uuid_generate_v4() primary key,
  title varchar(200) not null,
  description text,
  youtube_id varchar(20) not null,
  thumbnail_url text,
  is_active boolean default true not null,
  sort_order integer default 0,
  published_at date,
  created_at timestamptz default now() not null
);

alter table public.videos enable row level security;
create policy "public read videos" on public.videos
  for select using (is_active = true);
create policy "admin all videos" on public.videos
  for all using (
    exists (select 1 from public.users where id = auth.uid() and is_admin = true)
  );

create index if not exists idx_videos_sort on public.videos(sort_order, created_at desc);

-- 4. site_settings에 달력 토글 추가
insert into public.site_settings (key, value, label) values
  ('calendar_enabled', 'true', '행사 달력 기능 활성화')
on conflict (key) do nothing;

-- 5. 샘플 달력 행사 데이터
insert into public.calendar_events (title, description, start_date, end_date, location, category, color) values
  ('2026 총동창회장배 골프대회 재경기', '우천 취소에 따른 재경기 — 40팀 160명 참가', '2026-08-28', '2026-08-28', 'H1 CLUB (경기도 이천시 호법면 장자터로 115)', '골프', '#1A6B4A'),
  ('2026 인하 가족의 밤', '연말 총동창회 행사', '2026-12-05', '2026-12-05', '인천 송도컨벤시아', '총동창회', '#003876'),
  ('인하창학역사 하와이탐방', '창학 역사 탐방 및 동문 네트워킹', '2026-10-31', '2026-11-05', '하와이', '특별행사', '#C8A951'),
  ('하와이-인하공원 개관식', '하와이 인하공원 개관 기념식', '2026-10-15', '2026-10-15', '하와이', '특별행사', '#C8A951')
on conflict do nothing;
