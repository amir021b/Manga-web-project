/**
 * LinkButton - a button styled as a muted text link.
 *
 * @param {string} [type="button"] - The button type attribute.
 * @param {import('react').ReactNode} children - Link label content.
 * @param {(event: React.MouseEvent<HTMLButtonElement>) => void} [onClick] - Click handler.
 * @returns {import('react').ReactElement}
 */
function LinkButton({ type = "button", children, onClick }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={[
        "text-[13px] text-[#9a9a9a] underline underline-offset-4",
        "hover:text-white",
        "focus-visible:outline-2 focus-visible:outline-white/60 focus-visible:outline-offset-2",
        "transition-colors duration-200 motion-reduce:transition-none",
        "cursor-pointer",
        "bg-transparent border-none p-0",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default LinkButton;