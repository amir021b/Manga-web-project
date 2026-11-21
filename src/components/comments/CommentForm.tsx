"use client";

import { useState } from "react";
import { MAX_COMMENT_LENGTH } from "@/data/comments";

interface CommentFormProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

function CommentForm({
  onSubmit,
  disabled = false,
  placeholder = "Write a comment...",
}: CommentFormProps) {
  const [text, setText] = useState("");
  const trimmedText = text.trim();
  const characterCount = trimmedText.length;
  const isValid =
    characterCount > 0 && characterCount <= MAX_COMMENT_LENGTH;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid || disabled) return;

    onSubmit(trimmedText);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={placeholder}
        className="min-h-[96px] w-full resize-y rounded-xl border border-[var(--mh-border)] bg-[var(--mh-surface)] p-3 text-sm text-[var(--mh-text)] transition placeholder:text-[var(--mh-text-muted)] focus:border-[var(--mh-accent)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
      />
      <div className="mt-2 flex items-center justify-between gap-3">
        <span
          aria-live="polite"
          className={[
            "text-[10px] uppercase tracking-wider",
            characterCount > MAX_COMMENT_LENGTH
              ? "text-red-400"
              : "text-[var(--mh-text-muted)]",
          ].join(" ")}
        >
          {characterCount} / {MAX_COMMENT_LENGTH}
        </span>
        <button
          type="submit"
          disabled={!isValid || disabled}
          className="h-9 rounded-full border border-white/30 bg-black/60 px-4 text-xs font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Post
        </button>
      </div>
    </form>
  );
}

export default CommentForm;
