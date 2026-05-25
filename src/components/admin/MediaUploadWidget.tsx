"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface MediaItem {
  url: string;
  type: "image" | "video";
  name: string;
}

interface Props {
  thumbnailUrl?: string;
  attachments?: string[];
  onChangeThumbnail: (url: string) => void;
  onChangeAttachments: (urls: string[]) => void;
}

function isVideo(url: string) {
  return /\.(mp4|webm|mov|avi)(\?|$)/i.test(url);
}

function MediaPreview({ item, onRemove }: { item: MediaItem; onRemove: () => void }) {
  return (
    <div className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
      {item.type === "image" ? (
        <div className="relative w-full aspect-video">
          <Image src={item.url} alt={item.name} fill className="object-cover" />
        </div>
      ) : (
        <video src={item.url} controls className="w-full aspect-video object-cover" />
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center transition-colors"
        aria-label="삭제"
      >
        ×
      </button>
      <div className="px-2 py-1 text-[10px] text-gray-400 truncate">{item.name}</div>
    </div>
  );
}

export function MediaUploadWidget({ thumbnailUrl, attachments = [], onChangeThumbnail, onChangeAttachments }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("bucket", "post-media");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? "업로드 실패");
    return json.url as string;
  }

  async function handleThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const url = await uploadFile(file);
      onChangeThumbnail(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "업로드 실패");
    } finally {
      setUploading(false);
      if (thumbInputRef.current) thumbInputRef.current.value = "";
    }
  }

  async function handleAttachmentsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setError("");
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadFile));
      onChangeAttachments([...attachments, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "업로드 실패");
    } finally {
      setUploading(false);
      if (mediaInputRef.current) mediaInputRef.current.value = "";
    }
  }

  function removeAttachment(index: number) {
    onChangeAttachments(attachments.filter((_, i) => i !== index));
  }

  const attachmentItems: MediaItem[] = attachments.map((url) => ({
    url,
    type: isVideo(url) ? "video" : "image",
    name: url.split("/").pop() ?? url,
  }));

  return (
    <div className="space-y-4">
      {/* 썸네일 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">썸네일 이미지</label>
        <div className="flex items-start gap-3">
          {thumbnailUrl ? (
            <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-gray-200 shrink-0">
              <Image src={thumbnailUrl} alt="썸네일" fill className="object-cover" />
              <button
                type="button"
                onClick={() => onChangeThumbnail("")}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-red-600 text-white rounded-full text-[10px] flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ) : (
            <div
              className="w-32 h-20 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 text-xs shrink-0 cursor-pointer hover:border-[#003876] transition-colors"
              onClick={() => thumbInputRef.current?.click()}
            >
              이미지 없음
            </div>
          )}
          <div className="flex-1">
            <button
              type="button"
              onClick={() => thumbInputRef.current?.click()}
              disabled={uploading}
              className="text-xs px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 disabled:opacity-50"
            >
              {uploading ? "업로드 중..." : "이미지 업로드"}
            </button>
            <p className="text-[11px] text-gray-400 mt-1">목록/카드에 표시되는 대표 이미지 (JPG, PNG, WebP)</p>
          </div>
        </div>
        <input
          ref={thumbInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleThumbnailChange}
          className="hidden"
        />
      </div>

      {/* 첨부 미디어 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          첨부 사진 / 동영상
          <span className="ml-2 text-xs font-normal text-gray-400">본문에 표시됩니다</span>
        </label>

        {attachmentItems.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            {attachmentItems.map((item, i) => (
              <MediaPreview key={i} item={item} onRemove={() => removeAttachment(i)} />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => mediaInputRef.current?.click()}
          disabled={uploading}
          className="w-full py-3 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400 hover:border-[#003876] hover:text-[#003876] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <span className="text-lg">+</span>
          {uploading ? "업로드 중..." : "사진/동영상 추가 (여러 장 선택 가능)"}
        </button>
        <p className="text-[11px] text-gray-400 mt-1">JPG, PNG, WebP, GIF, MP4, WebM, MOV · 최대 200MB</p>

        <input
          ref={mediaInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime,video/x-msvideo"
          multiple
          onChange={handleAttachmentsChange}
          className="hidden"
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
