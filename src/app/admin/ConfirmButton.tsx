"use client";

import { useTransition } from "react";

export function ConfirmButton({
  action,
  label = "삭제",
  message = "삭제하시겠습니까?",
  className,
}: {
  action: () => Promise<void>;
  label?: string;
  message?: string;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(message)) return;
        startTransition(async () => { await action(); });
      }}
      className={className ?? "text-xs text-red-400 hover:underline disabled:opacity-50"}
    >
      {pending ? "처리 중..." : label}
    </button>
  );
}
