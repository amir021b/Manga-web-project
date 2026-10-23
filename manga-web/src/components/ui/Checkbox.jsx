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