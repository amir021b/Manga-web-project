"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addComment, deleteComment, listComments } from "@/services/data";
import type { AddCommentInput, MangaComment } from "@/data/comments";
import { queryKeys } from "./queryKeys";

export type AddCommentVariables = Omit<AddCommentInput, "mangaId">;

export interface DeleteCommentVariables {
  id: string;
  authorName: string;
}

export function useCommentsQuery(mangaId: number) {
  return useQuery<MangaComment[]>({
    queryKey: queryKeys.comments.list(mangaId),
    queryFn: () => listComments(mangaId),
    staleTime: 0,
    retry: false,
  });
}

export function useAddComment(mangaId: number) {
  const queryClient = useQueryClient();

  return useMutation<MangaComment, Error, AddCommentVariables>({
    mutationFn: async (input) => addComment({ mangaId, ...input }),
    onSuccess: () => {
      queryClient.setQueryData(
        queryKeys.comments.list(mangaId),
        listComments(mangaId),
      );
    },
  });
}

export function useDeleteComment(mangaId: number) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteCommentVariables>({
    mutationFn: async ({ id, authorName }) => deleteComment(id, authorName),
    onSuccess: () => {
      queryClient.setQueryData(
        queryKeys.comments.list(mangaId),
        listComments(mangaId),
      );
    },
  });
}
