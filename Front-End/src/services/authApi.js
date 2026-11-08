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
