import { GNB } from "@/components/layout/GNB";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col font-[Pretendard,system-ui,sans-serif]">
      <GNB />
      <main className="flex-1 bg-gray-50 py-10">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12">
            <h1 className="text-2xl font-bold text-[#003876] mb-2">개인정보처리방침</h1>
            <p className="text-sm text-gray-400 mb-8">시행일: 2026년 7월 1일</p>

            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-6">
              <section>
                <h2 className="text-base font-bold text-gray-800 mb-2">준비 중</h2>
                <p className="text-gray-500">
                  개인정보처리방침이 준비 중입니다. 정식 오픈 전까지 내용이 업데이트될 예정입니다.
                </p>
                <p className="text-gray-500 mt-2">
                  문의: 인하대학교 총동창회 사무국<br />
                  전화: 032-887-2345<br />
                  이메일: inha@inhain.com
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
