export function ErrorState({ message, retry, retryLabel }: { message: string; retry: () => void; retryLabel: string }) {
  return (
    <div className="rounded-lg border border-slate bg-ink-2 p-6 text-center font-thai text-sm text-bone-dim">
      <p className="mb-2">{message}</p>
      <button type="button" onClick={retry} className="font-mono text-marigold underline underline-offset-2">
        {retryLabel}
      </button>
    </div>
  );
}
