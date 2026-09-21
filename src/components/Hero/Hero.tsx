import SearchBox from "@/components/Search";
import Certificate from "./Certificate";

export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="bg-ink text-white">
      <div className="mx-auto grid max-w-[1280px] items-center gap-14 px-5 py-14 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16 lg:px-8 lg:py-[92px]">
        <div>
          <h1
            id="hero-title"
            className="font-serif text-[34px] font-bold leading-[1.4] tracking-tight lg:text-[48px] lg:leading-[1.35]"
          >
            사업의 신뢰를
            <br />
            보증서 한 장으로 증명하세요
          </h1>
          <p className="mt-5 max-w-[34em] text-[16px] leading-7 text-white/75 lg:text-[18px] lg:leading-8">
            계약, 지급, 하자 보수까지. 필요한 보증을 검색하거나 메뉴에서 유형별로 찾아보세요.
          </p>
          <div className="mt-9 max-w-[620px]">
            <SearchBox />
          </div>
        </div>
        <Certificate />
      </div>
    </section>
  );
}
