import Button from "../ui/Button";

function SuccessMessage({ title, message, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center text-center gap-4 animate-[fadeIn_200ms_ease-out] motion-reduce:animate-none">
      <div
        className="w-14 h-14 rounded-full border border-white/30 bg-white/5 flex items-center justify-center"
        aria-hidden="true"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div role="status" className="flex flex-col items-center gap-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-sm text-[#9a9a9a]">{message}</p>
      </div>
      <div className="w-full mt-2">
        <Button type="button" onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}

export default SuccessMessage;