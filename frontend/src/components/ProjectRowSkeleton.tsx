export function ProjectRowSkeleton() {
  return (
    <div className="mb-2.5 flex items-center gap-4 rounded-lg border border-slate bg-ink-2 p-4">
      <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-slate" />
      <span className="h-4 w-24 shrink-0 animate-pulse rounded bg-slate" />
      <span className="h-4 w-full max-w-md animate-pulse rounded bg-slate" />
    </div>
  );
}
