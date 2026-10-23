export const AUTH_MODES = { LOGIN: "login", SIGNUP: "signup" };

export const AUTH_COPY = {
  [AUTH_MODES.LOGIN]: {
    title: "Welcome back",
    subtitle: "Pick up where you left off.",
    tabLabel: "Log in",
    submitLabel: "Log in",
    swapText: "New here?",
    swapAction: "Create an account",
  },
  [AUTH_MODES.SIGNUP]: {
    title: "Create your account",
    subtitle: "Save favorites and keep track of what you read.",
    tabLabel: "Sign up",
    submitLabel: "Create account",
    swapText: "Already have an account?",
    swapAction: "Log in",
  },
};

export const TERMS_TEXT = "I agree to the terms of use and privacy policy.";
export const FORGOT_PASSWORD_TEXT = "Forgot password?";
