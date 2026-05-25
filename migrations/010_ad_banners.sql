-- 사이드/슬라이드 광고 배너 테이블
CREATE TABLE IF NOT EXISTS public.ad_banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  zone TEXT NOT NULL DEFAULT 'side_right',   -- 'side_left' | 'side_right' | 'slide_right'
  title TEXT,
  image_url TEXT,
  link_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ad_banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active ad_banners"
  ON public.ad_banners FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin full access ad_banners"
  ON public.ad_banners FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );
