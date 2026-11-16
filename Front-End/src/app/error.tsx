"use client";

import { useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen w-full bg-[var(--mh-bg)] px-4 py-24 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-[var(--mh-border)] bg-[var(--mh-card-bg)] p-8 text-center">
        <h1 className="text-2xl font-bold text-[var(--mh-text)]">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-[var(--mh-text-secondary)]">
          An unexpected error occurred. Please try again.
        </p>
        <div className="mt-6">
          <Button onClick={() => reset()}>Try again</Button>
        </div>
        <Link
          href="/"
          className="mt-4 inline-block text-xs text-[var(--mh-accent)] hover:underline"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
