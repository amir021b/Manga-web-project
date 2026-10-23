function PasswordToggle({ visible, onToggle, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-label={visible ? "Hide password" : "Show password"}
      aria-pressed={visible}
      className={[
        "h-9 px-2.5 rounded-lg",
        "text-[13px] font-medium text-[#9a9a9a]",
        "hover:text-[#f5f5f5]",
        "bg-transparent",
        "focus-visible:outline-2 focus-visible:outline-white/60 focus-visible:outline-offset-2",
        "cursor-pointer",
        "transition-colors duration-200 motion-reduce:transition-none",
        disabled ? "cursor-not-allowed" : "",
      ].join(" ")}
    >
      {visible ? "Hide" : "Show"}
    </button>
  );
}

export default PasswordToggle;