"use client";

import { useState } from "react";
import Link from "next/link";
import { GNB } from "@/components/layout/GNB";
import { Footer } from "@/components/layout/Footer";

const DEPARTMENTS = [
  "기계공학과", "전자공학과", "컴퓨터공학과", "화학공학과", "건축공학과",
  "경영학과", "경제학과", "법학과", "행정학과", "영어영문학과",
  "물리학과", "화학과", "생명과학과", "수학과", "통계학과",
  "전기공학과", "항공우주공학과", "조선해양공학과", "산업공학과", "재료공학과",
  "기타",
];

const YEARS = Array.from({ length: 55 }, (_, i) => 2025 - i);

type Step = 1 | 2 | 3;

export default function VerifyPage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({
    name: "",
    department: "",
    entryYear: "",
    graduationYear: "",
    studentId: "",
    phone: "",
    agreePrivacy: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.department || !form.entryYear || !form.graduationYear) return;
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreePrivacy) return;
    setSubmitting(true);
    setErrorMsg("");

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("department", form.department);
      fd.append("entryYear", form.entryYear);
      fd.append("graduationYear", form.graduationYear);
      if (form.studentId) fd.append("studentId", form.studentId);
      if (form.phone) fd.append("phone", form.phone);
      if (file) fd.append("file", file);

      const res = await fetch("/api/verify", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error ?? "제출 중 오류가 발생했습니다.");
        return;
      }
      setStep(3);
    } catch {
      setErrorMsg("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-[Pretendard,system-ui,sans-serif] bg-gray-50">
      <GNB />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">
        {/* 진행 단계 */}
        <div className="flex items-center gap-0 mb-8">
          {[
            { n: 1, label: "기본 정보" },
            { n: 2, label: "서류 제출" },
            { n: 3, label: "제출 완료" },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${step >= s.n ? "bg-[#003876] text-white" : "bg-gray-200 text-gray-400"}`}>
                  {step > s.n ? "✓" : s.n}
                </div>
                <span className={`text-xs mt-1 font-semibold ${step >= s.n ? "text-[#003876]" : "text-gray-400"}`}>
                  {s.label}
                </span>
              </div>
              {i < 2 && (
                <div className={`h-0.5 flex-1 mx-2 ${step > s.n ? "bg-[#003876]" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <span className="text-xs font-bold tracking-widest text-[#003876] bg-[#E8F0FE] px-3 py-1 rounded-full">
              ALUMNI VERIFICATION
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mt-3 mb-1">동문 인증</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              인증 완료 시 동문 검색·연락처·멘토링 신청 등 추가 서비스를 이용하실 수 있습니다.
            </p>
          </div>

          {/* STEP 1: 기본 정보 */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">이름 *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="홍길동"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#003876]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">학과 *</label>
                  <select
                    required
                    value={form.department}
                    onChange={(e) => handleChange("department", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#003876] bg-white"
                  >
                    <option value="">학과 선택</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">입학연도 *</label>
                  <select
                    required
                    value={form.entryYear}
                    onChange={(e) => handleChange("entryYear", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#003876] bg-white"
                  >
                    <option value="">연도 선택</option>
                    {YEARS.map((y) => <option key={y} value={y}>{y}년</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">졸업연도 *</label>
                  <select
                    required
                    value={form.graduationYear}
                    onChange={(e) => handleChange("graduationYear", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#003876] bg-white"
                  >
                    <option value="">연도 선택</option>
                    {YEARS.map((y) => <option key={y} value={y}>{y}년</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">학번 (선택)</label>
                <input
                  type="text"
                  value={form.studentId}
                  onChange={(e) => handleChange("studentId", e.target.value)}
                  placeholder="예: 20010001"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#003876]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">연락처 (선택)</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="010-0000-0000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#003876]"
                />
                <p className="text-xs text-gray-400 mt-1">사무국 인증 확인용으로만 사용되며 외부에 공개되지 않습니다.</p>
              </div>
              <button
                type="submit"
                className="w-full bg-[#003876] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#002a5c] transition-colors"
              >
                다음 단계 — 서류 제출 →
              </button>
            </form>
          )}

          {/* STEP 2: 서류 제출 + 개인정보 동의 + 최종 제출 */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-[#E8F0FE] rounded-xl p-4 text-sm text-[#003876]">
                <p className="font-bold mb-1">📋 제출 서류 안내</p>
                <ul className="space-y-0.5 text-xs text-gray-600 leading-relaxed">
                  <li>· 졸업증명서 또는 재학증명서 (사진·스캔 파일)</li>
                  <li>· 파일 형식: JPG, PNG, PDF (최대 10MB)</li>
                  <li>· 제출 서류는 동문 인증 목적으로만 사용됩니다.</li>
                  <li>· 검토 후 1~3 영업일 내 이메일로 결과를 안내드립니다.</li>
                </ul>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">졸업증명서 업로드 *</label>
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-[#003876] hover:bg-[#F8FAFF] transition-colors">
                  <span className="text-3xl">{file ? "✅" : "📄"}</span>
                  <span className="text-sm font-semibold text-gray-700">
                    {file ? file.name : "파일을 클릭하거나 드래그하여 업로드"}
                  </span>
                  <span className="text-xs text-gray-400">JPG · PNG · PDF 최대 10MB</span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
              <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                <input
                  type="checkbox"
                  id="agreePrivacy"
                  checked={form.agreePrivacy}
                  onChange={(e) => handleChange("agreePrivacy", e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#003876]"
                />
                <label htmlFor="agreePrivacy" className="text-xs text-gray-600 leading-relaxed">
                  제출한 서류는 동문 인증 목적으로만 사용되며, 인증 완료 후 즉시 파기됩니다.
                  개인정보 수집·이용에 동의합니다. <span className="text-red-500 font-semibold">*</span>
                </label>
              </div>
              {errorMsg && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2">{errorMsg}</p>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  ← 이전
                </button>
                <button
                  type="submit"
                  disabled={!file || !form.agreePrivacy || submitting}
                  className="flex-1 bg-[#003876] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#002a5c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? "제출 중..." : "제출하기"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: 완료 */}
          {step === 3 && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">제출 완료!</h2>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                동문 인증 신청이 접수되었습니다.<br />
                사무국 검토 후 <strong>1~3 영업일 내</strong> 이메일로 결과를 안내드립니다.
              </p>
              <div className="bg-gray-50 rounded-xl p-4 text-left text-xs text-gray-500 mb-6 space-y-1">
                <p>· 인증 완료 시 동문 검색·연락처·멘토링 신청 이용 가능</p>
                <p>· 문의: 사무국 032-887-2345 / inha@inhain.com</p>
              </div>
              <Link href="/" className="inline-block px-8 py-3 bg-[#003876] text-white rounded-full font-bold text-sm hover:bg-[#002a5c] transition-colors">
                메인으로 돌아가기
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
