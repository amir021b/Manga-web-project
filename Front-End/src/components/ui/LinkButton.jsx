function LinkButton({ type = "button", children, onClick, disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        "text-[13px] text-[#9a9a9a] underline underline-offset-4",
        "hover:text-white",
        "focus-visible:outline-2 focus-visible:outline-white/60 focus-visible:outline-offset-2",
        "transition-colors duration-200 motion-reduce:transition-none",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        "bg-transparent border-none p-0",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default LinkButton;