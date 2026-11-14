function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`
        relative isolate
        w-full max-w-[420px]
        px-5 pt-[40px] pb-[22px] sm:px-[30px] sm:pt-10 sm:pb-7
        rounded-[24px]
        bg-[var(--mh-gradient-bg)]
        backdrop-blur-[5px] backdrop-saturate-[130%] backdrop-brightness-[1.4]
        border border-white/10
        shadow-[0_0_30px_rgba(255,255,255,0.15)]
      `.trim()}
    >
      {children}
    </div>
  )
}

export default GlassCard
