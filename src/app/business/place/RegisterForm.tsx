"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = ["요식업", "의료", "사무소", "교육", "서비스", "기타"];

export function RegisterForm({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "요식업", address: "", phone: "", benefit: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    await supabase.from("alumni_businesses").insert({
      ...form,
      owner_id: userId,
      is_approved: false,
    });
    setDone(true);
    setLoading(false);
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="px-4 py-2 bg-[#003876] text-white text-sm font-semibold rounded-lg hover:bg-[#002a5c] transition-colors">
        + 업소 등록 신청
      </button>
    );
  }

  if (done) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
        등록 신청이 완료되었습니다. 관리자 승인 후 목록에 표시됩니다. (1~2 영업일 소요)
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
      <h3 className="text-base font-bold text-gray-700">업소 등록 신청</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">업소명 *</label>
          <input required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="업소명" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">분류 *</label>
          <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]">
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">주소 *</label>
        <input required value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
          placeholder="인천 남동구 ..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">전화번호</label>
          <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            placeholder="032-000-0000" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">동문 혜택</label>
          <input value={form.benefit} onChange={(e) => setForm((p) => ({ ...p, benefit: e.target.value }))}
            placeholder="10% 할인 등" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">업소 소개</label>
        <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          rows={3} placeholder="업소 소개를 입력하세요" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876] resize-none" />
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="px-5 py-2 bg-[#003876] text-white text-sm font-semibold rounded-lg hover:bg-[#002a5c] disabled:opacity-50">
          {loading ? "신청 중..." : "신청"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-5 py-2 border border-gray-300 text-gray-500 text-sm rounded-lg">취소</button>
      </div>
    </form>
  );
}
