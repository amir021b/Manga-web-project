/**
 * Check a user typed value.
 * Later this will be used by the login and sign up forms to report simple
 * mistakes such as an invalid email address or a too short password.
 *
 * @param {string} value The value that should be checked.
 * @returns {string} An error message, or an empty string when the value is fine.
 */
export function validateEmail(value) {
  // Placeholder: the real email check will be added here later.
  return value ? '' : 'Email is required'
}
