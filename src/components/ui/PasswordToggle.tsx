import { Eye, EyeOff } from 'lucide-react';

interface PasswordToggleProps {
  visible: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

function PasswordToggle({ visible, onToggle, disabled = false }: PasswordToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      onMouseDown={(e) => e.preventDefault()}
      disabled={disabled}
      aria-label={visible ? "Hide password" : "Show password"}
      aria-pressed={visible}
      className={[
        "h-9 w-9 p-0 rounded-lg flex items-center justify-center",
        "bg-transparent",
        "focus-visible:outline-2 focus-visible:outline-[var(--mh-text)]/60 focus-visible:outline-offset-2",
        "cursor-pointer",
        "transition-colors duration-200 motion-reduce:transition-none",
        disabled ? "cursor-not-allowed opacity-50" : "",
      ].join(" ")}
    >
      {visible ? (
        <EyeOff size={16} strokeWidth={1.5} className="text-[var(--mh-text-secondary)] hover:text-[var(--mh-text)]" />
      ) : (
        <Eye size={16} strokeWidth={1.5} className="text-[var(--mh-text-secondary)] hover:text-[var(--mh-text)]" />
      )}
    </button>
  );
}

export default PasswordToggle;
