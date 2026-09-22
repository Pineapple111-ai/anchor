"use client";

import Modal from "./Modal";

const byType: { type: string; docs: string[] }[] = [
  {
    type: "대출금 지급 보증 · 계약 보증",
    docs: ["사업자등록증 사본", "대표자 신분증 사본", "계약서 또는 발주서 사본"],
  },
  {
    type: "하자 보수 보증",
    docs: ["사업자등록증 사본", "준공확인서 또는 검사조서 사본", "하자보수 계약서 사본"],
  },
  {
    type: "창업 자금 보증",
    docs: ["사업자등록증 사본", "사업계획서", "최근 6개월 통장 거래내역"],
  },
  {
    type: "임대차 보증",
    docs: ["임대차계약서 사본", "대표자 신분증 사본", "등기부등본"],
  },
];

const common = ["최근 1년 부가가치세 과세표준증명원", "재무제표 또는 간이 손익 현황"];

export default function DocumentsModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="필요 서류 안내" onClose={onClose}>
      <p className="text-[13px] leading-5 text-muted">
        아래는 보증 유형별 준비 서류의 일반적인 예시입니다. 실제 필요 서류는 심사 과정에서 추가되거나
        줄어들 수 있습니다.
      </p>

      <div className="mt-5 space-y-5">
        {byType.map((g) => (
          <section key={g.type}>
            <h3 className="text-[15px] font-bold text-ink">{g.type}</h3>
            <ul className="mt-2 space-y-1.5 text-[14px] text-muted">
              {g.docs.map((d) => (
                <li key={d} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
                  {d}
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section>
          <h3 className="text-[15px] font-bold text-ink">공통 서류</h3>
          <ul className="mt-2 space-y-1.5 text-[14px] text-muted">
            {common.map((d) => (
              <li key={d} className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
                {d}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <p className="mt-6 rounded-md bg-chalk p-4 text-[13px] leading-6 text-ink">
        온라인으로 신청하면 본인인증 이후 공공 데이터 연계를 통해 사업자등록증, 과세표준증명원 등
        일부 서류가 자동으로 제출 처리될 수 있습니다. 이 경우 위 서류를 별도로 첨부하지 않아도
        됩니다.
      </p>
      <p className="mt-3 text-[13px] text-muted">
        실제 서류 자동 제출 기능이 동작하는 화면은 아닌 안내 문구입니다.
      </p>
    </Modal>
  );
}
