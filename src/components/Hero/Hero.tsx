"use client";

import Certificate from "./Certificate";
import { useModal } from "@/components/modals/ModalContext";

export default function Hero() {
  const { open } = useModal();
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
            계약, 지급, 하자 보수까지. 필요한 보증을 메뉴에서 유형별로 찾아보세요.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => open("apply")}
              className="rounded-md bg-brass px-6 py-3.5 text-[16px] font-bold text-ink transition-colors hover:bg-white"
            >
              보증 신청하기
            </button>
            <button
              type="button"
              onClick={() => open("status")}
              className="rounded-md border border-white/40 px-6 py-3.5 text-[16px] font-medium text-white transition-colors hover:bg-white/10"
            >
              진행 현황 조회
            </button>
          </div>
        </div>
        <Certificate />
      </div>
    </section>
  );
}
