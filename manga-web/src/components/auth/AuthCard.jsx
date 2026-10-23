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
        <Collapse open={isSignup}>
          <div className="pb-5">
            <FloatingInput
              id="username"
              name="username"
              label="Username"
              type="text"
              value={values.username}
              onChange={handleChange("username")}
              placeholder="yourname"
              autoComplete="nickname"
              disabled={!isSignup}
            />
          </div>
        </Collapse>

        <div className="pb-5">
          <FloatingInput
            id="email"
            name="email"
            label="Email"
            type="email"
            value={values.email}
            onChange={handleChange("email")}
            placeholder="you@example.com"
            autoComplete={isSignup ? "email" : "username"}
          />
        </div>

        <div className="pb-5">
          <FloatingInput
            id="password"
            name="password"
            label="Password"
            type="password"
            value={values.password}
            onChange={handleChange("password")}
            placeholder="At least 8 characters"
            autoComplete={isSignup ? "new-password" : "current-password"}
          />
        </div>

        <Collapse open={isSignup}>
          <div className="pb-5">
            <FloatingInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm password"
              type="password"
              value={values.confirmPassword}
              onChange={handleChange("confirmPassword")}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              disabled={!isSignup}
            />
          </div>
        </Collapse>

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
