import Button from "@/components/ui/Button";

interface TermsDialogProps {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
}

function TermsDialog({ open, onClose, onAccept }: TermsDialogProps) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-14 h-14 rounded-full border border-white/30 bg-white/5 flex items-center justify-center">
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
          <h2 className="text-2xl font-bold">Terms Accepted</h2>
          <p className="text-sm text-[#9a9a9a]">Thank you for agreeing to our terms.</p>
        </div>
        <div className="w-full mt-2">
          <Button type="button" onClick={onClose}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TermsDialog;
