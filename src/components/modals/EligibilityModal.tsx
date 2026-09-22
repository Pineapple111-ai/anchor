"use client";

import Modal from "./Modal";
import { useModal } from "./ModalContext";

const criteria = [
  { label: "대상", value: "설립 3년 이내, 연매출 30억 원 이하 개인·법인 사업자" },
  { label: "보증 한도", value: "최대 2억 원 (연매출의 1/2 이내)" },
  { label: "보증료율", value: "연 0.5% ~ 1.2% (신용등급에 따라 차등)" },
  { label: "심사 기간", value: "서류 접수 후 평균 5영업일" },
];

const documents = [
  "사업자등록증 사본",
  "최근 1년 부가가치세 과세표준증명원",
  "재무제표 또는 간이 손익 현황",
  "대표자 신분증 사본",
  "임대차계약서 사본 (해당 시)",
];

export default function EligibilityModal({ onClose }: { onClose: () => void }) {
  const { open } = useModal();
  return (
    <Modal title="창업 초기 기업 보증 대상 확인" onClose={onClose}>
      <section>
        <h3 className="text-[15px] font-bold">기준</h3>
        <dl className="mt-3 divide-y divide-line border-y border-line">
          {criteria.map((c) => (
            <div key={c.label} className="flex gap-4 py-3 text-[14px]">
              <dt className="w-24 shrink-0 text-muted">{c.label}</dt>
              <dd>{c.value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="mt-6">
        <h3 className="text-[15px] font-bold">필요 서류</h3>
        <ul className="mt-3 space-y-2 text-[14px]">
          {documents.map((d) => (
            <li key={d} className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
              {d}
            </li>
          ))}
        </ul>
      </section>
      <p className="mt-6 text-[13px] text-muted">
        실제 심사 기준이 아닌 가상의 예시 수치입니다. 정확한 조건은 상담을 통해 확인하세요.
      </p>
      <button
        type="button"
        onClick={() => {
          onClose();
          open("apply");
        }}
        className="mt-6 w-full rounded-md bg-ink py-3 text-[15px] font-medium text-white hover:bg-harbor"
      >
        보증 신청으로 이동
      </button>
    </Modal>
  );
}
