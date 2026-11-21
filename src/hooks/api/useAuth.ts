"use client";

import { useMutation } from "@tanstack/react-query";
import { submitAuth, type AuthRequestError } from "@/services/authApi";
import type { AuthMode, AuthResponse, AuthValues } from "@/types/api";

export interface AuthMutationVariables {
  values: AuthValues;
  mode: AuthMode;
}

export function useAuthMutation() {
  return useMutation<AuthResponse, AuthRequestError, AuthMutationVariables>({
    mutationFn: ({ values, mode }) => submitAuth(values, mode),
  });
}
