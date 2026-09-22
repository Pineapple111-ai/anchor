import NoticeTabs from "./NoticeTabs";

export default function MainContent() {
  return (
    <section id="notice" aria-label="새 소식과 고객센터" className="border-t border-line bg-white scroll-mt-20">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-14 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16 lg:px-8 lg:py-[72px]">
        <NoticeTabs />
        <aside aria-labelledby="cs-title" className="self-start border-t-4 border-brass bg-chalk p-7">
          <h2 id="cs-title" className="font-serif text-[22px] font-bold">
            고객센터
          </h2>
          <a
            href="tel:1500-0000"
            className="mt-4 block font-serif text-[36px] font-bold tabular-nums text-harbor"
          >
            1500-0000
          </a>
          <dl className="mt-3 space-y-1 text-[15px] leading-6 text-muted">
            <div className="flex gap-3">
              <dt className="w-14 shrink-0">평일</dt>
              <dd>09:00 – 18:00</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-14 shrink-0">점심</dt>
              <dd>12:00 – 13:00</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-14 shrink-0">휴무</dt>
              <dd>주말 및 공휴일</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
