"use client";

import { useState } from "react";

const fundTypes = ["회비발전기금", "장학기금", "건립기금"] as const;
const presets = [100000, 500000, 1000000, 5000000];

export function DonateForm() {
  const [fund, setFund] = useState<string>("회비발전기금");
  const [amount, setAmount] = useState<number | "">("");
  const [name, setName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState("");

  const formatAmount = (n: number) =>
    n >= 10000 ? `${(n / 10000).toLocaleString()}만원` : `${n.toLocaleString()}원`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8">
      <h2 className="text-lg font-bold text-[#003876] mb-6">온라인 기부</h2>

      {/* 기금 선택 */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">기금 선택</label>
        <div className="flex gap-2 flex-wrap">
          {fundTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFund(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                fund === type
                  ? "bg-[#003876] text-white border-[#003876]"
                  : "text-gray-600 border-gray-300 hover:border-[#003876]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 금액 선택 */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">기부 금액</label>
        <div className="flex gap-2 flex-wrap mb-3">
          {presets.map((preset) => (
            <button
              key={preset}
              onClick={() => setAmount(preset)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                amount === preset
                  ? "bg-[#003876] text-white border-[#003876]"
                  : "text-gray-600 border-gray-300 hover:border-[#003876]"
              }`}
            >
              {formatAmount(preset)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
            placeholder="직접 입력 (원)"
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876] focus:border-transparent"
          />
          {amount !== "" && (
            <span className="text-sm text-[#003876] font-medium shrink-0">
              {Number(amount).toLocaleString()}원
            </span>
          )}
        </div>
      </div>

      {/* 기부자 정보 */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">기부자 성명</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isAnonymous}
            placeholder="홍길동"
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876] disabled:bg-gray-50 disabled:text-gray-400"
          />
          <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded"
            />
            익명
          </label>
        </div>
      </div>

      {/* 응원 메시지 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">응원 메시지 (선택)</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="후배들에게 응원의 말씀을 남겨주세요."
          rows={3}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876] resize-none"
        />
      </div>

      <button
        disabled={!amount || (!name && !isAnonymous)}
        className="w-full py-3 bg-[#003876] text-white font-semibold rounded-lg hover:bg-[#002a5c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {amount ? `${Number(amount).toLocaleString()}원 기부하기` : "금액을 선택해주세요"}
      </button>
      <p className="text-xs text-gray-400 text-center mt-2">Toss Payments 결제 연동 예정</p>
    </div>
  );
}
