"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface SmsLog {
  id: string;
  message: string;
  recipient_type: string;
  recipient_count: number;
  status: string;
  error_message: string | null;
  created_at: string;
}

const RECIPIENT_OPTIONS = [
  { value: "all", label: "전체 회원", desc: "전화번호 등록된 전체 회원" },
  { value: "verified", label: "인증 동문만", desc: "동문인증 완료된 회원만" },
  { value: "custom", label: "직접 입력", desc: "번호 직접 입력 (쉼표 또는 줄바꿈 구분)" },
];

const TEMPLATES = [
  {
    label: "부고 알림",
    text: "[인하총동창회] {이름}({학과}{학번}) 동문 부친상 알림\n일시: {일시} | 장소: {장소}\n삼가 고인의 명복을 빕니다.",
  },
  {
    label: "경사 알림",
    text: "[인하총동창회] {이름}({학과}{학번}) 동문 {경사내용} 알림\n일시: {일시} | 장소: {장소}",
  },
  {
    label: "공지 안내",
    text: "[인하총동창회] {내용}\n자세한 내용은 홈페이지(inhain.com)를 확인해주세요.",
  },
  {
    label: "행사 안내",
    text: "[인하총동창회] {행사명} 안내\n일시: {일시} | 장소: {장소}\n많은 참여 바랍니다.",
  },
];

export default function SMSTab() {
  const [logs, setLogs] = useState<SmsLog[]>([]);
  const [recipientType, setRecipientType] = useState<"all" | "verified" | "custom">("verified");
  const [customNumbers, setCustomNumbers] = useState("");
  const [message, setMessage] = useState("");
  const [senderNo, setSenderNo] = useState("032-887-2345");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [recipientCount, setRecipientCount] = useState<number | null>(null);

  useEffect(() => {
    loadLogs();
    loadRecipientCount("verified");
  }, []);

  async function loadLogs() {
    const { data } = await createClient()
      .from("sms_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setLogs(data ?? []);
  }

  async function loadRecipientCount(type: string) {
    if (type === "custom") { setRecipientCount(null); return; }
    const query = createClient().from("users").select("*", { count: "exact", head: true }).not("phone", "is", null);
    if (type === "verified") query.eq("is_alumni_verified", true);
    const { count } = await query;
    setRecipientCount(count ?? 0);
  }

  function handleRecipientChange(type: "all" | "verified" | "custom") {
    setRecipientType(type);
    loadRecipientCount(type);
  }

  async function handleSend() {
    if (!message.trim()) { setResult({ type: "error", text: "메시지를 입력해주세요." }); return; }
    if (!confirm(`${recipientType === "custom" ? "입력한 번호" : recipientType === "verified" ? "인증 동문" : "전체 회원"}에게 문자를 발송하시겠습니까?`)) return;

    setSending(true);
    setResult(null);

    try {
      const res = await fetch("/api/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, recipientType, customNumbers, senderNo }),
      });
      const json = await res.json();
      if (!res.ok) {
        setResult({ type: "error", text: json.error ?? "발송 실패" });
      } else {
        setResult({ type: "success", text: `✅ ${json.sentCount}명에게 발송 완료` });
        setMessage("");
        loadLogs();
      }
    } catch {
      setResult({ type: "error", text: "네트워크 오류가 발생했습니다." });
    } finally {
      setSending(false);
    }
  }

  const msgLen = message.length;
  const msgType = msgLen > 90 ? "LMS" : "SMS";
  const msgColor = msgLen > 90 ? "text-orange-500" : msgLen > 70 ? "text-yellow-600" : "text-gray-400";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">문자 발송</h1>

      {/* 발송 폼 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-base font-bold text-gray-700">새 문자 발송</h2>

        {/* 수신자 */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">수신 대상</label>
          <div className="grid grid-cols-3 gap-2">
            {RECIPIENT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleRecipientChange(opt.value as "all" | "verified" | "custom")}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  recipientType === opt.value
                    ? "border-[#003876] bg-[#E8F0FE]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className={`text-xs font-bold ${recipientType === opt.value ? "text-[#003876]" : "text-gray-700"}`}>
                  {opt.label}
                  {recipientType === opt.value && recipientCount !== null && (
                    <span className="ml-1.5 font-normal text-[#0066CC]">({recipientCount}명)</span>
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{opt.desc}</div>
              </button>
            ))}
          </div>
          {recipientType === "custom" && (
            <textarea
              value={customNumbers}
              onChange={(e) => setCustomNumbers(e.target.value)}
              rows={3}
              placeholder={"010-1234-5678\n010-9876-5432, 010-1111-2222"}
              className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#003876] font-mono"
            />
          )}
        </div>

        {/* 템플릿 */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">빠른 템플릿</label>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={() => setMessage(t.text)}
                className="text-xs px-3 py-1.5 border border-gray-200 rounded-full hover:border-[#003876] hover:text-[#003876] transition-colors"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 메시지 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-600">메시지 내용</label>
            <span className={`text-xs font-medium ${msgColor}`}>
              {msgLen}자 · {msgType}
              {msgLen > 90 && " (90자 초과 시 LMS 요금 적용)"}
            </span>
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder="발송할 메시지를 입력하세요."
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#003876] resize-none"
          />
        </div>

        {/* 발신번호 */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">발신번호</label>
          <input
            type="text"
            value={senderNo}
            onChange={(e) => setSenderNo(e.target.value)}
            className="w-48 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#003876]"
          />
          <p className="text-xs text-gray-400 mt-1">사전에 문자 서비스에 등록된 발신번호만 사용 가능합니다.</p>
        </div>

        {/* 결과 메시지 */}
        {result && (
          <div className={`text-sm px-4 py-3 rounded-lg ${
            result.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
          }`}>
            {result.text}
          </div>
        )}

        {/* 발송 버튼 */}
        <button
          type="button"
          onClick={handleSend}
          disabled={sending || !message.trim()}
          className="w-full bg-[#003876] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#002a5c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {sending ? "발송 중..." : "문자 발송"}
        </button>
      </div>

      {/* 발송 내역 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-700">발송 내역</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-gray-500 font-medium">메시지</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium w-28 hidden md:table-cell">대상</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-20">수신자</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-20">상태</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium w-32 hidden md:table-cell">발송일시</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-700 max-w-xs">
                  <p className="truncate text-sm">{log.message}</p>
                  {log.error_message && (
                    <p className="text-xs text-red-500 mt-0.5">{log.error_message}</p>
                  )}
                </td>
                <td className="py-3 px-4 hidden md:table-cell">
                  <span className="text-xs bg-[#E8F0FE] text-[#003876] px-2 py-0.5 rounded">
                    {{ all: "전체", verified: "인증동문", custom: "직접입력" }[log.recipient_type] ?? log.recipient_type}
                  </span>
                </td>
                <td className="py-3 px-4 text-center text-gray-700 font-medium">{log.recipient_count}명</td>
                <td className="py-3 px-4 text-center">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    log.status === "sent" ? "bg-green-50 text-green-600" :
                    log.status === "failed" ? "bg-red-50 text-red-500" :
                    "bg-yellow-50 text-yellow-600"
                  }`}>
                    {log.status === "sent" ? "완료" : log.status === "failed" ? "실패" : "대기"}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs text-gray-400 hidden md:table-cell">
                  {new Date(log.created_at).toLocaleString("ko-KR", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr><td colSpan={5} className="py-16 text-center text-gray-400">발송 내역이 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
