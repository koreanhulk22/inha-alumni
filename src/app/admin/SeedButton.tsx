"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SeedButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function handleSeed() {
    if (!confirm("샘플 데이터를 추가하시겠습니까? (게시글 27건, 경조사 10건)")) return;
    setLoading(true);
    const res = await fetch("/admin/seed", { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      setResult(data.message);
      router.refresh();
    } else {
      setResult("오류: " + data.error);
    }
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-3">
      {result && <span className={`text-xs ${result.startsWith("오류") ? "text-red-500" : "text-green-600"}`}>{result}</span>}
      <button
        onClick={handleSeed}
        disabled={loading}
        className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
      >
        {loading ? "추가 중..." : "샘플 데이터 추가"}
      </button>
    </div>
  );
}
