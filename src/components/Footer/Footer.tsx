import { LogoMark } from "@/components/Header/Logo";

const policyLinks = ["개인정보처리방침", "이용약관", "이메일 무단수집 거부", "사이트맵"];
const relatedSites = ["앵커 창업지원센터", "앵커 재단", "앵커 채용 사이트"];
const socials = ["유튜브", "인스타그램", "블로그"];

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-[1280px] px-5 py-12 lg:px-8 lg:py-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <span className="flex items-center gap-2.5">
            <LogoMark className="h-8 w-8 text-white" />
            <span className="font-serif text-[22px] font-bold">앵커보증</span>
          </span>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
            {policyLinks.map((l, i) => (
              <li key={l}>
                <a href="#" className={`hover:underline ${i === 0 ? "font-bold" : "text-white/80"}`}>
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-8 border-t border-white/15 pt-8 lg:flex-row lg:justify-between">
          <dl className="space-y-2 text-[14px] leading-6 text-white/75">
            <div className="flex gap-4">
              <dt className="w-14 shrink-0 text-white/50">주소</dt>
              <dd>서울특별시 00구 00로 000, 앵커타워</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-14 shrink-0 text-white/50">고객센터</dt>
              <dd className="tabular-nums">1500-0000 (평일 09:00 – 18:00)</dd>
            </div>
            <div className="flex gap-4">
              <dt className="w-14 shrink-0 text-white/50">이메일</dt>
              <dd>contact@anchor-guarantee.example</dd>
            </div>
          </dl>

          <div className="flex flex-col gap-5 lg:items-end">
            <ul className="flex gap-5 text-[14px]">
              {socials.map((s) => (
                <li key={s}>
                  <a href="#" className="text-white/80 hover:text-white hover:underline">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
            <details className="group relative w-full max-w-[260px]">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-md border border-white/30 px-4 py-2.5 text-[14px] [&::-webkit-details-marker]:hidden">
                관련 사이트
                <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="m5 8 5 5 5-5" />
                </svg>
              </summary>
              <ul className="absolute inset-x-0 top-full z-10 mt-1 rounded-md border border-line bg-white py-1 text-[14px] text-ink">
                {relatedSites.map((s) => (
                  <li key={s}>
                    <a href="#" className="block px-4 py-2 hover:bg-mist">
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </div>

        <div className="mt-8 border-t border-white/15 pt-6 text-[13px] leading-6 text-white/65">
          <p>
            이 사이트는 디자인 포트폴리오를 위한 컨셉 프로젝트이며, 실제 보증·금융 서비스를 제공하는
            어떤 기관과도 관련이 없습니다. 화면에 표시된 상품, 연락처, 문구는 모두 가상입니다.
          </p>
          <p className="mt-2">© 2026 Anchor Guarantee Concept Project.</p>
        </div>
      </div>
    </footer>
  );
}
