/**
 * Logo - MangaHub brand mark.
 *
 * A presentational component: it only renders what it is given through props
 * and has no state of its own.
 *
 * @param {boolean} [isFilled=false] - When true, the badge inverts
 *   (black background, white star, white border at ~45% opacity).
 * @returns {import('react').ReactElement}
 */
function Logo({ isFilled = false }) {
  return (
    <div className="flex items-center justify-center gap-2.5">
      <div
        className={[
          "w-[30px] h-[30px] rounded-[9px] grid place-items-center gap-2.5" ,
          "transition duration-[450ms] shadow-[0_0_18px_rgba(255,255,255,0.25)] gap-2.5" ,
          isFilled
            ? "bg-black border border-white/45 text-white"
            : "bg-[#f2f2f2] border border-transparent text-black",
        ].join(" ")}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2.5l2.9 6.2 6.8 .8-5 4.7 1.3 6.7L12 17.5l-6 3.4 1.3-6.7-5-4.7 6.8-.8z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={1.4}
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="font-bold text-base tracking-wide text-white/90">
        MangaHub
      </span>
    </div>
  )
}

export default Logo
