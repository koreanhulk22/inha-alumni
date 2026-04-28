-- ================================================
-- RLS 무한 재귀 수정
-- 관리자 체크를 security definer 함수로 분리
-- ================================================

-- 관리자 여부 확인 함수 (security definer = RLS 우회)
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select coalesce(
    (select is_admin from public.users where id = auth.uid()),
    false
  );
$$;

-- 인증 동문 여부 확인 함수
create or replace function public.is_verified_alumni()
returns boolean
language sql
security definer
stable
as $$
  select coalesce(
    (select is_alumni_verified from public.users where id = auth.uid()),
    false
  );
$$;

-- ================================================
-- 기존 정책 삭제 후 재생성
-- ================================================

-- users 정책 재설정
drop policy if exists "본인 프로필 조회" on public.users;
drop policy if exists "본인 프로필 수정" on public.users;
drop policy if exists "관리자 전체 조회" on public.users;

create policy "본인 프로필 조회" on public.users
  for select using (auth.uid() = id);

create policy "본인 프로필 수정" on public.users
  for update using (auth.uid() = id);

create policy "관리자 전체 조회" on public.users
  for all using (public.is_admin());

-- posts 정책 재설정
drop policy if exists "게시글 전체 공개 조회" on public.posts;
drop policy if exists "인증 동문 게시글 작성" on public.posts;
drop policy if exists "본인 게시글 수정" on public.posts;
drop policy if exists "관리자 게시글 전체 관리" on public.posts;

create policy "게시글 전체 공개 조회" on public.posts
  for select using (true);

create policy "인증 동문 게시글 작성" on public.posts
  for insert with check (auth.uid() is not null and public.is_verified_alumni());

create policy "본인 게시글 수정" on public.posts
  for update using (author_id = auth.uid());

create policy "관리자 게시글 전체 관리" on public.posts
  for all using (public.is_admin());

-- alumni_businesses 정책 재설정
drop policy if exists "승인된 업소 공개 조회" on public.alumni_businesses;
drop policy if exists "인증 동문 업소 등록" on public.alumni_businesses;
drop policy if exists "관리자 업소 전체 관리" on public.alumni_businesses;

create policy "승인된 업소 공개 조회" on public.alumni_businesses
  for select using (is_approved = true);

create policy "인증 동문 업소 등록" on public.alumni_businesses
  for insert with check (auth.uid() is not null and public.is_verified_alumni());

create policy "관리자 업소 전체 관리" on public.alumni_businesses
  for all using (public.is_admin());

-- banners 정책 재설정
drop policy if exists "배너 공개 조회" on public.banners;
drop policy if exists "관리자 배너 전체 관리" on public.banners;

create policy "배너 공개 조회" on public.banners
  for select using (is_active = true);

create policy "관리자 배너 전체 관리" on public.banners
  for all using (public.is_admin());

-- condolence_events 정책 재설정
drop policy if exists "경조사 공개 조회" on public.condolence_events;
drop policy if exists "인증 동문 경조사 등록" on public.condolence_events;

create policy "경조사 공개 조회" on public.condolence_events
  for select using (true);

create policy "인증 동문 경조사 등록" on public.condolence_events
  for insert with check (auth.uid() is not null and public.is_verified_alumni());
