function Button({ type = "button", children, disabled, loading = false, loadingLabel, onClick }) {
  const isDisabled = disabled || loading;
  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading ? true : undefined}
      onClick={onClick}
      className={[
        "w-full h-12 rounded-[11px]",
        "bg-[#f2f2f2] text-black font-bold text-[15px]",
        "shadow-[0_6px_24px_rgba(255,255,255,0.12)]",
        "cursor-pointer",
        "transition-all duration-200 motion-reduce:transition-none",
        "hover:bg-white hover:shadow-[0_6px_24px_rgba(255,255,255,0.25)]",
        "active:translate-y-[1px]",
        "focus-visible:outline-2 focus-visible:outline-white/60 focus-visible:outline-offset-2",
        isDisabled ? "opacity-50 cursor-not-allowed" : "",
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
