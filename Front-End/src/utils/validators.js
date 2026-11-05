import { AUTH_MODES } from "../constants/authCopy";

export function validateUsername(value) {
  const v = (value || "").trim();
  if (v === "") return "required";
  if (v.length < 3 || v.length > 20) return "usernameFormat";
  if (!/^[A-Za-z0-9_]+$/.test(v)) return "usernameFormat";
  return "";
}

export function validateEmail(value) {
  const v = (value || "").trim();
  if (v === "") return "required";
  if (/\s/.test(v)) return "emailFormat";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "emailFormat";
  return "";
}

export function validatePassword(value) {
  const v = value || "";
  if (v.trim() === "") return "required";
  if (v.length < 8) return "passwordLength";
  return "";
}

export function validateConfirmPassword(value, password) {
  const v = value || "";
  if (v.trim() === "") return "required";
  if (v !== password) return "passwordMismatch";
  return "";
}

export function validateTerms(accepted) {
  return accepted ? "" : "termsRequired";
}

export function validateForm(values, mode) {
  const errors = {};
  if (mode === AUTH_MODES.LOGIN) {
    const emailErr = validateEmail(values.email);
    if (emailErr) errors.email = emailErr;
    const pwd = values.password || "";
    if (pwd.trim() === "") errors.password = "required";
  } else {
    const usernameErr = validateUsername(values.username);
    if (usernameErr) errors.username = usernameErr;
    const emailErr = validateEmail(values.email);
    if (emailErr) errors.email = emailErr;
    const passwordErr = validatePassword(values.password);
    if (passwordErr) errors.password = passwordErr;
    const confirmErr = validateConfirmPassword(values.confirmPassword, values.password);
    if (confirmErr) errors.confirmPassword = confirmErr;
    const termsErr = validateTerms(values.acceptTerms);
    if (termsErr) errors.acceptTerms = termsErr;
  }
  return errors;
}
