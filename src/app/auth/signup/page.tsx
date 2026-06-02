"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    department: "",
    entryYear: "",
    graduationYear: "",
    studentId: "",
    birthDate: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (form.password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }
    if (!/^\d{6}$/.test(form.birthDate)) {
      setError("생년월일은 숫자 6자리로 입력해주세요. (예: 840315)");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          name: form.name,
          phone: form.phone || null,
          birth_date: form.birthDate,
          student_id: form.studentId || null,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("users").update({
        department: form.department || null,
        graduation_year: form.entryYear ? parseInt(form.entryYear) : null,
      }).eq("id", user.id);
    }

    setLoading(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-[#E8F0FE] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#003876]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#003876] mb-2">가입 신청 완료</h2>
          <p className="text-sm text-gray-600 mb-1">회원가입 신청이 접수되었습니다.</p>
          <p className="text-sm text-gray-500 mb-6">
            관리자 승인 후 로그인이 가능합니다.<br />
            승인은 영업일 기준 1~2일 내 처리됩니다.
          </p>

          <div className="bg-[#FEF9E7] border border-[#C8A951]/30 rounded-xl p-4 mb-6 text-left">
            <p className="text-xs font-semibold text-[#003876] mb-2">카카오 채널에서 총동창회 소식을 받아보세요</p>
            <p className="text-xs text-gray-500 mb-3">행사 안내, 공지사항 등 주요 소식을 카카오 채널로 빠르게 받아볼 수 있습니다.</p>
            <a
              href="https://pf.kakao.com/_inhain"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#FEE500] text-[#3A1D1D] text-xs font-bold rounded-lg hover:bg-[#F0D800] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.626 5.085 4.1 6.548l-.997 3.659c-.09.328.278.583.556.383l4.312-2.897A11.8 11.8 0 0012 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3z"/>
              </svg>
              카카오 채널 추가하기
            </a>
          </div>

          <div className="text-sm text-gray-400 mb-4">
            인하상회 동문 전용 쇼핑몰도 이용해보세요 —{" "}
            <a href="https://www.inhamart.com" target="_blank" rel="noopener noreferrer" className="text-[#003876] hover:underline font-medium">
              inhamart.com
            </a>
          </div>

          <Link href="/auth/login" className="inline-block w-full py-2.5 border border-[#003876] text-[#003876] text-sm font-semibold rounded-lg hover:bg-[#E8F0FE] transition-colors">
            로그인 페이지로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#003876]">회원가입</h1>
          <p className="text-sm text-gray-500 mt-1">인하대학교 총동창회</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* 필수 항목 */}
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">필수 항목</div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름 <span className="text-red-500">*</span>
            </label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876] focus:border-transparent"
              placeholder="홍길동" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일 <span className="text-red-500">*</span>
            </label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876] focus:border-transparent"
              placeholder="example@email.com" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                학과 <span className="text-red-500">*</span>
              </label>
              <input type="text" name="department" value={form.department} onChange={handleChange} required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876] focus:border-transparent"
                placeholder="전자공학과" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                입학년도 <span className="text-red-500">*</span>
              </label>
              <input type="number" name="entryYear" value={form.entryYear} onChange={handleChange} required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876] focus:border-transparent"
                placeholder="1984" min="1954" max={new Date().getFullYear()} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                생년월일 앞 6자리 <span className="text-red-500">*</span>
              </label>
              <input type="text" name="birthDate" value={form.birthDate} onChange={handleChange} required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876] focus:border-transparent"
                placeholder="840315" maxLength={6} inputMode="numeric" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                연락처 <span className="text-red-500">*</span>
              </label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876] focus:border-transparent"
                placeholder="010-0000-0000" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호 <span className="text-red-500">*</span>
            </label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876] focus:border-transparent"
              placeholder="8자 이상" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호 확인 <span className="text-red-500">*</span>
            </label>
            <input type="password" name="passwordConfirm" value={form.passwordConfirm} onChange={handleChange} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876] focus:border-transparent"
              placeholder="비밀번호 재입력" />
          </div>

          {/* 선택 항목 */}
          <div className="pt-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">선택 항목</div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">학번</label>
              <input type="text" name="studentId" value={form.studentId} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876] focus:border-transparent"
                placeholder="19841234" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">졸업년도</label>
              <input type="number" name="graduationYear" value={form.graduationYear} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876] focus:border-transparent"
                placeholder="1988" min="1954" max={new Date().getFullYear()} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">주소 (동창회보 수령 주소)</label>
            <input type="text" name="address" value={form.address} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876] focus:border-transparent"
              placeholder="인천광역시 미추홀구 독배로 311" />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="bg-[#F8FAFC] border border-gray-200 rounded-lg p-3 text-xs text-gray-500">
            회원가입 후 <strong className="text-gray-700">관리자 승인</strong>이 완료되어야 서비스를 이용하실 수 있습니다. 승인은 영업일 기준 1~2일 내 처리됩니다.
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-[#003876] text-white text-sm font-semibold rounded-lg hover:bg-[#002a5c] transition-colors disabled:opacity-50">
            {loading ? "처리 중..." : "회원가입 신청"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          이미 계정이 있으신가요?{" "}
          <Link href="/auth/login" className="text-[#003876] font-semibold hover:underline">로그인</Link>
        </div>
      </div>
    </div>
  );
}
