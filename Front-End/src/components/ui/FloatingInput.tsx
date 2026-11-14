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
}: FloatingInputProps) {
  return (
    <div className="group relative">
      <div className="relative">
        {leadingIcon && (
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
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-label={label}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={[
            "w-full rounded-[20px] border border-white/10 bg-zinc-900/80 px-4 py-3.5 text-white placeholder-zinc-500 text-[15px] cursor-text",
            leadingIcon ? "pl-10 pr-4" : endAdornment ? "pl-4 pr-16" : "pl-4 pr-4",
            "transition-all duration-300 motion-reduce:transition-none",
            "disabled:opacity-100 cursor-not-allowed",
            error ? "border border-dashed border-white/55" : "",
            "focus:outline-none focus:border-white/40 focus:shadow-[0_0_20px_rgba(255,255,255,0.08)]",
            className || "",
          ].join(" ")}
        />
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
