export function LoadingScreen() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="flex items-center gap-3 rounded-full border border-transparent hover:border-sky-500/25 hover:border-emerald-500/40 bg-[#12141B]/80 px-4 py-3 text-sm text-[#B7BDCB]">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#22C55E]" />
        Preparing your experience
      </div>
    </div>
  );
}
