import { AUTH_MODES, AUTH_COPY } from '../../constants/authCopy';

function AuthTabs({ mode, onChange }) {
  const modes = [AUTH_MODES.LOGIN, AUTH_MODES.SIGNUP];
  const isSignup = mode === AUTH_MODES.SIGNUP;

  return (
    <div role="tablist" className="relative grid grid-cols-2 p-1 rounded-xl bg-white/6 border border-white/8 mb-6" >
      <span
        aria-hidden="true"
        className={[
          "absolute top-1 bottom-1 left-1",
          "w-[calc(50%_-_4px)] rounded-[9px]",
          "bg-white/14 shadow-[0_2px_10px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.18)]",
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
            onClick={() => onChange(tabMode)}
            className={[
              "relative z-10 py-2.5 text-sm font-medium bg-transparent border-none cursor-pointer",
              "transition-colors focus-visible:outline-2 focus-visible:outline-white/60 focus-visible:outline-offset-2",
              isActive ? "text-white" : "text-[#9a9a9a]",
            ].join(" ")}
          >
            {AUTH_COPY[tabMode].tabLabel}
          </button>
        );
      })}
    </div>
  );
}

export default AuthTabs
