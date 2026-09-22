"use client";

import { useModal } from "@/components/modals/ModalContext";

export default function Banner() {
  const { open } = useModal();
  return (
    <section aria-label="안내 배너" className="bg-chalk">
      <div className="mx-auto grid max-w-[1280px] gap-5 px-5 py-14 md:grid-cols-2 lg:px-8 lg:py-[72px]">
        <div className="group flex min-h-[200px] flex-col justify-between bg-harbor p-8 text-white">
          <span>
            <span className="block font-serif text-[26px] font-bold leading-[1.4]">
              창업 초기 기업의
              <br />
              보증 한도가 확대되었습니다
            </span>
            <span className="mt-3 block text-[15px] leading-6 text-white/80">
              설립 3년 이내 기업이 대상입니다. 조건을 먼저 확인해 보세요.
            </span>
          </span>
          <button
            type="button"
            onClick={() => open("eligibility")}
            className="mt-8 w-fit rounded-md bg-brass px-4 py-2.5 text-[15px] font-bold text-ink transition-colors hover:bg-white"
          >
            대상 확인하기
          </button>
        </div>
        <div className="group flex min-h-[200px] flex-col justify-between border border-ink p-8">
          <span>
            <span className="block font-serif text-[26px] font-bold leading-[1.4]">
              보증서를 전자로
              <br />
              받아보세요
            </span>
            <span className="mt-3 block text-[15px] leading-6 text-muted">
              신청 후 발급까지 온라인으로 끝나고, 보증서는 바로 내려받을 수 있습니다.
            </span>
          </span>
          <button
            type="button"
            onClick={() => open("apply")}
            className="mt-8 w-fit rounded-md border border-ink px-4 py-2.5 text-[15px] font-bold transition-colors hover:bg-ink hover:text-white"
          >
            전자 보증서 신청
          </button>
        </div>
      </div>
    </section>
  );
}
