const API_URL = "http://localhost:5000/api/auth";

export async function submitAuth(values, mode) {
  const endpoint = mode === "signup" ? `${API_URL}/signup` : `${API_URL}/login`;

  const payload =
    mode === "signup"
      ? {
          username: values.username,
          email: values.email,
          password: values.password,
        }
      : { email: values.email, password: values.password };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message || "Authentication failed");
    if (data.message?.includes("already registered"))
      error.code = "email_exists";
    if (data.message?.includes("INCORRECT")) error.code = "invalid_credentials";
    throw error;
  }

  // ذخیره توکن دریافتی از بک‌اند
  if (data.data?.token) {
    localStorage.setItem("mangahub_token", data.data.token);
  }

  return data;
}
