"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import {
  useAddComment,
  useCommentsQuery,
  useDeleteComment,
} from "@/hooks/api/useComments";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

interface CommentsSectionProps {
  mangaId: number;
}

function CommentsSection({ mangaId }: CommentsSectionProps) {
  const { user, isLoggedIn } = useUser();
  const { data: comments = [], isPending } = useCommentsQuery(mangaId);
  const { mutate: addComment, isPending: isAdding } = useAddComment(mangaId);
  const { mutate: deleteComment } = useDeleteComment(mangaId);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const currentUsername =
    user?.username || (isLoggedIn ? "Manga Fan" : null);
  const currentAvatar = user?.avatar ?? null;

  const topLevelComments = comments
    .filter((comment) => comment.parentId === null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const repliesFor = (parentId: string) =>
    comments
      .filter((comment) => comment.parentId === parentId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const handleAddComment = (text: string) => {
    if (!currentUsername) return;

    addComment({
      parentId: null,
      authorName: currentUsername,
      authorAvatar: currentAvatar,
      text,
    });
  };

  const handleAddReply = (parentId: string, text: string) => {
    if (!currentUsername) return;

    addComment(
      {
        parentId,
        authorName: currentUsername,
        authorAvatar: currentAvatar,
        text,
      },
      {
        onSuccess: () => setReplyingTo(null),
      },
    );
  };

  const handleDeleteComment = (id: string) => {
    if (!currentUsername) return;

    deleteComment({ id, authorName: currentUsername });

    if (replyingTo === id) {
      setReplyingTo(null);
    }
  };

  return (
    <section className="mb-8 w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold uppercase tracking-widest text-[var(--mh-text-secondary)] border-b border-[var(--mh-border)] pb-3">
          Comments ({comments.length})
        </h2>
      </div>

      {isLoggedIn ? (
        <div className="mb-8">
          <CommentForm
            onSubmit={handleAddComment}
            disabled={isAdding}
            placeholder="Share your thoughts..."
          />
        </div>
      ) : (
        <p className="mb-8 text-sm text-[var(--mh-text-secondary)]">
          <Link
            href="/login"
            className="text-[var(--mh-accent)] hover:underline"
          >
            Log in to comment
          </Link>
        </p>
      )}

      {!isPending && topLevelComments.length === 0 ? (
        <div className="rounded-xl border border-[var(--mh-border)] bg-[var(--mh-surface)] px-5 py-8 text-center text-[var(--mh-text-secondary)]">
          No comments yet.
        </div>
      ) : (
        <div className="space-y-4">
          {topLevelComments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              <CommentItem
                comment={comment}
                replies={repliesFor(comment.id)}
                currentUsername={currentUsername}
                onReply={(parentId) =>
                  setReplyingTo((current) =>
                    current === parentId ? null : parentId,
                  )
                }
                onDelete={handleDeleteComment}
              />
              {replyingTo === comment.id ? (
                <div className="rounded-xl border border-[var(--mh-border)] bg-[var(--mh-surface)] p-4">
                  <CommentForm
                    onSubmit={(text) => handleAddReply(comment.id, text)}
                    disabled={isAdding}
                    placeholder={`Reply to ${comment.authorName}...`}
                  />
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="mt-2 text-xs text-[var(--mh-text-muted)] transition hover:text-[var(--mh-text)]"
                  >
                    Cancel
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default CommentsSection;
