"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProfile, updateProfile } from "@/services/userApi";
import { queryKeys } from "./queryKeys";
import type { UpdateProfileInput, UserData } from "@/types/api";

export function useProfileQuery(enabled = true) {
  return useQuery<UserData | null>({
    queryKey: queryKeys.profile,
    queryFn: fetchProfile,
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<UserData | null, Error, UpdateProfileInput>({
    mutationFn: updateProfile,
    onSuccess: (user) => {
      if (user) {
        queryClient.setQueryData(queryKeys.profile, user);
      }
    },
  });
}
