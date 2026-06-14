"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function NoticeSearchBar({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (q) {
      router.push(`/news/notice?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/news/notice");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-1.5 max-w-xs w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="제목 검색..."
        className="flex-1 min-w-0 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#003876] focus:ring-1 focus:ring-[#003876]/30"
      />
      <button
        type="submit"
        className="shrink-0 px-3 py-1.5 bg-[#003876] text-white text-xs font-semibold rounded-lg hover:bg-[#002a5c] transition-colors"
      >
        검색
      </button>
    </form>
  );
}
