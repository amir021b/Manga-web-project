/**
 * GlassCard - a transparent frosted-glass container.
 *
 * @param {import('react').ReactNode} children - Content rendered inside the card.
 * @returns {import('react').ReactElement}
 */
function GlassCard({ children }) {
  return (
    <div
      className={`
        relative isolate
        w-full max-w-[420px]
        px-5 pt-[26px] pb-[22px] sm:px-[30px] sm:pt-8 sm:pb-7
        rounded-[22px]
        bg-[linear-gradient(145deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.015)_45%,rgba(255,255,255,0.04)_100%)]
        backdrop-blur-[9px] backdrop-saturate-[130%]
        border border-white/[0.22]
        shadow-[0_30px_80px_rgba(0,0,0,0.75),0_0_80px_rgba(255,255,255,0.07),inset_0_1px_0_rgba(255,255,255,0.35),inset_1px_0_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(255,255,255,0.06)]
        before:absolute before:inset-0 before:rounded-[inherit] before:-z-10 before:pointer-events-none before:bg-[radial-gradient(circle_at_top-left,white_8%,transparent_100%)]
      `.trim()}
    >
      {children}
    </div>
  )
}

export default GlassCard
