import { useState } from 'react';
import { AUTH_MODES, AUTH_COPY } from '../../constants/authCopy';
import GlassCard from '../ui/GlassCard';
import Logo from '../ui/Logo';
import AuthTabs from '../ui/AuthTabs';

/**
 * AuthCard - the login / sign up card.
 *
 * It owns the `mode` state; AuthTabs and the heading are controlled by it.
 * Nothing derived is stored in state: title and subtitle are computed from
 * `mode` during every render.
 *
 * @returns {import('react').ReactElement}
 */
function AuthCard() {
  const [mode, setMode] = useState(AUTH_MODES.LOGIN);
  const copy = AUTH_COPY[mode];

  return (
    <GlassCard>
      <Logo />
      <AuthTabs mode={mode} onChange={setMode} />
      <div>
        <h1 className="text-2xl font-bold mb-1.5">{copy.title}</h1>
        <p className="text-sm text-[#9a9a9a] mb-6">{copy.subtitle}</p>
      </div>
      {/* temporary spacer, remove when the form is added */}
      <div className="h-40" />
    </GlassCard>
  );
}

export default AuthCard
