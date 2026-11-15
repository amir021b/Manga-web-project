import api, { getApiErrorMessage } from "@/lib/axios";
import type {
  ApiResponse,
  ChangePasswordInput,
  ProfilePayload,
  UpdateEmailInput,
} from "@/types/api";

const SETTINGS_ENDPOINT = "/api/user/settings";

export async function changePassword(
  input: ChangePasswordInput,
): Promise<void> {
  try {
    await api.post(`${SETTINGS_ENDPOINT}/password`, input);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Could not update password."));
  }
}

export async function updateEmail(input: UpdateEmailInput): Promise<void> {
  try {
    await api.post<ApiResponse<ProfilePayload>>(
      `${SETTINGS_ENDPOINT}/email`,
      input,
    );
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Could not update email."));
  }
}
