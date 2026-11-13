"use client";

function Logo({ isFilled = false, variant = 'auth', className }: { isFilled?: boolean; variant?: string; className?: string }) {
  const isHeader = variant === 'header';

  const boxClasses = isHeader
    ? 'w-[26px] h-[26px] rounded-full grid place-items-center bg-black'
    : [
        'w-[30px] h-[30px] rounded-full grid place-items-center transition-colors duration-500',
        isFilled ? 'bg-black' : 'bg-zinc-700',
      ].join(' ');

  const iconSize = isHeader ? 22 : 24;

  return (
    <div className="flex items-center justify-center gap-2.5">
      <div className={boxClasses}>
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12 2C12 9 14 11 22 12C14 13 12 15 12 22C12 15 10 13 2 12C10 11 12 9 12 2Z" fill="#FFFFFF" />
        </svg>
      </div>
      <span className="font-bold text-base tracking-wide text-[var(--mh-text)]">
        MangaHub
      </span>
    {className && <span className={className} aria-hidden="true" />}
    </div>
  );
}

export default Logo;
