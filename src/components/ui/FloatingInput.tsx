interface FloatingInputProps {
  id: string;
  label?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoComplete?: string;
  name?: string;
  disabled?: boolean;
  endAdornment?: React.ReactNode;
  leadingIcon?: React.ReactNode;
  error?: string;
  className?: string;
  variant?: "default" | "floating";
}

function FloatingInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  name,
  disabled = false,
  endAdornment,
  leadingIcon,
  error,
  className,
  variant = "default",
}: FloatingInputProps) {
  const isFloating = variant === "floating" && Boolean(label);

  return (
    <div className="group relative">
      <div className="relative">
        {leadingIcon && !isFloating && (
          <div
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-zinc-400"
            aria-hidden="true"
          >
            {leadingIcon}
          </div>
        )}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={isFloating ? " " : placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-label={isFloating ? undefined : label}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={[
            "w-full rounded-[20px] border border-white/10 bg-[#151517] px-4 py-3.5 text-white placeholder-zinc-500 text-[15px] cursor-text",
            isFloating
              ? endAdornment
                ? "peer pl-4 pr-16"
                : "peer pl-4 pr-4"
              : leadingIcon
                ? "pl-10 pr-4"
                : endAdornment
                  ? "pl-4 pr-16"
                  : "pl-4 pr-4",
            "transition-all duration-300 motion-reduce:transition-none",
            "disabled:opacity-100 cursor-not-allowed",
            error ? "border border-dashed border-white/55" : "",
            "focus:outline-none focus:border-white/40 focus:shadow-[0_0_20px_rgba(255,255,255,0.08)]",
            className || "",
          ].join(" ")}
        />
        {isFloating ? (
          <label
            htmlFor={id}
            className={[
              "pointer-events-none absolute left-4 top-0 z-10 -translate-y-1/2 select-none rounded-sm px-1 text-[11px] text-zinc-400",
              "bg-[#151517]",
              "transition-all duration-200 motion-reduce:transition-none",
              "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:bg-transparent peer-placeholder-shown:px-0 peer-placeholder-shown:text-[15px]",
              "peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:bg-[#151517] peer-focus:px-1 peer-focus:text-[11px]",
            ].join(" ")}
          >
            {label}
          </label>
        ) : null}
        {endAdornment && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
            {endAdornment}
          </div>
        )}
      </div>

      {error ? (
        <p id={`${id}-error`} role="alert" className="text-[12.5px] text-[#d9d9d9] mt-1 ml-[4px]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default FloatingInput;
