/**
 * FloatingInput - an outlined text field with a floating label (MUI-style).
 *
 * Presentational and fully controlled: the parent owns the value and handles
 * changes. This component renders nothing of its own beyond the input, label,
 * and border fieldset; it keeps no internal state.
 *
 * @param {string} id - The input id (also used for the label's htmlFor).
 * @param {string} label - The label text.
 * @param {"text"|"email"|"password"|...} [type="text"] - The input type.
 * @param {string} value - The controlled value.
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} onChange - Change handler.
 * @param {string} [placeholder] - Placeholder text.
 * @param {string} [autoComplete] - Autocomplete attribute.
 * @returns {import('react').ReactElement}
 */
function FloatingInput({ id, label, type = "text", value, onChange, placeholder, autoComplete }) {
  return (
    <div className="group relative h-[52px]">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={[
          "peer h-full w-full rounded-[11px] border-0 outline-none",
          "bg-white/4 text-[#f5f5f5] text-[15px] px-[14px]",
          "placeholder-[#9a9a9a] placeholder:opacity-0",
          "focus:placeholder:opacity-100",
          "[:not(:placeholder-shown)]:placeholder:opacity-100",
          "transition-all duration-200 motion-reduce:transition-none",
        ].join(" ")}
      />
      <label
        htmlFor={id}
        className={[
          "absolute z-20 left-[14px] top-1/2 -translate-y-1/2",
          "text-[15px] text-[#9a9a9a]",
          "pointer-events-none",
          "transition-all duration-200 motion-reduce:transition-none",
          "peer-[:not(:placeholder-shown)]:text-[#9a9a9a] peer-focus:text-[#f5f5f5]",
          "peer-focus:top-0 peer-focus:left-[12px] peer-focus:-translate-y-1/2 peer-focus:text-[12px]",
          "peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-[12px] peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[12px]",
        ].join(" ")}
      >
        {label}
      </label>
      {/* A fieldset with a legend draws the border instead of the input. The
          legend's width creates a real gap in the border line (the border
          doesn't render under the legend), so the background behind the field
          shows through. A solid background patch behind the label could never
          do that on a transparent / glass background. */}
      <fieldset
        aria-hidden="true"
        className={[
          "absolute top-[-6px] left-0 right-0 bottom-0 m-0 p-0",
          "rounded-[11px] pointer-events-none border border-solid border-white/16",
          "px-2 min-w-0",
          "peer-[:not(:placeholder-shown)]:border-white/60 peer-focus:border-white/60",
          "peer-focus:box-shadow-[0_0_0_3px_rgba(255,255,255,0.14)]",
          "transition-all duration-200 motion-reduce:transition-none",
        ].join(" ")}
      >
        <legend
          className={[
            "block h-3 p-0 w-auto text-[12px] invisible whitespace-nowrap",
            "max-w-[0.01px] min-w-0",
            "group-focus-within:max-w-full group-has-[input:not(:placeholder-shown)]:max-w-full",
            "transition-all duration-200 motion-reduce:transition-none",
          ].join(" ")}
        >
          <span className="px-1">{label}</span>
        </legend>
      </fieldset>
    </div>
  );
}

export default FloatingInput;
