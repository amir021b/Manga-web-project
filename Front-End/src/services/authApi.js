export function submitAuth(mode, values) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // ----- Sign up: ایمیل تکراری -----
      if (mode === 'signup' && values.email.toLowerCase() === 'test@test.com') {
        reject({ code: 'email_exists' });
        return;
      }

      // ----- Login: ایمیل یا رمز اشتباه -----
      if (mode === 'login') {
        const isCorrectEmail = values.email.toLowerCase() === 'user@example.com';
        const isCorrectPassword = values.password === '12345678';

        if (!isCorrectEmail || !isCorrectPassword) {
          reject({ code: 'invalid_credentials' });
          return;
        }
      }

      // در حالت درست، موفق می‌شه
      resolve({ ok: true });
    }, 1200);
  });
}