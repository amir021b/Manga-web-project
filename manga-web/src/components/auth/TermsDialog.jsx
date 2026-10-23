import { useEffect, useRef } from "react";
import { TERMS_SECTIONS } from "../../constants/termsContent";
import Button from "../ui/Button";
import LinkButton from "../ui/LinkButton";

function TermsDialog({ open, onClose, onAccept }) {
  const dialogRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) {
        dialog.showModal();
      }
      document.body.style.overflow = "hidden";
    } else if (dialog.open) {
      dialog.close();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Keep parent state in sync when the dialog closes itself (Escape, backdrop, X).
  const handleNativeClose = () => {
    if (open) onClose();
  };

  const handleBackdropClick = (event) => {
    if (event.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="terms-title"
      onClose={handleNativeClose}
      onClick={handleBackdropClick}
      className={[
        "m-auto w-[calc(100%-2rem)] max-w-[520px]",
        "rounded-[22px] border border-white/[0.22] p-0",
        "bg-black/60 backdrop-blur-[5px] backdrop-saturate-[130%] backdrop-brightness-[1.4]",
        "bg-[linear-gradient(145deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.03)_45%,rgba(255,255,255,0.05)_100%)]",
        "text-[#f5f5f5] shadow-[0_30px_80px_rgba(0,0,0,0.75)]",
        "backdrop:bg-black/60 backdrop:backdrop-blur-sm",
      ].join(" ")}
    >
      <div className="flex flex-col max-h-[85vh]">
        <header className="flex items-center justify-between gap-3 px-5 pt-5 pb-3 sm:px-7">
          <h2 id="terms-title" className="text-lg font-bold">
            Terms of use and privacy policy
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="w-9 h-9 grid place-items-center rounded-lg text-[#9a9a9a] hover:text-white focus-visible:outline-2 focus-visible:outline-white/60 focus-visible:outline-offset-2 cursor-pointer bg-transparent border-none"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        <div
          ref={bodyRef}
          tabIndex={0}
          className="px-5 sm:px-7 overflow-y-auto max-h-[60vh] focus-visible:outline-2 focus-visible:outline-white/60 focus-visible:outline-offset-[-2px] outline-none"
        >
          <p className="text-sm text-[#9a9a9a] mb-4">
            This is sample text for a design preview and is not legal advice.
          </p>
          {TERMS_SECTIONS.map((section) => (
            <section key={section.title} className="mb-4">
              <h3 className="text-sm font-bold mb-1">{section.title}</h3>
              <p className="text-sm text-[#d9d9d9] leading-relaxed">{section.text}</p>
            </section>
          ))}
        </div>

        <footer className="flex items-center justify-end gap-3 px-5 py-4 sm:px-7">
          <LinkButton type="button" onClick={onClose}>
            Close
          </LinkButton>
          <div className="w-[140px]">
            <Button type="button" onClick={onAccept}>
              I agree
            </Button>
          </div>
        </footer>
      </div>
    </dialog>
  );
}

export default TermsDialog;