-- 자유게시판 관리자 승인 시스템
-- posts 테이블에 is_board_approved 컬럼 추가
alter table public.posts add column if not exists is_board_approved boolean default true;

-- 기존 게시글은 모두 승인 상태로 유지
update public.posts set is_board_approved = true where is_board_approved is null;

-- 자유게시판 글 작성 시 기본값: 승인 대기 (false)
-- application layer에서 type='자유게시판'인 경우 is_board_approved=false로 INSERT
-- 관리자 글은 is_board_approved=true로 INSERT

-- index 추가
create index if not exists idx_posts_board_approved on public.posts(is_board_approved) where type = '자유게시판';
