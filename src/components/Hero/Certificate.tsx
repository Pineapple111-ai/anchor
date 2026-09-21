import { LogoMark } from "@/components/Header/Logo";

function Seal() {
  return (
    <svg
      viewBox="0 0 88 88"
      className="seal-stamp absolute -bottom-3 right-3 h-[88px] w-[88px] text-brass"
      aria-hidden="true"
    >
      <g transform="rotate(-12 44 44)" fill="none" stroke="currentColor">
        <circle cx="44" cy="44" r="40" strokeWidth="3" />
        <circle cx="44" cy="44" r="34" strokeWidth="1" />
        <text x="44" y="42" textAnchor="middle" fontSize="19" fontWeight="700" fill="currentColor" stroke="none" fontFamily="var(--font-serif)">
          앵커
        </text>
        <text x="44" y="62" textAnchor="middle" fontSize="19" fontWeight="700" fill="currentColor" stroke="none" fontFamily="var(--font-serif)">
          보증
        </text>
      </g>
    </svg>
  );
}

const rows: [string, string][] = [
  ["보증번호", "2026-0421-0087"],
  ["피보증인", "예시상사 주식회사"],
  ["보증금액", "금 120,000,000원"],
  ["보증기간", "2026.10.01 ~ 2027.09.30"],
];

export default function Certificate() {
  return (
    <figure className="mx-auto w-full max-w-[420px] lg:rotate-[-2.5deg]">
      <div className="relative bg-white p-2 text-ink shadow-[0_28px_60px_-24px_rgba(0,0,0,0.6)]">
        <div className="border border-brass/70 p-6">
          <div className="flex items-center justify-between text-harbor">
            <span className="flex items-center gap-2 font-serif text-[15px] font-bold">
              <LogoMark className="h-6 w-6" />
              앵커보증
            </span>
            <span className="rounded-sm border border-line px-2 py-0.5 text-[12px] text-muted">예시</span>
          </div>
          <h2 className="mt-7 text-center font-serif text-[26px] font-bold tracking-[0.12em]">
            계약이행보증서
          </h2>
          <dl className="mt-7 divide-y divide-line border-y border-line">
            {rows.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-[13px] text-muted">{k}</dt>
                <dd className="text-[15px] font-medium tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-center font-serif text-[15px]">
            위 계약의 이행을 보증합니다.
          </p>
          <p className="mt-8 pr-[104px] text-right text-[13px] text-muted">앵커보증 대표이사</p>
          <div className="relative h-8">
            <Seal />
          </div>
        </div>
      </div>
      <figcaption className="mt-4 text-center text-[13px] text-white/60">
        실제 발급되는 보증서가 아닌 디자인 예시입니다.
      </figcaption>
    </figure>
  );
}
