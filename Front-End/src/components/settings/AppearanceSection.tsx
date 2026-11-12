import type { AccentOption, DensityOption } from '../../context/ThemeContext';


interface AppearanceSectionProps {
  accent: string;
  setAccent: (id: string) => void;
  density: string;
  setDensity: (id: string) => void;
  ACCENT_OPTIONS: AccentOption[];
  DENSITY_OPTIONS: DensityOption[];
}

function AppearanceSection({ accent, setAccent, density, setDensity, ACCENT_OPTIONS, DENSITY_OPTIONS }: AppearanceSectionProps) {
  const handleAccent = (id: string) => setAccent(id);
  const handleDensity = (id: string) => setDensity(id);

  const accentBtn = (option: AccentOption) => {
    const active = accent === option.id;
    return (
      <button
        key={option.id}
        type="button"
        onClick={() => handleAccent(option.id)}
        aria-pressed={active}
        className={[
          'flex flex-col items-center justify-center gap-1.5 rounded-[10px] border px-3 py-2.5 text-xs font-medium transition duration-200',
          active
            ? 'border-[var(--mh-border)] bg-[var(--mh-surface-strong)] text-[var(--mh-text)] shadow-[0_0_0_1px_var(--mh-accent)]'
            : 'border-[var(--mh-border)] text-[var(--mh-text-secondary)] hover:border-[var(--mh-border-soft)] hover:bg-[var(--mh-surface)]',
        ].join(' ')}
      >
        <span
          className={[
            'h-3 w-3 rounded-full',
            active ? 'bg-[var(--mh-accent)] shadow-[0_0_8px_var(--mh-accent-soft)]' : 'bg-[var(--mh-surface)] border border-[var(--mh-border)]',
          ].join(' ')}
        />
        <span>{option.label}</span>
      </button>
    );
  };

  const densityBtn = (option: DensityOption) => {
    const active = density === option.id;
    return (
      <button
        key={option.id}
        type="button"
        onClick={() => handleDensity(option.id)}
        aria-pressed={active}
        className={[
          'rounded-[10px] border px-4 py-2.5 text-xs font-medium transition duration-200',
          active
            ? 'border-[var(--mh-border)] bg-[var(--mh-surface-strong)] text-[var(--mh-text)] shadow-[0_0_0_1px_var(--mh-accent)]'
            : 'border-[var(--mh-border)] text-[var(--mh-text-secondary)] hover:border-[var(--mh-border-soft)] hover:bg-[var(--mh-surface)]',
        ].join(' ')}
      >
        {option.label}
      </button>
    );
  };

  return (
    <>
      <div className="space-y-3 pt-3 border-t border-[var(--mh-border)]">
        <label className="text-xs font-semibold text-[var(--mh-text-secondary)] uppercase tracking-wider">Theme accent color</label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-3">
          {ACCENT_OPTIONS.map(accentBtn)}
        </div>
        <p className="text-xs text-[var(--mh-text-muted)]">Subtle UI highlights throughout the app.</p>
      </div>

      <div className="space-y-3 pt-3 border-t border-[var(--mh-border)]">
        <label className="text-xs font-semibold text-[var(--mh-text-secondary)] uppercase tracking-wider">UI density / card style</label>
        <div className="flex gap-2">
          {DENSITY_OPTIONS.map(densityBtn)}
        </div>
        <p className="text-xs text-[var(--mh-text-muted)]">Adjusts card padding and spacing across pages.</p>
      </div>
    </>
  );
}

export default AppearanceSection;
