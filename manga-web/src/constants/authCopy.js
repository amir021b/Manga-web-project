export const AUTH_MODES = { LOGIN: "login", SIGNUP: "signup" };

export const AUTH_COPY = {
  [AUTH_MODES.LOGIN]: {
    title: "Welcome back",
    subtitle: "Pick up where you left off.",
    tabLabel: "Log in",
  },
  [AUTH_MODES.SIGNUP]: {
    title: "Create your account",
    subtitle: "Save favorites and keep track of what you read.",
    tabLabel: "Sign up",
  },
};
