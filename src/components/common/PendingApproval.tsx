import Link from "next/link";

export function PendingApproval() {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-amber-50 border-2 border-amber-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">승인 대기 중</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-5">
          관리자 승인 후 이용 가능한 서비스입니다.<br />
          승인은 영업일 기준 1~2일 내 처리됩니다.
        </p>
        <p className="text-xs text-gray-400 mb-5">
          문의: inha@inhain.com / 032-887-2345
        </p>
        <Link href="/" className="inline-block px-5 py-2 border border-[#003876] text-[#003876] text-sm font-semibold rounded-full hover:bg-[#E8F0FE] transition-colors">
          메인으로
        </Link>
      </div>
    </div>
  );
}

export function PendingBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-center gap-2 text-sm text-amber-800">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
      <span><strong>가입 승인 대기 중</strong>입니다. 일부 서비스는 승인 후 이용 가능합니다.</span>
    </div>
  );
}
