"use client";

import { useState, type FormEvent } from "react";
import Modal from "./Modal";
import { generateGuaranteeNumber } from "@/lib/mock";

const guaranteeTypes = ["계약 보증", "지급 보증", "하자 보수 보증", "창업 자금 보증", "임대차 보증"];
const periods = ["6개월", "12개월", "24개월", "36개월"];

const inputCls =
  "mt-1.5 w-full rounded-md border border-line px-3.5 py-2.5 text-[15px] outline-none focus:border-harbor focus:ring-1 focus:ring-harbor";
const labelCls = "text-[14px] font-medium text-ink";

export default function ApplyModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [business, setBusiness] = useState("");
  const [type, setType] = useState(guaranteeTypes[0]);
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState(periods[0]);
  const [result, setResult] = useState<string | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setResult(generateGuaranteeNumber());
  };

  if (result) {
    return (
      <Modal title="보증 신청 완료" onClose={onClose}>
        <div className="text-center">
          <p className="text-[15px] text-muted">보증 신청이 접수되었습니다.</p>
          <p className="mt-4 rounded-lg bg-chalk py-5 font-serif text-[26px] font-bold tracking-wide text-harbor">
            {result}
          </p>
          <dl className="mt-5 space-y-2 rounded-md border border-line p-4 text-left text-[14px]">
            <div className="flex justify-between">
              <dt className="text-muted">신청인</dt>
              <dd>{name || "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">보증 유형</dt>
              <dd>{type}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">보증 금액</dt>
              <dd>{amount ? `${Number(amount).toLocaleString()}원` : "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">보증 기간</dt>
              <dd>{period}</dd>
            </div>
          </dl>
          <p className="mt-4 text-[13px] text-muted">
            위 보증번호로 진행 현황 조회에서 상태를 확인할 수 있습니다. 실제 심사·발급이 이루어지는
            기능은 아닌 디자인 예시입니다.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-md bg-ink py-3 text-[15px] font-medium text-white hover:bg-harbor"
          >
            닫기
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="보증 신청" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-5">
        <p className="text-[13px] leading-5 text-muted">
          입력하신 정보는 저장되지 않으며, 신청 결과 확인을 위한 데모 화면입니다.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <label className={labelCls}>
            이름
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
              placeholder="홍길동"
            />
          </label>
          <label className={labelCls}>
            연락처
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputCls}
              placeholder="010-0000-0000"
            />
          </label>
        </div>
        <label className={`block ${labelCls}`}>
          사업자명 <span className="font-normal text-muted">(선택)</span>
          <input
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            className={inputCls}
            placeholder="예시상사 주식회사"
          />
        </label>
        <label className={`block ${labelCls}`}>
          보증 유형
          <select value={type} onChange={(e) => setType(e.target.value)} className={inputCls}>
            {guaranteeTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className={labelCls}>
            보증 금액(원)
            <input
              required
              type="number"
              min={0}
              step={1000000}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputCls}
              placeholder="50000000"
            />
          </label>
          <label className={labelCls}>
            보증 기간
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className={inputCls}>
              {periods.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-ink py-3 text-[15px] font-medium text-white hover:bg-harbor"
        >
          신청하기
        </button>
      </form>
    </Modal>
  );
}
