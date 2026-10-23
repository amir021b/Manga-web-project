/**
 * Checkbox - a custom-styled checkbox with a real underlying input.
 *
 * The real <input type="checkbox"> is visually hidden (sr-only) and marked
 * with `peer` so the custom box and label can react to its state via Tailwind
 * peer variants. Clicking the label toggles the checkbox via htmlFor.
 *
 * @param {string} id - The input id (also used for the label's htmlFor).
 * @param {boolean} checked - Whether the checkbox is checked.
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} onChange - Change handler.
 * @param {string} label - The label text shown next to the checkbox.
 * @returns {import('react').ReactElement}
 */
function Checkbox({ id, checked, onChange, label }) {
  return (
    <label
      className="flex items-start gap-3 cursor-pointer select-none"
      htmlFor={id}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <div
        className={[
          "relative flex items-center justify-center w-[18px] h-[18px] shrink-0",
          "rounded-[5px] border border-white/30 bg-white/4",
          "peer-checked:bg-white peer-checked:border-white",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-white/60 peer-focus-visible:ring-offset-2",
          "transition-all duration-200 motion-reduce:transition-none",
        ].join(" ")}
      >
        {checked && (
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      <span className="text-[13px] text-[#9a9a9a]">{label}</span>
    </label>
  );
}

export default Checkbox;