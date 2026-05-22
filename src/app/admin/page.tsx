import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { SeedButton } from "./SeedButton";
import {
  deletePost,
  verifyAlumni,
  setAdmin,
  approveBusiness,
  deleteBusiness,
  approveBoardPost,
  approveVerification,
  rejectVerification,
  deleteVerification,
} from "./actions";

// ─── 클라이언트 컴포넌트 탭 (자체 데이터 로딩) ────────────────────
import CondolencesTab from "./condolences/page";
import BannersTab from "./banners/page";
import SMSTab from "./sms/SMSTab";
import GalleryTab from "./gallery/GalleryTab";
import NewsletterTab from "./newsletter/NewsletterTab";
import SettingsTab from "./settings/SettingsTab";

// ─── 타입 ──────────────────────────────────────────────────────────
type Tab = "dashboard" | "posts" | "board" | "users" | "businesses" | "verifications" | "donations" | "condolences" | "banners" | "sms" | "gallery" | "newsletter" | "settings";

// ─── 대시보드 ──────────────────────────────────────────────────────
async function DashboardTab() {
  const admin = createAdminClient();
  const [
    { count: postCount },
    { count: userCount },
    { count: pendingBusinessCount },
    { count: pendingBoardCount },
    { count: pendingVerificationCount },
  ] = await Promise.all([
    admin.from("posts").select("*", { count: "exact", head: true }),
    admin.from("users").select("*", { count: "exact", head: true }),
    admin.from("alumni_businesses").select("*", { count: "exact", head: true }).eq("is_approved", false),
    admin.from("posts").select("*", { count: "exact", head: true }).eq("type", "자유게시판").eq("is_board_approved", false),
    admin.from("alumni_verification_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  const stats = [
    { label: "전체 게시글", value: postCount ?? 0, tab: "posts", color: "#003876" },
    { label: "전체 회원", value: userCount ?? 0, tab: "users", color: "#0066CC" },
    { label: "동문인증 대기", value: pendingVerificationCount ?? 0, tab: "verifications", color: "#7C3AED" },
    { label: "게시판 승인 대기", value: pendingBoardCount ?? 0, tab: "board", color: "#ef4444" },
    { label: "업체 승인 대기", value: pendingBusinessCount ?? 0, tab: "businesses", color: "#C8A951" },
  ];

  const { data: recentPosts } = await admin
    .from("posts")
    .select("id, type, title, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentUsers } = await admin
    .from("users")
    .select("id, name, email, is_alumni_verified, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">대시보드</h1>
        {(postCount ?? 0) < 10 && <SeedButton />}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={`/admin?tab=${stat.tab}`} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
            <div className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-700">최근 게시글</h2>
            <Link href="/admin?tab=posts" className="text-xs text-[#003876] hover:underline">전체 보기</Link>
          </div>
          <div className="space-y-2">
            {recentPosts?.map((post) => (
              <div key={post.id} className="flex items-center gap-3 text-sm">
                <span className="text-xs bg-[#E8F0FE] text-[#003876] px-2 py-0.5 rounded shrink-0">{post.type}</span>
                <span className="flex-1 truncate text-gray-700">{post.title}</span>
                <span className="text-xs text-gray-400 shrink-0">
                  {new Date(post.created_at).toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-700">최근 가입 회원</h2>
            <Link href="/admin?tab=users" className="text-xs text-[#003876] hover:underline">전체 보기</Link>
          </div>
          <div className="space-y-2">
            {recentUsers?.map((user) => (
              <div key={user.id} className="flex items-center gap-3 text-sm">
                <div className="flex-1 min-w-0">
                  <span className="text-gray-700 font-medium">{user.name || "(이름 없음)"}</span>
                  <span className="text-gray-400 text-xs ml-2 truncate">{user.email}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded shrink-0 ${user.is_alumni_verified ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                  {user.is_alumni_verified ? "인증" : "미인증"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 게시글 관리 ───────────────────────────────────────────────────
async function PostsTab() {
  const admin = createAdminClient();
  const { data: posts } = await admin
    .from("posts")
    .select("id, type, title, author_name, is_pinned, views, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">게시글 관리</h1>
        <Link href="/admin/posts/new" className="px-4 py-2 bg-[#003876] text-white text-sm font-semibold rounded-lg hover:bg-[#002a5c] transition-colors">
          + 새 게시글
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-gray-500 font-medium w-28">분류</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium">제목</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-20 hidden md:table-cell">조회</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-28 hidden md:table-cell">작성일</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-24">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts?.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <span className="text-xs bg-[#E8F0FE] text-[#003876] px-2 py-0.5 rounded">{post.type}</span>
                  {post.is_pinned && <span className="ml-1 text-xs bg-red-50 text-red-500 px-1.5 py-0.5 rounded">공지</span>}
                </td>
                <td className="py-3 px-4 text-gray-700 max-w-xs truncate">{post.title}</td>
                <td className="py-3 px-4 text-center text-gray-400 hidden md:table-cell">{post.views}</td>
                <td className="py-3 px-4 text-center text-gray-400 hidden md:table-cell">
                  {new Date(post.created_at).toLocaleDateString("ko-KR")}
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Link href={`/admin/posts/${post.id}/edit`} className="text-xs text-[#003876] hover:underline">수정</Link>
                    <form action={deletePost.bind(null, post.id)}>
                      <button type="submit" className="text-xs text-red-500 hover:underline"
                        onClick={(e) => { if (!confirm("삭제하시겠습니까?")) e.preventDefault(); }}>
                        삭제
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {(!posts || posts.length === 0) && (
              <tr><td colSpan={5} className="py-16 text-center text-gray-400">게시글이 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── 자유게시판 승인 ───────────────────────────────────────────────
async function BoardTab() {
  const admin = createAdminClient();
  const { data: posts } = await admin
    .from("posts")
    .select("id, title, author_name, is_board_approved, created_at, views")
    .eq("type", "자유게시판")
    .order("created_at", { ascending: false });

  const pending = posts?.filter((p) => !p.is_board_approved) ?? [];
  const approved = posts?.filter((p) => p.is_board_approved) ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">자유게시판 승인 관리</h1>
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-base font-bold text-gray-700">승인 대기</h2>
          {pending.length > 0 && <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">{pending.length}</span>}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">제목</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium hidden md:table-cell">작성자</th>
                <th className="py-3 px-4 text-center text-gray-500 font-medium hidden md:table-cell w-28">작성일</th>
                <th className="py-3 px-4 text-center text-gray-500 font-medium w-32">처리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pending.length === 0 ? (
                <tr><td colSpan={4} className="py-12 text-center text-gray-400">대기 중인 게시글이 없습니다.</td></tr>
              ) : pending.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-700 max-w-xs truncate">{post.title}</td>
                  <td className="py-3 px-4 text-gray-500 hidden md:table-cell">{post.author_name || "-"}</td>
                  <td className="py-3 px-4 text-center text-gray-400 hidden md:table-cell">
                    {new Date(post.created_at).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <form action={approveBoardPost.bind(null, post.id, true)}>
                        <button type="submit" className="text-xs px-3 py-1 bg-green-50 text-green-600 rounded-full hover:bg-green-100 font-medium transition-colors">승인</button>
                      </form>
                      <form action={deletePost.bind(null, post.id)}>
                        <button type="submit" className="text-xs px-3 py-1 bg-red-50 text-red-500 rounded-full hover:bg-red-100 font-medium transition-colors"
                          onClick={(e) => { if (!confirm("삭제하시겠습니까?")) e.preventDefault(); }}>삭제</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h2 className="text-base font-bold text-gray-700 mb-3">승인 완료 ({approved.length})</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">제목</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium hidden md:table-cell">작성자</th>
                <th className="py-3 px-4 text-center text-gray-500 font-medium hidden md:table-cell w-16">조회</th>
                <th className="py-3 px-4 text-center text-gray-500 font-medium hidden md:table-cell w-28">작성일</th>
                <th className="py-3 px-4 text-center text-gray-500 font-medium w-32">처리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {approved.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-gray-400">승인된 게시글이 없습니다.</td></tr>
              ) : approved.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-700 max-w-xs truncate">{post.title}</td>
                  <td className="py-3 px-4 text-gray-500 hidden md:table-cell">{post.author_name || "-"}</td>
                  <td className="py-3 px-4 text-center text-gray-400 hidden md:table-cell">{post.views}</td>
                  <td className="py-3 px-4 text-center text-gray-400 hidden md:table-cell">
                    {new Date(post.created_at).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <form action={approveBoardPost.bind(null, post.id, false)}>
                        <button type="submit" className="text-xs text-gray-400 hover:text-gray-600 hover:underline transition-colors">승인취소</button>
                      </form>
                      <form action={deletePost.bind(null, post.id)}>
                        <button type="submit" className="text-xs text-red-500 hover:underline"
                          onClick={(e) => { if (!confirm("삭제하시겠습니까?")) e.preventDefault(); }}>삭제</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── 회원 관리 ─────────────────────────────────────────────────────
async function UsersTab() {
  const admin = createAdminClient();
  const { data: users } = await admin
    .from("users")
    .select("id, name, email, department, graduation_year, phone, is_alumni_verified, is_admin, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">회원 관리</h1>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-gray-500 font-medium">이름</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium hidden md:table-cell">이메일</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium hidden lg:table-cell">학과/학번</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-24">동문인증</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-24">관리자</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-28 hidden md:table-cell">가입일</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users?.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-800">{user.name || "(이름 없음)"}</td>
                <td className="py-3 px-4 text-gray-500 hidden md:table-cell">{user.email}</td>
                <td className="py-3 px-4 text-gray-500 hidden lg:table-cell">
                  {[user.department, user.graduation_year ? `${user.graduation_year}학번` : null].filter(Boolean).join(" · ") || "-"}
                </td>
                <td className="py-3 px-4 text-center">
                  <form action={verifyAlumni.bind(null, user.id, !user.is_alumni_verified)}>
                    <button type="submit" className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                      user.is_alumni_verified
                        ? "bg-green-50 text-green-600 hover:bg-red-50 hover:text-red-500"
                        : "bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-600"
                    }`}>
                      {user.is_alumni_verified ? "인증완료" : "미인증"}
                    </button>
                  </form>
                </td>
                <td className="py-3 px-4 text-center">
                  <form action={setAdmin.bind(null, user.id, !user.is_admin)}>
                    <button type="submit" className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                      user.is_admin
                        ? "bg-[#003876] text-white hover:bg-red-500"
                        : "bg-gray-100 text-gray-500 hover:bg-[#E8F0FE] hover:text-[#003876]"
                    }`}>
                      {user.is_admin ? "관리자" : "일반"}
                    </button>
                  </form>
                </td>
                <td className="py-3 px-4 text-center text-gray-400 hidden md:table-cell">
                  {new Date(user.created_at).toLocaleDateString("ko-KR")}
                </td>
              </tr>
            ))}
            {(!users || users.length === 0) && (
              <tr><td colSpan={6} className="py-16 text-center text-gray-400">가입한 회원이 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── 업체 관리 ─────────────────────────────────────────────────────
async function BusinessesTab() {
  const admin = createAdminClient();
  const { data: businesses } = await admin
    .from("alumni_businesses")
    .select("id, name, category, address, phone, benefit, owner_name, is_approved, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">업체 관리 (인하플레이스)</h1>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-gray-500 font-medium">업체명</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium w-20">분류</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium hidden md:table-cell">주소</th>
              <th className="py-3 px-4 text-left text-gray-500 font-medium hidden lg:table-cell">혜택</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-24">상태</th>
              <th className="py-3 px-4 text-center text-gray-500 font-medium w-20">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {businesses?.map((biz) => (
              <tr key={biz.id} className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <p className="font-medium text-gray-800">{biz.name}</p>
                  {biz.owner_name && <p className="text-xs text-gray-400">{biz.owner_name}</p>}
                </td>
                <td className="py-3 px-4">
                  <span className="text-xs bg-[#E8F0FE] text-[#003876] px-2 py-0.5 rounded">{biz.category}</span>
                </td>
                <td className="py-3 px-4 text-gray-500 hidden md:table-cell truncate max-w-40">{biz.address}</td>
                <td className="py-3 px-4 text-gray-500 hidden lg:table-cell truncate max-w-40">{biz.benefit || "-"}</td>
                <td className="py-3 px-4 text-center">
                  <form action={approveBusiness.bind(null, biz.id, !biz.is_approved)}>
                    <button type="submit" className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                      biz.is_approved
                        ? "bg-green-50 text-green-600 hover:bg-yellow-50 hover:text-yellow-600"
                        : "bg-yellow-50 text-yellow-600 hover:bg-green-50 hover:text-green-600"
                    }`}>
                      {biz.is_approved ? "승인됨" : "대기중"}
                    </button>
                  </form>
                </td>
                <td className="py-3 px-4 text-center">
                  <form action={deleteBusiness.bind(null, biz.id)}>
                    <button type="submit" className="text-xs text-red-500 hover:underline"
                      onClick={(e) => { if (!confirm("삭제하시겠습니까?")) e.preventDefault(); }}>
                      삭제
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {(!businesses || businesses.length === 0) && (
              <tr><td colSpan={6} className="py-16 text-center text-gray-400">등록된 업체가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── 동문인증 관리 ─────────────────────────────────────────────────
async function VerificationsTab() {
  const admin = createAdminClient();
  const { data: requests } = await admin
    .from("alumni_verification_requests")
    .select("id, name, department, entry_year, graduation_year, student_id, phone, file_url, status, admin_note, created_at, reviewed_at")
    .order("created_at", { ascending: false });

  const pending = requests?.filter((r) => r.status === "pending") ?? [];
  const processed = requests?.filter((r) => r.status !== "pending") ?? [];

  const statusBadge = (status: string) => {
    if (status === "approved") return { text: "승인", cls: "bg-green-50 text-green-600" };
    if (status === "rejected") return { text: "거절", cls: "bg-red-50 text-red-500" };
    return { text: "대기중", cls: "bg-yellow-50 text-yellow-600" };
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">동문인증 관리</h1>

      <section>
        <h2 className="text-base font-bold text-gray-700 mb-3">
          승인 대기 <span className="text-[#003876]">({pending.length})</span>
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">이름</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">학과</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium w-28">입학/졸업</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium hidden md:table-cell">학번</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium hidden md:table-cell">연락처</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">서류</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">신청일</th>
                <th className="py-3 px-4 text-center text-gray-500 font-medium w-36">처리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pending.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">{req.name}</td>
                  <td className="py-3 px-4 text-gray-600">{req.department}</td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{req.entry_year}~{req.graduation_year}</td>
                  <td className="py-3 px-4 text-gray-500 hidden md:table-cell">{req.student_id || "-"}</td>
                  <td className="py-3 px-4 text-gray-500 hidden md:table-cell">{req.phone || "-"}</td>
                  <td className="py-3 px-4">
                    {req.file_url ? (
                      <a href={req.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#003876] hover:underline font-medium">📄 보기</a>
                    ) : (
                      <span className="text-xs text-gray-400">없음</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-400">{new Date(req.created_at).toLocaleDateString("ko-KR")}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 justify-center">
                      <form action={approveVerification.bind(null, req.id)}>
                        <button type="submit" className="text-xs px-3 py-1 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors">승인</button>
                      </form>
                      <form action={rejectVerification.bind(null, req.id, undefined)}>
                        <button type="submit" className="text-xs px-3 py-1 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition-colors">거절</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {pending.length === 0 && (
                <tr><td colSpan={8} className="py-12 text-center text-gray-400">대기 중인 인증 신청이 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {processed.length > 0 && (
        <section>
          <h2 className="text-base font-bold text-gray-700 mb-3">처리 완료 ({processed.length})</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 text-left text-gray-500 font-medium">이름</th>
                  <th className="py-3 px-4 text-left text-gray-500 font-medium">학과</th>
                  <th className="py-3 px-4 text-left text-gray-500 font-medium w-28">입학/졸업</th>
                  <th className="py-3 px-4 text-center text-gray-500 font-medium w-20">결과</th>
                  <th className="py-3 px-4 text-left text-gray-500 font-medium hidden md:table-cell">메모</th>
                  <th className="py-3 px-4 text-left text-gray-500 font-medium">처리일</th>
                  <th className="py-3 px-4 text-center text-gray-500 font-medium w-16">삭제</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {processed.map((req) => {
                  const { text, cls } = statusBadge(req.status);
                  return (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-800">{req.name}</td>
                      <td className="py-3 px-4 text-gray-600">{req.department}</td>
                      <td className="py-3 px-4 text-gray-500 text-xs">{req.entry_year}~{req.graduation_year}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${cls}`}>{text}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-xs hidden md:table-cell">{req.admin_note || "-"}</td>
                      <td className="py-3 px-4 text-xs text-gray-400">
                        {req.reviewed_at ? new Date(req.reviewed_at).toLocaleDateString("ko-KR") : "-"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <form action={deleteVerification.bind(null, req.id)}>
                          <button type="submit" className="text-xs text-red-400 hover:underline"
                            onClick={(e) => { if (!confirm("삭제하시겠습니까?")) e.preventDefault(); }}>삭제</button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

// ─── 기부 내역 ─────────────────────────────────────────────────────
async function DonationsTab() {
  const admin = createAdminClient();
  const { data: donations } = await admin
    .from("donations")
    .select("id, fund_type, amount, donor_name, is_anonymous, payment_status, message, created_at")
    .order("created_at", { ascending: false });

  const { data: pledges } = await admin
    .from("pledges")
    .select("id, fund_type, amount, cycle, is_active, created_at")
    .order("created_at", { ascending: false });

  const all = donations ?? [];
  const activePledges = pledges?.filter((p) => p.is_active) ?? [];

  const totals = all
    .filter((d) => d.payment_status === "completed")
    .reduce<Record<string, number>>((acc, d) => {
      acc[d.fund_type] = (acc[d.fund_type] ?? 0) + d.amount;
      return acc;
    }, {});
  const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0);

  const STATUS_LABELS: Record<string, { text: string; cls: string }> = {
    completed: { text: "완료", cls: "bg-green-50 text-green-600" },
    pending: { text: "대기", cls: "bg-yellow-50 text-yellow-600" },
    failed: { text: "실패", cls: "bg-red-50 text-red-500" },
    cancelled: { text: "취소", cls: "bg-gray-100 text-gray-500" },
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">기부 내역</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-2xl font-bold text-[#003876]">{grandTotal.toLocaleString()}원</div>
          <div className="text-sm text-gray-500 mt-1">총 기부액</div>
        </div>
        {(["회비발전기금", "장학기금", "건립기금"] as const).map((key) => (
          <div key={key} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-2xl font-bold text-[#0066CC]">{(totals[key] ?? 0).toLocaleString()}원</div>
            <div className="text-sm text-gray-500 mt-1">{key}</div>
          </div>
        ))}
      </div>
      {activePledges.length > 0 && (
        <section>
          <h2 className="text-base font-bold text-gray-700 mb-3">정기 약정 ({activePledges.length}건 활성)</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 text-left text-gray-500 font-medium">기금 유형</th>
                  <th className="py-3 px-4 text-left text-gray-500 font-medium">금액</th>
                  <th className="py-3 px-4 text-left text-gray-500 font-medium">주기</th>
                  <th className="py-3 px-4 text-left text-gray-500 font-medium">약정일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activePledges.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4"><span className="text-xs bg-[#E8F0FE] text-[#003876] px-2 py-0.5 rounded">{p.fund_type}</span></td>
                    <td className="py-3 px-4 font-medium text-gray-800">{p.amount.toLocaleString()}원</td>
                    <td className="py-3 px-4 text-gray-500">{{ monthly: "월간", quarterly: "분기", yearly: "연간" }[p.cycle as string] ?? p.cycle}</td>
                    <td className="py-3 px-4 text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString("ko-KR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      <section>
        <h2 className="text-base font-bold text-gray-700 mb-3">전체 기부 내역 ({all.length}건)</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">기금 유형</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">기부자</th>
                <th className="py-3 px-4 text-right text-gray-500 font-medium">금액</th>
                <th className="py-3 px-4 text-center text-gray-500 font-medium w-20">상태</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium hidden md:table-cell">메시지</th>
                <th className="py-3 px-4 text-left text-gray-500 font-medium">일시</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {all.map((d) => {
                const st = STATUS_LABELS[d.payment_status] ?? { text: d.payment_status, cls: "bg-gray-100 text-gray-500" };
                return (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4"><span className="text-xs bg-[#E8F0FE] text-[#003876] px-2 py-0.5 rounded">{d.fund_type}</span></td>
                    <td className="py-3 px-4 text-gray-700">{d.is_anonymous ? "익명" : (d.donor_name || "-")}</td>
                    <td className="py-3 px-4 text-right font-medium text-gray-800">{d.amount.toLocaleString()}원</td>
                    <td className="py-3 px-4 text-center"><span className={`text-xs px-2.5 py-1 rounded-full font-medium ${st.cls}`}>{st.text}</span></td>
                    <td className="py-3 px-4 text-gray-400 text-xs hidden md:table-cell max-w-40 truncate">{d.message || "-"}</td>
                    <td className="py-3 px-4 text-xs text-gray-400">{new Date(d.created_at).toLocaleDateString("ko-KR", { year: "2-digit", month: "2-digit", day: "2-digit" })}</td>
                  </tr>
                );
              })}
              {all.length === 0 && (
                <tr><td colSpan={6} className="py-16 text-center text-gray-400">기부 내역이 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

// ─── 메인 페이지 라우터 ────────────────────────────────────────────
export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab = "dashboard" } = await searchParams;

  if (tab === "posts") return <PostsTab />;
  if (tab === "board") return <BoardTab />;
  if (tab === "condolences") return <CondolencesTab />;
  if (tab === "users") return <UsersTab />;
  if (tab === "businesses") return <BusinessesTab />;
  if (tab === "verifications") return <VerificationsTab />;
  if (tab === "donations") return <DonationsTab />;
  if (tab === "banners") return <BannersTab />;
  if (tab === "gallery") return <GalleryTab />;
  if (tab === "newsletter") return <NewsletterTab />;
  if (tab === "sms") return <SMSTab />;
  if (tab === "settings") return <SettingsTab />;
  return <DashboardTab />;
}
