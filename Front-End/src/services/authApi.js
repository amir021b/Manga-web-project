<<<<<<< HEAD
export function submitAuth() {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Accept any valid input for both signup and login.
      // Error codes (email_exists, invalid_credentials) are preserved so a real
      // backend API can reject with the same shape and the UI will display them.
      resolve({ ok: true });
    }, 1200);
  });
}
=======
const API_URL = "http://localhost:5000/api/auth";

export async function submitAuth(mode, values) {
  const endpoint = mode === "signup" ? "signup" : "login";

  // فقط چیزایی که بک می‌خواد (confirmPassword و acceptTerms نمیرن)
  const body =
    mode === "signup"
      ? {
          username: values.username,
          email: values.email,
          password: values.password,
        }
      : { email: values.email, password: values.password };

  let res;
  try {
    res = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw { code: "network_error" }; // سرور خاموشه یا آدرس غلطه
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // جواب JSON نبود
  }

  if (res.ok) return data; // { status, message, data: { token, user } }

  if (res.status === 401) throw { code: "invalid_credentials" };
  if (res.status === 400 && data?.message?.includes("already registered")) {
    throw { code: "email_exists" };
  }
  throw { code: "server_error" };
}
>>>>>>> 9144595f03b312a8e9e24066661c8244036e6794
