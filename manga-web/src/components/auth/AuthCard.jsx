import { useState } from 'react';
import { AUTH_MODES, AUTH_COPY } from '../../constants/authCopy';
import { TERMS_TEXT, FORGOT_PASSWORD_TEXT } from '../../constants/authCopy';
import GlassCard from '../ui/GlassCard';
import Logo from '../ui/Logo';
import AuthTabs from '../ui/AuthTabs';
import FloatingInput from '../ui/FloatingInput';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import LinkButton from '../ui/LinkButton';
import Collapse from '../ui/Collapse';

/**
 * AuthCard - the login / sign up card.
 *
 * It owns the mode state and all form field values. Every FloatingInput is
 * fully controlled by this parent. Switching modes does not clear values.
 *
 * @returns {import('react').ReactElement}
 */
function AuthCard() {
  const [mode, setMode] = useState(AUTH_MODES.LOGIN);
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const copy = AUTH_COPY[mode];
  const isSignup = mode === AUTH_MODES.SIGNUP;

  const handleChange = (name) => (event) => {
    const { type, value, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;
    setValues({ ...values, [name]: newValue });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // validation comes next
  };

  return (
    <GlassCard>
      <div className="mb-6">
        <Logo />
      </div>
      <AuthTabs mode={mode} onChange={setMode} />
      <div>
        <h1 className="text-2xl font-bold mb-1.5">{copy.title}</h1>
        <p className="text-sm text-[#9a9a9a] mb-6">{copy.subtitle}</p>
      </div>
      <form noValidate onSubmit={handleSubmit}>
        {/* Username - sign up only */}
        <Collapse open={isSignup}>
          <div className="pb-5">
            <FloatingInput
              id="username"
              label="Username"
              type="text"
              value={values.username}
              onChange={handleChange("username")}
              placeholder="yourname"
              autoComplete="username"
            />
          </div>
        </Collapse>

        {/* Email - always shown */}
        <div className="pb-5">
          <FloatingInput
            id="email"
            label="Email"
            type="email"
            value={values.email}
            onChange={handleChange("email")}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        {/* Password - always shown */}
        <div className="pb-5">
          <FloatingInput
            id="password"
            label="Password"
            type="password"
            value={values.password}
            onChange={handleChange("password")}
            placeholder="At least 8 characters"
            autoComplete={isSignup ? "new-password" : "current-password"}
          />
        </div>

        {/* Confirm password - sign up only */}
        <Collapse open={isSignup}>
          <div className="pb-5">
            <FloatingInput
              id="confirmPassword"
              label="Confirm password"
              type="password"
              value={values.confirmPassword}
              onChange={handleChange("confirmPassword")}
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
          </div>
        </Collapse>

        {/* Terms checkbox - sign up only */}
        <Collapse open={isSignup}>
          <div className="pb-5">
            <Checkbox
              id="acceptTerms"
              checked={values.acceptTerms}
              onChange={handleChange("acceptTerms")}
              label={TERMS_TEXT}
            />
          </div>
        </Collapse>

        {/* Forgot password - log in only */}
        <Collapse open={!isSignup}>
          <div className="pb-5">
            <div className="text-right mt-[8px]">
              <LinkButton onClick={() => {}}>
                {FORGOT_PASSWORD_TEXT}
              </LinkButton>
            </div>
          </div>
        </Collapse>

        <Button type="submit" onClick={handleSubmit}>
          {copy.submitLabel}
        </Button>

        <div className="text-center mt-5">
          <span className="text-[#9a9a9a] text-[13.5px]">{copy.swapText}</span>{" "}
          <LinkButton
            onClick={() => setMode(isSignup ? AUTH_MODES.LOGIN : AUTH_MODES.SIGNUP)}
          >
            {copy.swapAction}
          </LinkButton>
        </div>
      </form>
    </GlassCard>
  );
}

export default AuthCard;
