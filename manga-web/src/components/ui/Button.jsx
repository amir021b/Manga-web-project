/**
 * Button - a full-width, glass-style action button.
 *
 * @param {string} [type="button"] - The button type attribute.
 * @param {import('react').ReactNode} children - Button label content.
 * @param {boolean} [disabled] - When true, the button is disabled.
 * @param {(event: React.MouseEvent<HTMLButtonElement>) => void} [onClick] - Click handler.
 * @returns {import('react').ReactElement}
 */
function Button({ type = "button", children, disabled, onClick }) {
  return (
    <button
      type={type}
      disabled={disabled}
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
        disabled ? "opacity-50 cursor-not-allowed" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default Button;
