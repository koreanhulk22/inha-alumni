"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  initialName: string;
  initialDepartment: string;
  initialYear: string;
  initialPhone: string;
}

export function ProfileEditForm({ userId, initialName, initialDepartment, initialYear, initialPhone }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({ name: initialName, department: initialDepartment, graduation_year: initialYear, phone: initialPhone });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.from("users").update({
      name: form.name,
      department: form.department,
      graduation_year: form.graduation_year ? parseInt(form.graduation_year) : null,
      phone: form.phone,
    }).eq("id", userId);

    if (error) {
      setMessage("저장 중 오류가 발생했습니다.");
    } else {
      setMessage("저장되었습니다.");
      router.refresh();
    }
    setLoading(false);
  }

  async function handleLogout() {
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSave} className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 border-t border-gray-100 pt-4">정보 수정</h3>
      {[
        { label: "이름", key: "name", placeholder: "홍길동" },
        { label: "학과", key: "department", placeholder: "전자공학과" },
        { label: "입학년도", key: "graduation_year", placeholder: "1984" },
        { label: "연락처", key: "phone", placeholder: "010-0000-0000" },
      ].map((f) => (
        <div key={f.key} className="flex gap-4 items-center">
          <label className="text-sm text-gray-400 w-24 shrink-0">{f.label}</label>
          <input
            value={form[f.key as keyof typeof form]}
            onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
            placeholder={f.placeholder}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]"
          />
        </div>
      ))}

      {message && <p className={`text-xs ${message.includes("오류") ? "text-red-500" : "text-green-600"}`}>{message}</p>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="px-5 py-2 bg-[#003876] text-white text-sm font-semibold rounded-lg hover:bg-[#002a5c] transition-colors disabled:opacity-50">
          {loading ? "저장 중..." : "저장"}
        </button>
        <button type="button" onClick={handleLogout} className="px-5 py-2 border border-gray-300 text-gray-500 text-sm rounded-lg hover:bg-gray-50 transition-colors">
          로그아웃
        </button>
      </div>
    </form>
  );
}
