function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`
        relative isolate
        w-full max-w-[420px]
        px-5 pt-[40px] pb-[22px] sm:px-[30px] sm:pt-10 sm:pb-7
        rounded-[22px]
        bg-[var(--mh-gradient-bg)]
        backdrop-blur-[5px] backdrop-saturate-[130%] backdrop-brightness-[1.4]
        border border-[var(--mh-border)]
        shadow-[var(--mh-shadow-strong)] before:absolute before:inset-0 before:rounded-[inherit] before:-z-10 before:pointer-events-none before:bg-[radial-gradient(circle_at_top-left,white_8%,transparent_100%)]
      `.trim()}
    >
      {children}
    </div>
  )
}

export default GlassCard
