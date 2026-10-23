/**
 * Collapse - smoothly expands/collapses its children using a CSS grid trick.
 *
 * Uses grid-template-rows (0fr closed, 1fr open) with a transition so the
 * height animates smoothly from zero to content size without needing to know
 * the content height in advance. The inner div has pt-2 and px-1/-mx-1 so
 * floating labels and focus rings inside the content are not clipped.
 *
 * When closed, the inner div gets `inert` and `aria-hidden` so it is not
 * focusable or announced by screen readers.
 *
 * @param {boolean} open - Whether the content is expanded.
 * @param {import('react').ReactNode} children - Content to collapse/expand.
 * @returns {import('react').ReactElement}
 */
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