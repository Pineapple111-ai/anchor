import Link from "next/link";

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="16" cy="7" r="3" />
      <path d="M16 10v17" />
      <path d="M10.5 15h11" />
      <path d="M5.5 19.5c.6 4.4 4.6 7.5 10.5 7.5s9.9-3.1 10.5-7.5" />
    </svg>
  );
}

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 text-ink" aria-label="앵커보증 홈">
      <LogoMark className="h-8 w-8 text-harbor" />
      <span className="font-serif text-[22px] font-bold tracking-tight">앵커보증</span>
    </Link>
  );
}
