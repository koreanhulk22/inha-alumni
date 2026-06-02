"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Post {
  id: string;
  type: string;
  title: string;
  summary: string | null;
  created_at: string;
}

export default function NewsletterTemplateTab() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [subject, setSubject] = useState("인하대학교 총동창회 뉴스레터");
  const [intro, setIntro] = useState("안녕하세요, 인하대학교 총동창회입니다.\n최신 소식을 전해드립니다.");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    createClient().from("posts")
      .select("id, type, title, summary, created_at")
      .order("created_at", { ascending: false })
      .limit(30)
      .then(({ data }) => setPosts(data ?? []));
  }, []);

  const selectedPosts = posts.filter(p => selected.includes(p.id));
  const today = new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long" });

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f5f7fa;font-family:'Apple SD Gothic Neo',Pretendard,sans-serif;">
<div style="max-width:600px;margin:0 auto;background:#fff;">

  <!-- 헤더 -->
  <div style="background:#003876;padding:32px 40px;text-align:center;">
    <div style="color:#C8A951;font-size:12px;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px;">INHA UNIVERSITY ALUMNI</div>
    <h1 style="color:#fff;font-size:22px;font-weight:700;margin:0;">인하대학교 총동창회</h1>
    <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:8px 0 0;">${today} 뉴스레터</p>
  </div>

  <!-- 인사말 -->
  <div style="padding:32px 40px;border-bottom:1px solid #e5e7eb;">
    <p style="color:#374151;font-size:14px;line-height:1.8;margin:0;white-space:pre-line;">${intro.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
  </div>

  <!-- 기사 목록 -->
  ${selectedPosts.map((p, i) => `
  <!-- 기사 ${i + 1} -->
  <div style="padding:24px 40px;border-bottom:1px solid #f3f4f6;">
    <div style="margin-bottom:8px;">
      <span style="background:#E8F0FE;color:#003876;font-size:11px;font-weight:600;padding:2px 8px;border-radius:10px;">${p.type}</span>
    </div>
    <h2 style="color:#1f2937;font-size:16px;font-weight:700;margin:0 0 8px;line-height:1.5;">${p.title.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</h2>
    ${p.summary ? `<p style="color:#6b7280;font-size:13px;line-height:1.7;margin:0 0 12px;">${p.summary.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>` : ""}
    <a href="https://inhain.vercel.app/news/${p.id}" style="color:#003876;font-size:13px;font-weight:600;text-decoration:none;">자세히 보기 →</a>
  </div>`).join("")}

  <!-- 푸터 -->
  <div style="background:#f9fafb;padding:24px 40px;text-align:center;">
    <p style="color:#9ca3af;font-size:12px;margin:0 0 4px;">인하대학교 총동창회</p>
    <p style="color:#9ca3af;font-size:11px;margin:0;">(22188) 인천광역시 미추홀구 독배로 311, 비젼프라자 901호 | 032-887-2345 | inha@inhain.com</p>
    <p style="color:#9ca3af;font-size:11px;margin:8px 0 0;">친목공영 | 모교후원 | 후진육영</p>
  </div>

</div>
</body>
</html>`;

  function handleCopy() {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function togglePost(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">뉴스레터 템플릿 생성</h1>
      <p className="text-sm text-gray-500">기사를 선택하면 이메일 발송용 HTML을 자동 생성합니다. 생성된 HTML을 복사하여 외부 메일 발송 시스템(mailchimp, Stibee 등)에서 사용하세요.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 설정 */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h2 className="font-bold text-gray-700">기본 설정</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">제목 (메일 제목)</label>
              <input value={subject} onChange={e => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">인사말</label>
              <textarea rows={3} value={intro} onChange={e => setIntro(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-bold text-gray-700 mb-3">기사 선택 ({selected.length}개 선택됨)</h2>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {posts.map(p => (
                <label key={p.id} className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selected.includes(p.id) ? "bg-[#E8F0FE]" : "hover:bg-gray-50"}`}>
                  <input type="checkbox" checked={selected.includes(p.id)} onChange={() => togglePost(p.id)} className="mt-0.5 accent-[#003876]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 line-clamp-1">{p.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      <span className="text-[#003876]">{p.type}</span> · {new Date(p.created_at).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 미리보기 + HTML */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-700">생성된 HTML</h2>
              <button onClick={handleCopy}
                className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${copied ? "bg-green-500 text-white" : "bg-[#003876] text-white hover:bg-[#002a5c]"}`}>
                {copied ? "복사됨 ✓" : "HTML 복사"}
              </button>
            </div>
            <textarea
              readOnly
              value={html}
              rows={16}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-500 font-mono bg-gray-50 focus:outline-none resize-none"
            />
          </div>
          <div className="bg-[#E8F0FE] rounded-xl p-4 text-sm text-[#003876]">
            <p className="font-semibold mb-1">사용 방법</p>
            <ol className="list-decimal list-inside space-y-1 text-xs text-gray-600">
              <li>기사를 선택하고 HTML 복사 버튼 클릭</li>
              <li>Stibee / Mailchimp / 네이버 메일 등에서 HTML 모드로 붙여넣기</li>
              <li>미리보기 확인 후 발송</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
