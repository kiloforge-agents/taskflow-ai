export function Logo({ size = 22 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2 select-none">
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="2" y="3" width="6" height="14" rx="1.2" fill="#1a1a1a" />
        <rect x="9.5" y="3" width="6" height="9" rx="1.2" fill="#c2410c" />
        <rect x="17" y="3" width="5" height="6" rx="1.2" fill="#1a1a1a" />
        <circle cx="20.5" cy="18" r="2.6" fill="#c2410c" />
        <path
          d="M19.4 17.9 L20.2 18.7 L21.6 17.2"
          stroke="#f5f1e8"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-display text-[18px] tracking-tight font-semibold leading-none">
        Taskflow<span className="text-accent">AI</span>
      </span>
    </span>
  );
}
