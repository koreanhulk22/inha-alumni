-- 퀵메뉴 배경색 설정 추가
INSERT INTO site_settings (key, value, label)
VALUES ('quickmenu_color', '#003876', '퀵메뉴 배경색')
ON CONFLICT (key) DO NOTHING;
