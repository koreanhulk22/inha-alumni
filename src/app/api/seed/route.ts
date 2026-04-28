import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const SEED_TOKEN = "inha2026seed";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("token") !== SEED_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  // 기존 데이터 초기화
  await supabase.from("condolence_events").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("banners").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("posts").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const errors: string[] = [];

  // ── 배너 ──────────────────────────────────
  const { error: e1 } = await supabase.from("banners").insert([
    { title: "인하대학교 총동창회", subtitle: "친목공영 | 모교후원 | 후진육영", image_url: "/images/hero-1.png", link_url: "/about/greeting", sort_order: 1, is_active: true },
    { title: "인하인의 자랑스러운 모교", subtitle: "개교 71주년, 함께 만들어가는 인하의 미래", image_url: "/images/hero-2.jpg", link_url: "/news/events", sort_order: 2, is_active: true },
    { title: "인하대학교 캠퍼스", subtitle: "동문 여러분의 자랑스러운 모교", image_url: "/images/hero-3.jpg", link_url: "/about/greeting", sort_order: 3, is_active: true },
  ]);
  if (e1) errors.push("banners: " + e1.message);

  // ── 공지사항 ──────────────────────────────
  const { error: e2 } = await supabase.from("posts").insert([
    { type: "공지사항", title: "제33대 김종우 총동창회장 취임 인사", summary: "2026년 1월 27일 취임한 제33대 김종우 총동창회장의 취임 인사말씀입니다.", content: "안녕하십니까, 인하대학교 총동창회 제33대 회장 김종우입니다.\n\n동문 여러분의 변함없는 성원과 협조를 부탁드립니다.\n\n제33대 인하대학교 총동창회장 김종우 (전자공학과 84학번)", is_pinned: true, is_board_approved: true, created_at: "2026-01-27T10:00:00+09:00" },
    { type: "공지사항", title: "2026년도 총동창회 회비 납부 안내", summary: "동문 여러분의 회비는 총동창회 운영과 장학사업의 소중한 재원이 됩니다.", content: "■ 연회비: 50,000원\n■ 종신회비: 500,000원\n■ 납부계좌: 우리은행 256-454416-13-001 (예금주: 인하대학교 총동창회)\n\n문의: 사무국 032-887-2345", is_pinned: true, is_board_approved: true, created_at: "2026-01-15T09:00:00+09:00" },
    { type: "공지사항", title: "2026년도 총동창회 정기총회 개최 안내", summary: "제33대 김종우 총동창회장 취임 후 첫 정기총회를 개최합니다.", content: "■ 일시: 2026년 3월 중 (추후 공지)\n■ 장소: 인하대학교 60주년 기념관\n■ 안건: 2025년 결산 보고, 2026년 사업계획 및 예산안 심의\n\n참석 문의: 사무국 032-887-2345", is_pinned: true, is_board_approved: true, created_at: "2026-02-10T09:00:00+09:00" },
    { type: "공지사항", title: "인하대학교 총동창회 홈페이지 개편 안내", summary: "더욱 편리하고 풍성한 동문 서비스를 위해 홈페이지를 새롭게 단장하였습니다.", content: "■ 주요 변경사항\n- 모바일 최적화 디자인 적용\n- 인하상회 동문 전용 쇼핑몰 연동\n- 인하플레이스 동문 업소 지도 서비스 추가\n\n문의: 032-887-2345 / inha@inhain.com", is_pinned: false, is_board_approved: true, created_at: "2026-01-05T09:00:00+09:00" },
    { type: "공지사항", title: "2026 인하가족의 밤 준비위원 모집", summary: "매년 12월 개최되는 인하 가족의 밤 행사 준비위원을 모집합니다.", content: "■ 모집 인원: 20명\n■ 활동 기간: 2026년 6월 ~ 12월\n■ 신청: inha@inhain.com", is_pinned: false, is_board_approved: true, created_at: "2025-12-20T09:00:00+09:00" },
  ]);
  if (e2) errors.push("notices: " + e2.message);

  // ── 총동창회소식 ──────────────────────────
  const { error: e3 } = await supabase.from("posts").insert([
    { type: "총동창회소식", title: "제33대 김종우 총동창회장 취임식 성황리에 개최", summary: "2026년 1월 27일 인천 라마다송도호텔에서 제33대 김종우(전자84) 총동창회장 취임식이 성황리에 개최됐다.", content: "인하대학교 총동창회 제33대 회장 취임식이 2026년 1월 27일 인천 라마다송도호텔 그랜드볼룸에서 개최되었습니다.\n\n300여 명이 참석하여 새 집행부 출범을 축하했습니다.", is_board_approved: true, created_at: "2026-01-28T10:00:00+09:00" },
    { type: "총동창회소식", title: "2025 인하가족의 밤 성황 개최 — 500여 동문 한자리에", summary: "2025년 12월 4일 인천 송도컨벤시아에서 인하 가족의 밤 행사가 성황리에 개최됐다.", content: "인하대학교 총동창회 주최 2025 인하 가족의 밤 행사가 2025년 12월 4일 인천 송도컨벤시아에서 열렸습니다.\n\n500여 명이 참석하여 자랑스러운 인하인상, 인하비룡대상, 인하참스승상 시상식이 진행됐습니다.", is_board_approved: true, created_at: "2025-12-05T10:00:00+09:00" },
    { type: "총동창회소식", title: "2025 총동창회장배 골프대회 — 서승진(전자83) 우승", summary: "경기도 덕평 H1클럽에서 40팀 160명이 참가한 가운데 총동창회장배 골프대회가 개최됐다.", content: "2025 인하대학교 총동창회장배 골프대회가 2025년 5월 26일 경기도 덕평 H1클럽에서 개최되었습니다.\n\n서승진(전자83) 동문이 우승을 차지했습니다.", is_board_approved: true, created_at: "2025-05-27T10:00:00+09:00" },
    { type: "총동창회소식", title: "비룡제 동문 격려 방문 — 재학생에 장학금 전달", summary: "인하대학교 봄 축제 비룡제에 총동창회장이 재학생들을 격려 방문하였다.", content: "총동창회장과 임원진이 2025년 5월 16일 비룡제 현장을 방문하여 재학생들에게 장학금 및 물품을 전달했습니다.", is_board_approved: true, created_at: "2025-05-17T10:00:00+09:00" },
    { type: "총동창회소식", title: "명예회장단 월례회 — 동문장학회관 건립 추진 논의", summary: "총동창회 명예회장단이 동문장학회관 건립 추진, 수석부회장 선임 등 주요 현안을 논의했다.", content: "인하대학교 총동창회 명예회장단 월례회가 2025년 4월 21일 개최되었습니다.\n\n동문장학회관 건립 추진 계획 및 수석부회장 선임이 논의됐습니다.", is_board_approved: true, created_at: "2025-04-22T10:00:00+09:00" },
  ]);
  if (e3) errors.push("mainNews: " + e3.message);

  // ── 단위동문회소식 ────────────────────────
  const { error: e4 } = await supabase.from("posts").insert([
    { type: "단위동문회소식", title: "인맥회(기계과) 회장 이취임식 성황", summary: "기계공학과 동문회 인맥회가 세현CC에서 박성구(81) 신임 회장 취임식을 가졌다.", content: "인하대학교 기계공학과 동문회 인맥회의 회장 이취임식이 2025년 3월 7일 세현CC에서 개최되었습니다. 24명의 동문이 참석했습니다.", is_board_approved: true, created_at: "2025-03-08T10:00:00+09:00" },
    { type: "단위동문회소식", title: "ROTC동문회 국립서울현충원 순직 동문 참배", summary: "ROTC동문회가 현충일을 맞아 국립서울현충원을 참배하고 순직 동문 5명의 묘소를 찾았다.", content: "인하대학교 ROTC동문회가 2025년 6월 1일 국립서울현충원을 방문하여 순직 동문 5명의 묘소를 참배했습니다. 78명이 참석했습니다.", is_board_approved: true, created_at: "2025-06-02T10:00:00+09:00" },
    { type: "단위동문회소식", title: "전기공학과 동문회 정기총회 및 장학금 확대 결의", summary: "전기공학과 동문회가 정기총회를 열고 재학생 장학금 확대 지원을 결의했다.", content: "인하대학교 전기공학과 동문회가 2025년 2월 정기총회를 개최하고 재학생 장학금 확대 지원을 결의했습니다.", is_board_approved: true, created_at: "2025-02-15T10:00:00+09:00" },
    { type: "단위동문회소식", title: "화학공학과 인화회 송년 만찬", summary: "화학공학과 동문회 인화회가 인천에서 송년 만찬을 개최했다.", content: "인하대학교 화학공학과 동문회 인화회의 송년 만찬이 2025년 12월 인천에서 50여 명이 참석한 가운데 개최되었습니다.", is_board_approved: true, created_at: "2025-12-18T10:00:00+09:00" },
    { type: "단위동문회소식", title: "경영학과 동문회 골프 친선대회", summary: "경영학과 동문회가 인천 베어즈베스트 청라에서 골프 친선대회를 개최했다.", content: "인하대학교 경영학과 동문회 골프 친선대회가 2025년 9월 인천에서 30팀 120명이 참가한 가운데 개최되었습니다.", is_board_approved: true, created_at: "2025-09-20T10:00:00+09:00" },
  ]);
  if (e4) errors.push("localNews: " + e4.message);

  // ── 동문동정 ──────────────────────────────
  const { error: e5 } = await supabase.from("posts").insert([
    { type: "동문동정", title: "120ROTC산악회 안나푸르나 베이스캠프 트래킹 완료", summary: "ROTC 120기 산악회 동문들이 안나푸르나 베이스캠프(4,130m) 트래킹에 성공했다.", content: "인하대학교 ROTC 120기 산악회 15명이 2025년 10월 안나푸르나 베이스캠프(4,130m) 트래킹을 성공적으로 완료했습니다.", is_board_approved: true, created_at: "2025-10-20T10:00:00+09:00" },
    { type: "동문동정", title: "김기문(화학70) 동문 중소기업중앙회장 연임", summary: "인하대 화학과 70학번 김기문 동문이 중소기업중앙회장에 연임됐다.", content: "인하대학교 화학과 70학번 김기문 동문이 중소기업중앙회장에 연임되어 중소기업 경쟁력 강화에 더욱 힘쓰겠다고 밝혔습니다.", is_board_approved: true, created_at: "2025-08-01T10:00:00+09:00" },
    { type: "동문동정", title: "이상일(도시79) 동문 용인시장 재선", summary: "인하대 도시공학과 79학번 이상일 동문이 용인시장 선거에서 재선에 성공했다.", content: "인하대학교 도시공학과 79학번 이상일 동문이 용인시장에 재선되었습니다.", is_board_approved: true, created_at: "2026-01-10T10:00:00+09:00" },
    { type: "동문동정", title: "총동창회 임원 인천 취약계층 연말 봉사활동", summary: "총동창회 임원진이 인천 내 취약계층 50가구를 방문해 생필품을 전달했다.", content: "인하대학교 총동창회 임원진이 2025년 12월 인천 미추홀구 취약계층 50가구를 방문하여 연말 생필품 꾸러미를 전달했습니다.", is_board_approved: true, created_at: "2025-12-22T10:00:00+09:00" },
  ]);
  if (e5) errors.push("alumniNews: " + e5.message);

  // ── 모교소식 ──────────────────────────────
  const { error: e6 } = await supabase.from("posts").insert([
    { type: "모교소식", title: "인하대, 2025 QS 세계대학평가 국내 9위 기록", summary: "인하대학교가 2025 QS 세계대학평가에서 국내 9위, 세계 521~530위권에 진입했다.", content: "인하대학교가 2025년 QS 세계대학평가에서 국내 9위, 세계 521~530위권을 기록했습니다. 국제화 지표와 연구 역량 부문에서 높은 평가를 받았습니다.", is_board_approved: true, created_at: "2025-06-15T10:00:00+09:00" },
    { type: "모교소식", title: "인하대 생명과학과 설립 50주년 기념행사", summary: "인하대학교 생명과학과가 설립 50주년을 맞아 기념행사를 개최했다.", content: "인하대학교 생명과학과가 설립 50주년을 맞아 2025년 9월 기념행사를 개최했습니다.", is_board_approved: true, created_at: "2025-09-05T10:00:00+09:00" },
    { type: "모교소식", title: "인하대, 산학협력 선도대학(LINC 3.0) 선정", summary: "인하대학교가 교육부 산학협력 선도대학 육성사업에 선정됐다.", content: "인하대학교가 산학협력 선도대학 육성사업(LINC 3.0)에 선정되어 향후 5년간 정부 지원을 받게 됩니다.", is_board_approved: true, created_at: "2025-07-20T10:00:00+09:00" },
    { type: "모교소식", title: "인하대 개교 71주년 기념식 개최", summary: "인하대학교가 개교 71주년을 맞아 기념식을 개최하고 발전 비전을 선포했다.", content: "인하대학교가 2025년 4월 24일 개교 71주년 기념식을 개최했습니다. 교직원, 학생, 동문 등 500여 명이 참석했습니다.", is_board_approved: true, created_at: "2025-04-24T10:00:00+09:00" },
  ]);
  if (e6) errors.push("uniNews: " + e6.message);

  // ── 경조사 ────────────────────────────────
  const { error: e7 } = await supabase.from("condolence_events").insert([
    { name: "김종우 총동창회장", type: "경사", content: "장녀 결혼", event_date: "2026-03-15" },
    { name: "이영호(기계81)", type: "경사", content: "장남 결혼", event_date: "2026-02-22" },
    { name: "박정수(전자79)", type: "부고", content: "부친상", event_date: "2026-01-30" },
    { name: "최한석(화공85)", type: "경사", content: "회갑", event_date: "2026-02-10" },
    { name: "정미경(경영92)", type: "경사", content: "장남 결혼", event_date: "2026-03-08" },
  ]);
  if (e7) errors.push("condolences: " + e7.message);

  if (errors.length > 0) {
    return NextResponse.json({ success: false, errors }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: "시딩 완료! 공지5 + 총동창회소식5 + 단위동문회5 + 동문동정4 + 모교소식4 + 경조사5 + 배너3",
  });
}
