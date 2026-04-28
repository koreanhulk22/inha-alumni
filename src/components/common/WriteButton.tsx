"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Props {
  postType: string;
  userId: string;
}

export function WriteButton({ postType, userId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: err } = await supabase.from("posts").insert({
      type: postType,
      title: form.title,
      content: form.content,
      summary: form.content.slice(0, 80),
      author_id: userId,
      is_board_approved: false, // 관리자 승인 후 노출
    });
    if (err) {
      setError("저장 중 오류가 발생했습니다. 동문 인증이 필요할 수 있습니다.");
      setLoading(false);
      return;
    }
    setOpen(false);
    setForm({ title: "", content: "" });
    setLoading(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-[#003876] text-white text-sm font-semibold rounded-lg hover:bg-[#002a5c] transition-colors"
      >
        + 글쓰기
      </button>
    );
  }

  return (
    <div className="bg-[#E8F0FE] rounded-xl p-5 border border-[#003876]/20">
      <h3 className="text-base font-bold text-[#003876] mb-3">새 글 작성</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          placeholder="제목을 입력하세요"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#003876]"
        />
        <textarea
          value={form.content}
          onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
          placeholder="내용을 입력하세요"
          required
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#003876] resize-y"
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-[#003876] text-white text-sm font-semibold rounded-lg hover:bg-[#002a5c] disabled:opacity-50 transition-colors"
          >
            {loading ? "저장 중..." : "등록"}
          </button>
          <button
            type="button"
            onClick={() => { setOpen(false); setError(""); }}
            className="px-5 py-2 border border-gray-300 text-gray-500 text-sm rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
