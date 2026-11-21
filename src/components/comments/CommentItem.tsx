"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { MangaComment } from "@/data/comments";

interface CommentItemProps {
  comment: MangaComment;
  replies: MangaComment[];
  currentUsername: string | null;
  onReply: (parentId: string) => void;
  onDelete: (id: string) => void;
}

function formatRelativeTime(isoDate: string): string {
  const timestamp = new Date(isoDate).getTime();

  if (!Number.isFinite(timestamp)) return "";

  const elapsedSeconds = Math.max(
    0,
    Math.floor((Date.now() - timestamp) / 1000),
  );

  if (elapsedSeconds < 60) return "just now";

  const minutes = Math.floor(elapsedSeconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 5) {
    return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} month${months === 1 ? "" : "s"} ago`;
  }

  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

function CommentContent({
  comment,
  currentUsername,
  onDelete,
  onReply,
}: {
  comment: MangaComment;
  currentUsername: string | null;
  onDelete: (id: string) => void;
  onReply?: (parentId: string) => void;
}) {
  const [relativeTime, setRelativeTime] = useState("");

  useEffect(() => {
    const updateRelativeTime = () => {
      setRelativeTime(formatRelativeTime(comment.createdAt));
    };

    updateRelativeTime();
    const timer = window.setInterval(updateRelativeTime, 60 * 1000);

    return () => window.clearInterval(timer);
  }, [comment.createdAt]);

  const canDelete =
    Boolean(currentUsername) && comment.authorName === currentUsername;
  const initial = comment.authorName.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="flex gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--mh-border)] bg-[var(--mh-surface-strong)] text-sm font-bold text-[var(--mh-text)]">
        {comment.authorAvatar ? (
          <Image
            src={comment.authorAvatar}
            alt=""
            width={36}
            height={36}
            unoptimized
            className="h-full w-full object-cover"
          />
        ) : (
          initial
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-sm font-semibold text-[var(--mh-text)]">
            {comment.authorName}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-[var(--mh-text-muted)]">
            {relativeTime}
          </span>
        </div>
        <p className="mt-1 whitespace-pre-wrap break-words text-sm text-[var(--mh-text-secondary)]">
          {comment.text}
        </p>
        <div className="mt-2 flex items-center gap-4">
          {onReply ? (
            <button
              type="button"
              onClick={() => onReply(comment.id)}
              className="text-xs text-[var(--mh-text-secondary)] transition hover:text-[var(--mh-text)]"
            >
              Reply
            </button>
          ) : null}
          {canDelete ? (
            <button
              type="button"
              onClick={() => onDelete(comment.id)}
              className="text-xs text-red-400 transition hover:text-red-300"
            >
              Delete
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  replies,
  currentUsername,
  onReply,
  onDelete,
}: CommentItemProps) {
  return (
    <article className="rounded-xl border border-[var(--mh-border)] bg-[var(--mh-surface)] p-4">
      <CommentContent
        comment={comment}
        currentUsername={currentUsername}
        onDelete={onDelete}
        onReply={comment.parentId === null ? onReply : undefined}
      />
      {replies.length > 0 ? (
        <div className="mt-4 space-y-4 border-l border-[var(--mh-border-soft)] pl-4">
          {replies.map((reply) => (
            <CommentContent
              key={reply.id}
              comment={reply}
              currentUsername={currentUsername}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}

export default CommentItem;
