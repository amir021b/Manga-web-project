function FloatingInput({ id, label, type = "text", value, onChange, placeholder, autoComplete, name, disabled = false, endAdornment, error }) {
  return (
    <div className="group relative">
      <div className="relative h-[52px]">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={[
            "peer h-full w-full rounded-[11px] border-0 outline-none",
            endAdornment ? "pl-[14px] pr-16" : "px-[14px]",
            "bg-white/4 text-[#f5f5f5] text-[15px]",
            "placeholder-[#9a9a9a] placeholder:opacity-0",
            "focus:placeholder:opacity-100",
            "[:not(:placeholder-shown)]:placeholder:opacity-100",
            "transition-all duration-200 motion-reduce:transition-none",
            "disabled:opacity-100",
          ].join(" ")}
        />
        {endAdornment && (
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10">
            {endAdornment}
          </div>
        )}
        <label
          htmlFor={id}
          className={[
            "absolute z-20 left-[14px] top-1/2 -translate-y-1/2",
            "text-[15px] text-[#9a9a9a]",
            "pointer-events-none",
            "transition-all duration-200 motion-reduce:transition-none",
            "peer-[:not(:placeholder-shown)]:text-[#9a9a9a] peer-focus:text-[#f5f5f5] peer-[:autofill]:text-[#f5f5f5] peer-[:-webkit-autofill]:text-[#f5f5f5]",
            "peer-focus:top-0 peer-focus:left-[12px] peer-focus:-translate-y-1/2 peer-focus:text-[12px]",
            "peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-[12px] peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[12px]",
            "peer-[:autofill]:top-0 peer-[:autofill]:left-[12px] peer-[:autofill]:-translate-y-1/2 peer-[:autofill]:text-[12px] peer-[:-webkit-autofill]:top-0 peer-[:-webkit-autofill]:left-[12px] peer-[:-webkit-autofill]:-translate-y-1/2 peer-[:-webkit-autofill]:text-[12px]",
          ].join(" ")}
        >
          {label}
        </label>
        <fieldset
          aria-hidden="true"
          className={[
            "absolute top-[-6px] left-0 right-0 bottom-0 m-0 p-0",
            "rounded-[11px] pointer-events-none",
            error
              ? "border border-dashed border-white/55"
              : "border border-solid border-white/16",
            "px-2 min-w-0",
            "peer-[:not(:placeholder-shown)]:border-white/60 peer-focus:border-white/60",
            "peer-focus:shadow-[0_0_0_3px_rgba(255,255,255,0.14)]",
            "transition-all duration-200 motion-reduce:transition-none",
          ].join(" ")}
        >
          <legend
            className={[
              "block h-3 p-0 w-auto text-[12px] invisible whitespace-nowrap",
              "max-w-[0.01px] min-w-0",
              "group-focus-within:max-w-full group-has-[input:not(:placeholder-shown)]:max-w-full group-has-[input:-webkit-autofill]:max-w-full group-has-[input:autofill]:max-w-full",
              "transition-all duration-200 motion-reduce:transition-none",
            ].join(" ")}
          >
            <span className="px-1">{label}</span>
          </legend>
        </fieldset>
      </div>
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-[12.5px] text-[#d9d9d9] mt-1.5 ml-[4px]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default FloatingInput;
