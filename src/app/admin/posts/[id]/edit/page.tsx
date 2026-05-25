"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { updatePost } from "../../../actions";
import { createClient } from "@/lib/supabase/client";
import { MediaUploadWidget } from "@/components/admin/MediaUploadWidget";

const POST_TYPES = [
  "공지사항", "총동창회소식", "단위동문회소식", "모교소식",
  "동문동정", "인터뷰/칼럼", "자유게시판", "구인구직",
];

interface Post {
  id: string;
  type: string;
  title: string;
  summary: string | null;
  image_url: string | null;
  content: string;
  author_name: string | null;
  is_pinned: boolean;
  attachments: string[] | null;
}

export default function EditPostPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);

  useEffect(() => {
    createClient().from("posts").select("*").eq("id", id).single().then(({ data }) => {
      if (data) {
        setPost(data);
        setThumbnailUrl(data.image_url ?? "");
        setAttachments(data.attachments ?? []);
      }
    });
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData(e.currentTarget);
      formData.set("image_url", thumbnailUrl);
      attachments.forEach((url) => formData.append("attachments", url));
      await updatePost(id, formData);
      router.push("/admin?tab=posts");
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다");
      setLoading(false);
    }
  }

  if (!post) return <div className="text-gray-400 text-sm">불러오는 중...</div>;

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">게시글 수정</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">분류 *</label>
            <select name="type" required defaultValue={post.type} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]">
              {POST_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">작성자</label>
            <input name="author_name" defaultValue={post.author_name ?? "총동창회"} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
          <input name="title" required defaultValue={post.title} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">요약</label>
          <input name="summary" defaultValue={post.summary ?? ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876]" />
        </div>

        <div className="border border-gray-200 rounded-xl p-4">
          <MediaUploadWidget
            thumbnailUrl={thumbnailUrl}
            attachments={attachments}
            onChangeThumbnail={setThumbnailUrl}
            onChangeAttachments={setAttachments}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">본문 *</label>
          <textarea name="content" required rows={12} defaultValue={post.content} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003876] resize-y" />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="is_pinned" name="is_pinned" value="true" defaultChecked={post.is_pinned} className="w-4 h-4 accent-[#003876]" />
          <label htmlFor="is_pinned" className="text-sm text-gray-700">공지 상단 고정</label>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="px-6 py-2.5 bg-[#003876] text-white text-sm font-semibold rounded-lg hover:bg-[#002a5c] transition-colors disabled:opacity-50">
            {loading ? "저장 중..." : "저장"}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors">
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
