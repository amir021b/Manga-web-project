"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changePassword, updateEmail } from "@/services/settingsApi";
import { queryKeys } from "./queryKeys";
import type {
  ChangePasswordInput,
  UpdateEmailInput,
  UserData,
} from "@/types/api";

export function useChangePassword() {
  return useMutation<void, Error, ChangePasswordInput>({
    mutationFn: changePassword,
  });
}

export function useUpdateEmail() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateEmailInput>({
    mutationFn: updateEmail,
    onSuccess: (_data, variables) => {
      const current = queryClient.getQueryData<UserData | null>(
        queryKeys.profile,
      );

      if (current) {
        queryClient.setQueryData<UserData | null>(
          queryKeys.profile,
          (previous) =>
            previous ? { ...previous, email: variables.email } : previous,
        );
      }
    },
  });
}
