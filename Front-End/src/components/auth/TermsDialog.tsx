import Button from "@/components/ui/Button";

interface TermsDialogProps {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const TERMS_TEXT = `Terms of Use and Privacy Policy

Last updated: November 2026

Welcome to MangaHub. These terms govern your use of our website and services.

1. Acceptance of Terms
By accessing or using MangaHub, you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree to these terms, you may not use the service.

2. User Accounts
You may create an account to access certain features. You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.

3. Content and Conduct
You agree not to upload, post, or transmit any content that is unlawful, harmful, threatening, abusive, or infringes on the rights of others.

4. Privacy
Your privacy is important to us. Please review our Privacy Policy to understand our practices regarding your personal data, including how we collect, use, and share information.

5. Limitation of Liability
MangaHub is provided on an "as is" and "as available" basis. We disclaim all warranties, express or implied, including merchantability and fitness for a particular purpose.

6. Termination
We may terminate or suspend your account and access to the service at any time, without notice, for any reason.

7. Governing Law
These terms shall be governed by and construed in accordance with the laws of the applicable jurisdiction.

8. Changes to Terms
We may update these terms from time to time. Your continued use of the service constitutes acceptance of any changes.

By clicking "I Agree & Accept", you acknowledge that you have read, understood, and agree to be bound by these Terms of Use and Privacy Policy.`;

function TermsDialog({ open, onClose, onAccept }: TermsDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="relative z-10 w-full max-w-md mx-4 flex flex-col items-center justify-center">
        <div className="w-full rounded-xl bg-white/10 border border-white/20 p-6 max-h-[60vh] overflow-y-auto flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-white mb-2">Terms of Use and Privacy Policy</h2>
          <div className="text-sm text-[#cbd5e1] leading-relaxed">
            {TERMS_TEXT.split("\n\n").map((para, i) => (
              <p key={i} className="mb-3 whitespace-pre-line">
                {para}
              </p>
            ))}
          </div>
        </div>
        <div className="w-full mt-4 flex gap-3 justify-end">
          <Button
            type="button"
            onClick={onClose}
            className="bg-zinc-800 text-white hover:bg-zinc-700"
          >
            Decline
          </Button>
          <Button
            type="button"
            onClick={() => {
              onAccept();
              onClose();
            }}
          >
            I Agree & Accept
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TermsDialog;
