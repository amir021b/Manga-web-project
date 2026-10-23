export const STATUS = {
  IDLE: "idle",
  SUBMITTING: "submitting",
  SUCCESS: "success",
};
export const AUTH_MODES = { LOGIN: "login", SIGNUP: "signup" };

export const AUTH_COPY = {
  [AUTH_MODES.LOGIN]: {
    title: "Welcome back",
    subtitle: "Pick up where you left off.",
    tabLabel: "Log in",
    submitLabel: "Log in",
    loadingLabel: "Logging in...",
    swapText: "New here?",
    swapAction: "Create an account",
    successTitle: "You’re in",
    successMessage: "Welcome back. This is a design preview, so nothing was saved.",
    successAction: "Back to the form",
  },
  [AUTH_MODES.SIGNUP]: {
    title: "Create your account",
    subtitle: "Save favorites and keep track of what you read.",
    tabLabel: "Sign up",
    submitLabel: "Create account",
    loadingLabel: "Creating account...",
    swapText: "Already have an account?",
    swapAction: "Log in",
    successTitle: "Account created",
    successMessage: "Your account is ready. This is a design preview, so nothing was saved.",
    successAction: "Back to the form",
  },
};

export const REQUIRED_FIELDS = {
  [AUTH_MODES.LOGIN]: ["email", "password"],
  [AUTH_MODES.SIGNUP]: ["username", "email", "password", "confirmPassword"],
};
export const TERMS_INTRO = "I agree to the";
export const TERMS_LINK = "terms of use and privacy policy";
export const ERROR_MESSAGES = {
  required: "This field is required.",
  usernameFormat: "Use 3 to 20 letters, numbers or underscores.",
  emailFormat: "Enter a valid email address.",
  passwordLength: "Password needs at least 8 characters.",
  passwordMismatch: "Passwords don’t match.",
  termsRequired: "Accept the terms to create an account.",
};
export const FORGOT_PASSWORD_TEXT = "Forgot password?";
