export interface MangaComment {
  id: string;
  mangaId: number;
  parentId: string | null;
  authorName: string;
  authorAvatar: string | null;
  text: string;
  createdAt: string;
}

export interface AddCommentInput {
  mangaId: number;
  parentId: string | null;
  authorName: string;
  authorAvatar: string | null;
  text: string;
}

export const MAX_COMMENT_LENGTH = 500;

let commentCounter = 0;

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}

let comments: MangaComment[] = [
  {
    id: "seed-comment-1",
    mangaId: 17,
    parentId: null,
    authorName: "Reader A",
    authorAvatar: null,
    text: "The art in this volume still holds up. The pacing is excellent.",
    createdAt: minutesAgo(45),
  },
  {
    id: "seed-comment-2",
    mangaId: 17,
    parentId: null,
    authorName: "Reader B",
    authorAvatar: null,
    text: "I picked this up after watching the anime. The manga adds so much atmosphere.",
    createdAt: minutesAgo(20),
  },
  {
    id: "seed-comment-3",
    mangaId: 17,
    parentId: "seed-comment-2",
    authorName: "Reader A",
    authorAvatar: null,
    text: "Same here. The quiet panels hit harder on paper.",
    createdAt: minutesAgo(12),
  },
  {
    id: "seed-comment-4",
    mangaId: 17,
    parentId: null,
    authorName: "Reader B",
    authorAvatar: null,
    text: "That cliffhanger is brutal. I am already reaching for the next volume.",
    createdAt: minutesAgo(5),
  },
];

export function listComments(mangaId: number): MangaComment[] {
  return comments
    .filter((comment) => comment.mangaId === mangaId)
    .map((comment) => ({ ...comment }));
}

export function addComment(input: AddCommentInput): MangaComment {
  const text = input.text.trim();

  if (!text || text.length > MAX_COMMENT_LENGTH) {
    throw new Error(
      `Comment text must be between 1 and ${MAX_COMMENT_LENGTH} characters.`,
    );
  }

  if (input.parentId !== null) {
    const parent = comments.find((comment) => comment.id === input.parentId);

    if (
      !parent ||
      parent.mangaId !== input.mangaId ||
      parent.parentId !== null
    ) {
      throw new Error("Replies can only be added to a top-level comment.");
    }
  }

  const comment: MangaComment = {
    id: `comment-${Date.now()}-${++commentCounter}`,
    mangaId: input.mangaId,
    parentId: input.parentId,
    authorName: input.authorName,
    authorAvatar: input.authorAvatar,
    text,
    createdAt: new Date().toISOString(),
  };

  comments = [...comments, comment];
  return { ...comment };
}

export function deleteComment(id: string, authorName: string): void {
  const target = comments.find((comment) => comment.id === id);

  if (!target || target.authorName !== authorName) return;

  if (target.parentId === null) {
    comments = comments.filter(
      (comment) => comment.id !== id && comment.parentId !== id,
    );
    return;
  }

  comments = comments.filter((comment) => comment.id !== id);
}
