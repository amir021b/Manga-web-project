function Logo({ isFilled = false, variant = 'auth' }) {
  const isHeader = variant === 'header';

  const boxClasses = isHeader
    ? 'w-[26px] h-[26px] rounded-full grid place-items-center bg-[var(--mh-surface)] border border-[var(--mh-border)] text-[var(--mh-text)]'
    : [
        'w-[30px] h-[30px] rounded-[9px] grid place-items-center',
        'transition duration-[450ms] shadow-[0_0_18px_rgba(0,0,0,0.25)]',
        isFilled
          ? 'bg-[var(--mh-surface)] border border-[var(--mh-border)] text-[var(--mh-text)]'
          : 'bg-[var(--mh-surface-strong)] border border-transparent text-[var(--mh-text-secondary)]',
      ].join(' ');

  const iconSize = isHeader ? 16 : 18;
  const starFill = isHeader ? 'white' : 'currentColor';
  const starStroke = isHeader ? 'white' : 'currentColor';

  return (
    <div className="flex items-center justify-center gap-2.5">
      <div className={boxClasses}>
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2.5l2.9 6.2 6.8 .8-5 4.7 1.3 6.7L12 17.5l-6 3.4 1.3-6.7-5-4.7 6.8-.8z"
            fill={starFill}
            stroke={starStroke}
            strokeWidth={1.4}
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="font-bold text-base tracking-wide text-[var(--mh-text)]">
        MangaHub
      </span>
    </div>
  );
}

export default Logo;
