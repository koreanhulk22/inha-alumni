-- ================================================
-- 갤러리 / 동창회보 / 사이트 설정 테이블
-- ================================================

-- 갤러리
create table public.gallery_items (
  id uuid default uuid_generate_v4() primary key,
  title varchar(200) not null,
  image_url text not null,
  taken_at date,
  sort_order integer default 0,
  created_at timestamptz default now() not null
);
alter table public.gallery_items enable row level security;
create policy "public read gallery" on public.gallery_items for select using (true);
create index on public.gallery_items(sort_order, created_at desc);

-- 동창회보
create table public.newsletters (
  id uuid default uuid_generate_v4() primary key,
  title varchar(200) not null,
  issue_number integer,
  year integer,
  month integer,
  pdf_url text,
  cover_image_url text,
  created_at timestamptz default now() not null
);
alter table public.newsletters enable row level security;
create policy "public read newsletters" on public.newsletters for select using (true);
create index on public.newsletters(year desc, month desc);

-- 사이트 설정 (key-value)
create table public.site_settings (
  key varchar(100) primary key,
  value text,
  label varchar(200),
  updated_at timestamptz default now() not null
);
alter table public.site_settings enable row level security;

-- 기본값 삽입
insert into public.site_settings (key, value, label) values
  ('sms_sender_no',          '032-887-2345',                    '문자 발신번호'),
  ('sms_nhn_app_key',        '',                                 'NHN Cloud AppKey'),
  ('sms_nhn_secret_key',     '',                                 'NHN Cloud SecretKey'),
  ('bank_membership',        '우리은행 256-454416-13-001',       '회비발전기금 계좌'),
  ('bank_scholarship',       '하나은행 748-910003-42904',        '장학기금 계좌'),
  ('bank_construction',      '',                                  '건립기금 계좌'),
  ('office_phone',           '032-887-2345',                    '사무국 전화'),
  ('office_fax',             '032-887-2211',                    '사무국 팩스'),
  ('office_email',           'inha@inhain.com',                  '사무국 이메일'),
  ('office_address',         '(22188) 인천광역시 미추홀구 독배로 311, 비젼프라자 901호', '사무국 주소');

-- Storage buckets (Supabase 대시보드에서 직접 생성 필요)
-- gallery-images  (public: true)
-- newsletter-pdfs (public: true)
