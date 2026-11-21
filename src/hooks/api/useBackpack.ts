"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchBackpack, toggleBackpackItem } from "@/services/backpackApi";
import { queryKeys } from "./queryKeys";
import type { BackpackToggleResult } from "@/types/api";

export interface ToggleBackpackVariables {
  id: string | number;
  action: "add" | "remove";
}

interface ToggleBackpackContext {
  previousIds: string[];
}

export function useBackpackQuery(enabled = true) {
  return useQuery<string[]>({
    queryKey: queryKeys.backpack,
    queryFn: fetchBackpack,
    enabled,
    initialData: undefined,
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useToggleBackpackItem() {
  const queryClient = useQueryClient();

  return useMutation<
    BackpackToggleResult,
    Error,
    ToggleBackpackVariables,
    ToggleBackpackContext
  >({
    mutationFn: ({ id }) => toggleBackpackItem(id),
    onMutate: async ({ id, action }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.backpack });

      const previousIds =
        queryClient.getQueryData<string[]>(queryKeys.backpack) ?? [];
      const targetId = String(id);
      const nextIds =
        action === "remove"
          ? previousIds.filter((itemId) => itemId !== targetId)
          : previousIds.includes(targetId)
            ? previousIds
            : [...previousIds, targetId];

      queryClient.setQueryData(queryKeys.backpack, nextIds);
      return { previousIds };
    },
    onError: (_error, _variables, context) => {
      if (context) {
        queryClient.setQueryData(queryKeys.backpack, context.previousIds);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.backpack });
    },
  });
}
