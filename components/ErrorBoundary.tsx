"use client";

import { Button } from "./ui/button";

export function ErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">{error.message}</h2>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
