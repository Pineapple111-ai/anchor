"use client";

import Icon, { type IconName } from "./icons";
import { useModal, type ModalName } from "@/components/modals/ModalContext";

type Item = { icon: IconName; title: string; desc: string; href?: string; action?: Exclude<ModalName, null> };

const items: Item[] = [
  { icon: "apply", title: "보증 신청", desc: "온라인으로 신청서를 작성하고 제출합니다.", action: "apply" },
  { icon: "calc", title: "보증료 계산", desc: "보증 금액과 기간으로 예상 보증료를 확인합니다.", href: "#" },
  { icon: "status", title: "진행 현황 조회", desc: "접수한 보증의 심사 단계를 확인합니다.", action: "status" },
  { icon: "docs", title: "필요 서류 안내", desc: "보증 유형별로 준비할 서류를 안내합니다.", action: "documents" },
  { icon: "book", title: "상담 예약", desc: "방문 또는 전화 상담 시간을 예약합니다.", action: "consult" },
  { icon: "payment", title: "보험료 납입", desc: "진행 상황과 납부할 보험료, 입금 계좌를 확인합니다.", action: "payment" },
];

export default function Shortcut() {
  const { open } = useModal();
  return (
    <section id="services" aria-labelledby="shortcut-title" className="bg-chalk scroll-mt-20">
      <div className="mx-auto max-w-[1280px] px-5 py-14 lg:px-8 lg:py-[72px]">
        <h2 id="shortcut-title" className="font-serif text-[26px] font-bold lg:text-[30px]">
          자주 찾는 서비스
        </h2>
        <ul className="mt-8 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => {
            const content = (
              <>
                <Icon
                  name={it.icon}
                  className="mt-0.5 h-8 w-8 shrink-0 text-harbor transition-colors group-hover:text-brass"
                />
                <span>
                  <span className="block text-[18px] font-bold group-hover:underline group-hover:underline-offset-4">
                    {it.title}
                  </span>
                  <span className="mt-1.5 block text-[15px] leading-6 text-muted">{it.desc}</span>
                </span>
              </>
            );
            return (
              <li key={it.title}>
                {it.action ? (
                  <button
                    type="button"
                    onClick={() => open(it.action!)}
                    className="group flex w-full items-start gap-4 border-t border-line py-6 text-left lg:py-7"
                  >
                    {content}
                  </button>
                ) : (
                  <a
                    href={it.href}
                    className="group flex items-start gap-4 border-t border-line py-6 lg:py-7"
                  >
                    {content}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
