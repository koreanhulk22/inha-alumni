-- banners 테이블: subtitle 추가, image_url NOT NULL 제거 (URL 없이도 등록 가능하도록)
alter table public.banners add column if not exists subtitle varchar(500);
alter table public.banners alter column image_url drop not null;

-- posts 테이블: 썸네일 이미지 URL 추가
alter table public.posts add column if not exists image_url varchar(1000);

-- post_type enum에 인터뷰/칼럼 추가
alter type post_type add value if not exists '인터뷰/칼럼';

-- condolence_events 테이블: 이름/날짜 컬럼 추가 (기존 content는 유지)
alter table public.condolence_events add column if not exists name varchar(200);
alter table public.condolence_events add column if not exists event_date date;

-- condolence_events 관리자 관리 정책
create policy if not exists "관리자 경조사 전체 관리" on public.condolence_events
  for all using (
    exists (select 1 from public.users where id = auth.uid() and is_admin = true)
  );

-- posts 테이블: 작성자 이름 컬럼 추가 (author_id 외에 비회원 작성자 이름 표시용)
alter table public.posts add column if not exists author_name varchar(100);

-- alumni_businesses 테이블: 업소 대표자명 컬럼 추가
alter table public.alumni_businesses add column if not exists owner_name varchar(100);
