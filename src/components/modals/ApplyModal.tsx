"use client";

import { useState, type FormEvent } from "react";
import Modal from "./Modal";
import { formatDigitsWithCommas, formatPhoneInput, stripNonDigits } from "@/lib/format";

const guaranteeTypes = ["대출금 지급 보증", "계약 보증", "하자 보수 보증", "창업 자금 보증", "임대차 보증"];
const periods = ["1년", "2년", "5년", "10년"];
const amountPresets = [
  { label: "1천만원", value: "10000000" },
  { label: "3천만원", value: "30000000" },
  { label: "5천만원", value: "50000000" },
  { label: "1억원", value: "100000000" },
  { label: "직접입력", value: "custom" },
];

const inputCls =
  "mt-1.5 w-full rounded-md border border-line px-3.5 py-2.5 text-[15px] outline-none focus:border-harbor focus:ring-1 focus:ring-harbor";
const labelCls = "text-[14px] font-medium text-ink";

export default function ApplyModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [business, setBusiness] = useState("");
  const [type, setType] = useState(guaranteeTypes[0]);
  const [amountChoice, setAmountChoice] = useState(amountPresets[0].value);
  const [customAmount, setCustomAmount] = useState("");
  const [period, setPeriod] = useState(periods[0]);
  const [result, setResult] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finalAmount = amountChoice === "custom" ? stripNonDigits(customAmount) : amountChoice;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, business, type, amount: Number(finalAmount), period }),
      });
      const json = (await res.json()) as { guaranteeNumber?: string; error?: string };
      if (!res.ok || !json.guaranteeNumber) {
        setError(json.error ?? "신청 처리 중 오류가 발생했습니다.");
        return;
      }
      setResult(json.guaranteeNumber);
    } catch {
      setError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
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
              <dd>{finalAmount ? `${Number(finalAmount).toLocaleString()}원` : "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">보증 기간</dt>
              <dd>{period}</dd>
            </div>
          </dl>
          <p className="mt-4 text-[13px] text-muted">
            위 보증번호로 진행 현황 조회에서 상태를 확인할 수 있습니다. 이름과 연락처로도 조회할 수
            있으니 잊어버리지 않으셔도 됩니다.
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
          입력하신 정보는 신청 접수와 진행 현황 조회를 위해서만 사용됩니다.
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
              onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
              inputMode="numeric"
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
            보증 금액
            <select
              value={amountChoice}
              onChange={(e) => setAmountChoice(e.target.value)}
              className={inputCls}
            >
              {amountPresets.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
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
        {amountChoice === "custom" && (
          <label className={`block ${labelCls}`}>
            직접 입력 금액(원)
            <input
              required
              value={customAmount}
              onChange={(e) => setCustomAmount(formatDigitsWithCommas(e.target.value))}
              inputMode="numeric"
              className={inputCls}
              placeholder="45,000,000"
            />
          </label>
        )}
        {error && <p className="text-[13px] text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-ink py-3 text-[15px] font-medium text-white hover:bg-harbor disabled:opacity-60"
        >
          {submitting ? "처리 중…" : "신청하기"}
        </button>
      </form>
    </Modal>
  );
}
