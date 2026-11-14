import { AUTH_MODES, AUTH_COPY } from '../../constants/authCopy';

interface AuthTabsProps {
  mode: string;
  onChange: (mode: string) => void;
  disabled?: boolean;
}

function AuthTabs({ mode, onChange, disabled = false }: AuthTabsProps) {
  const modes = [AUTH_MODES.LOGIN, AUTH_MODES.SIGNUP];
  const isSignup = mode === AUTH_MODES.SIGNUP;

  return (
    <div role="tablist" className="relative grid grid-cols-2 p-1 rounded-full bg-white/5 border border-white/10 mb-6">
      <span
        aria-hidden="true"
        className={[
          "absolute top-1 bottom-1 left-1",
          "w-[calc(50%_-_4px)] rounded-full",
          "bg-white text-black font-semibold shadow-[0_0_15px_rgba(255,255,255,0.3)]",
          "pointer-events-none transition-transform duration-350 ease-[cubic-bezier(0.3,0.8,0.3,1)] motion-reduce:transition-none",
          isSignup ? "translate-x-full" : "translate-x-0",
        ].join(" ")}
      />

      {modes.map((tabMode) => {
        const isActive = mode === tabMode;

        return (
          <button
            key={tabMode}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={disabled}
            onClick={() => onChange(tabMode)}
            className={[
              "relative z-10 py-2.5 text-sm font-medium bg-transparent border-none cursor-pointer",
              "transition-colors duration-300 motion-reduce:transition-none",
              isActive ? "text-black" : "text-zinc-400",
              disabled ? "cursor-not-allowed opacity-50" : "",
            ].join(" ")}
          >
            {AUTH_COPY[tabMode as keyof typeof AUTH_COPY].tabLabel}
          </button>
        );
      })}
    </div>
  );
}

export default AuthTabs;
