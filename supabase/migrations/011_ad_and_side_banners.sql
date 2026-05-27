-- ad_slides: 총동창회 슬라이드 광고 (partner company slider)
CREATE TABLE IF NOT EXISTS ad_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  label TEXT DEFAULT '총동창회 업무 제휴 협력 기업',
  image_url TEXT,
  link_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ad_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ad_slides_public_read" ON ad_slides FOR SELECT USING (is_active = true);
CREATE POLICY "ad_slides_admin_all" ON ad_slides
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true));

-- side_banners: left/right side ad banners
CREATE TABLE IF NOT EXISTS side_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT,
  link_url TEXT,
  alt_text TEXT DEFAULT 'AD',
  position TEXT NOT NULL DEFAULT 'left',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE side_banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "side_banners_public_read" ON side_banners FOR SELECT USING (is_active = true);
CREATE POLICY "side_banners_admin_all" ON side_banners
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true));

-- Insert 3 default hero banners (only if table is empty)
INSERT INTO banners (title, subtitle, image_url, link_url, sort_order, is_active)
SELECT * FROM (VALUES
  ('인하대학교 총동창회', '친목공영 | 모교후원 | 후진육영', '/images/hero-1.png', '/about/greeting', 0, true),
  ('인하인의 자랑스러운 모교', '개교 71주년, 함께 만들어가는 인하의 미래', '/images/hero-2.jpg', '/about/greeting', 1, true),
  ('인하대학교 캠퍼스', '동문 여러분의 자랑스러운 모교', '/images/hero-3.jpg', '/about/greeting', 2, true)
) AS v(title, subtitle, image_url, link_url, sort_order, is_active)
WHERE NOT EXISTS (SELECT 1 FROM banners LIMIT 1);
