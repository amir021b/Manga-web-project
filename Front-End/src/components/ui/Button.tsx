function Button({ type = "button", children, disabled, loading = false, loadingLabel, onClick, className, style }: { type?: "button" | "submit" | "reset"; children: React.ReactNode; disabled?: boolean; loading?: boolean; loadingLabel?: string; onClick?: () => void; className?: string; style?: React.CSSProperties }) {
  const isDisabled = disabled || loading;
  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading ? true : undefined}
      onClick={onClick}
      style={style}
      className={[
        "w-full h-12 rounded-2xl",
        "bg-white text-black font-bold text-[15px]",
        "shadow-[0_0_25px_rgba(255,255,255,0.25)]",
        "cursor-pointer",
        "transition-all duration-200 motion-reduce:transition-none",
        "hover:bg-zinc-100",
        "active:translate-y-[1px]",
        "focus-visible:outline-2 focus-visible:outline-white/60 focus-visible:outline-offset-2",
        isDisabled ? "opacity-50 cursor-not-allowed" : "",
        className || "",
      ].join(" ")}
    >
      {loading ? (
        <span className="inline-flex items-center justify-center gap-2">
          <span
            aria-hidden="true"
            className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin motion-reduce:animate-none"
          />
          <span>{loadingLabel || children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
