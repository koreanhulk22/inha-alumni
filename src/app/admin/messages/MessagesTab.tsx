"use client";

import { useState, useEffect, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

type Message = {
  id: string;
  from_user_id: string | null;
  to_user_id: string | null;
  subject: string;
  body: string;
  is_read: boolean;
  is_from_admin: boolean;
  parent_id: string | null;
  created_at: string;
  from_user?: { name: string; email: string } | null;
  to_user?: { name: string; email: string } | null;
};

type Member = { id: string; name: string; email: string };

type TabType = "inbox" | "sent" | "compose";

export default function MessagesTab() {
  const [activeTab, setActiveTab] = useState<TabType>("inbox");
  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [toUserId, setToUserId] = useState<string>("all");
  const [sendDone, setSendDone] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    loadMessages();
    loadMembers();
  }, [activeTab]);

  async function loadMessages() {
    setLoading(true);
    setSelected(null);

    const isInbox = activeTab === "inbox";
    const query = supabase
      .from("messages")
      .select("*, from_user:from_user_id(name,email), to_user:to_user_id(name,email)")
      .order("created_at", { ascending: false });

    const { data, error } = isInbox
      ? await query.eq("is_from_admin", false)
      : await query.eq("is_from_admin", true);

    if (error) {
      if (error.message.includes("does not exist") || error.code === "42P01") {
        setDbError(true);
      }
      setLoading(false);
      return;
    }
    setMessages((data as Message[]) ?? []);
    setLoading(false);
  }

  async function loadMembers() {
    const { data } = await supabase
      .from("users")
      .select("id, name, email")
      .eq("is_admin", false)
      .order("name");
    setMembers((data as Member[]) ?? []);
  }

  async function markRead(id: string) {
    await supabase.from("messages").update({ is_read: true }).eq("id", id);
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_read: true } : m))
    );
  }

  async function handleSend() {
    if (!subject.trim() || !body.trim()) return;
    startTransition(async () => {
      const { error } = await supabase.from("messages").insert({
        subject: subject.trim(),
        body: body.trim(),
        to_user_id: toUserId === "all" ? null : toUserId,
        is_from_admin: true,
      });
      if (!error) {
        setSubject("");
        setBody("");
        setToUserId("all");
        setSendDone(true);
        setTimeout(() => setSendDone(false), 3000);
      }
    });
  }

  async function handleDelete(id: string) {
    await supabase.from("messages").delete().eq("id", id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  if (dbError) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">메일함</h1>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="font-semibold text-amber-800 mb-3">⚠️ DB 테이블 생성 필요</p>
          <p className="text-sm text-amber-700 mb-4">
            Supabase 대시보드 &gt; SQL Editor에서 아래 SQL을 실행해 주세요.
          </p>
          <pre className="bg-gray-900 text-green-400 text-xs p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
{`-- supabase/migrations/013_messages.sql 내용을 실행하세요
-- 파일 경로: supabase/migrations/013_messages.sql`}
          </pre>
        </div>
      </div>
    );
  }

  const unreadCount = messages.filter((m) => !m.is_read && !m.is_from_admin).length;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">메일함</h1>

      {/* 탭 */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {([
          { key: "inbox", label: `받은 메시지${unreadCount > 0 ? ` (${unreadCount})` : ""}` },
          { key: "sent", label: "보낸 메시지" },
          { key: "compose", label: "✉ 새 메시지 작성" },
        ] as { key: TabType; label: string }[]).map((t) => (
          <button
            key={t.key}
            onClick={() => { setActiveTab(t.key); setSendDone(false); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === t.key
                ? "bg-white text-[#003876] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 메시지 작성 */}
      {activeTab === "compose" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 max-w-2xl">
          {sendDone && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700 font-medium">
              ✓ 메시지를 전송했습니다.
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">받는 사람</label>
            <select
              value={toUserId}
              onChange={(e) => setToUserId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]/30"
            >
              <option value="all">전체 회원</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">제목</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="메시지 제목"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">내용</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              placeholder="메시지 내용을 입력하세요."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]/30 resize-none"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={isPending || !subject.trim() || !body.trim()}
            className="px-6 py-2.5 bg-[#003876] text-white text-sm font-semibold rounded-lg hover:bg-[#002a5c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? "전송 중..." : "전송"}
          </button>
        </div>
      )}

      {/* 메시지 목록 + 상세 */}
      {(activeTab === "inbox" || activeTab === "sent") && (
        <div className="flex gap-4 h-[600px]">
          {/* 목록 */}
          <div className="w-80 shrink-0 bg-white rounded-xl border border-gray-200 overflow-y-auto">
            {loading ? (
              <div className="py-16 text-center text-gray-400 text-sm">불러오는 중...</div>
            ) : messages.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-sm">
                {activeTab === "inbox" ? "받은 메시지가 없습니다." : "보낸 메시지가 없습니다."}
              </div>
            ) : (
              messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => {
                    setSelected(msg);
                    if (!msg.is_read && activeTab === "inbox") markRead(msg.id);
                  }}
                  className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    selected?.id === msg.id ? "bg-[#E8F0FE]" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        {!msg.is_read && activeTab === "inbox" && (
                          <span className="w-2 h-2 rounded-full bg-[#003876] shrink-0" />
                        )}
                        <p className={`text-sm truncate ${!msg.is_read && activeTab === "inbox" ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                          {msg.subject}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {activeTab === "inbox"
                          ? (msg.from_user as { name: string; email: string } | null)?.name ?? "회원"
                          : (msg.to_user as { name: string; email: string } | null)?.name ?? "전체"}
                      </p>
                    </div>
                    <p className="text-[10px] text-gray-400 shrink-0 mt-0.5">
                      {new Date(msg.created_at).toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" })}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* 상세 */}
          <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-y-auto">
            {selected ? (
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{selected.subject}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {activeTab === "inbox"
                        ? `보낸 사람: ${(selected.from_user as { name: string; email: string } | null)?.name ?? "알 수 없음"} · ${(selected.from_user as { name: string; email: string } | null)?.email ?? ""}`
                        : `받는 사람: ${(selected.to_user as { name: string; email: string } | null)?.name ?? "전체 회원"}`}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(selected.created_at).toLocaleString("ko-KR")}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className="text-xs text-red-400 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                  >
                    삭제
                  </button>
                </div>
                <hr className="border-gray-100" />
                <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selected.body}
                </div>
                {activeTab === "inbox" && (
                  <div className="pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setSubject(`Re: ${selected.subject}`);
                        setToUserId(selected.from_user_id ?? "all");
                        setActiveTab("compose");
                      }}
                      className="px-4 py-2 bg-[#003876] text-white text-sm font-medium rounded-lg hover:bg-[#002a5c] transition-colors"
                    >
                      답장
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                메시지를 선택하세요
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
