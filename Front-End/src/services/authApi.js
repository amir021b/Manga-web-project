export function submitAuth() {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Accept any valid input for both signup and login.
      // Error codes (email_exists, invalid_credentials) are preserved so a real
      // backend API can reject with the same shape and the UI will display them.
      const mockToken = 'mh_mock_token_' + Math.random().toString(36).slice(2, 12);
      try {
        sessionStorage.setItem('mangahub_token', mockToken);
      } catch {
        // Intentionally empty: sessionStorage may be unavailable in some environments.
      }
      resolve({ ok: true, token: mockToken });
    }, 1200);
  });
}
