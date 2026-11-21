function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`
        relative isolate
        w-full max-w-[420px]
        px-5 pt-[40px] pb-[22px] sm:px-[30px] sm:pt-10 sm:pb-7
        rounded-[24px]
        bg-white/[0.03]
        backdrop-blur-[6px]
        border border-white/15
        shadow-[var(--mh-shadow)]
      `.trim()}
    >
      {children}
    </div>
  )
}

export default GlassCard
