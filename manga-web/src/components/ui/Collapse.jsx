function Collapse({ open, children }) {
  return (
    <div
      className={[
        "grid transition-[grid-template-rows] duration-[400ms] ease-[cubic-bezier(0.3,0.8,0.3,1)]",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        open ? "opacity-100" : "opacity-0",
        "motion-reduce:transition-none",
      ].join(" ")}
    >
      <div
        className="min-h-0 overflow-hidden pt-2 -mt-2 px-1 -mx-1"
        inert={!open}
        aria-hidden={!open}
      >
        {children}
      </div>
    </div>
  );
}

export default Collapse;