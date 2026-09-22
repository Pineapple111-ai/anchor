"use client";

import { useState, type FormEvent } from "react";
import Modal from "./Modal";
import { lookupStatus, statusSteps } from "@/lib/mock";

export default function StatusModal({ onClose }: { onClose: () => void }) {
  const [number, setNumber] = useState("");
  const [result, setResult] = useState<ReturnType<typeof lookupStatus>>(undefined as never);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setResult(lookupStatus(number));
    setSubmitted(true);
  };

  return (
    <Modal title="진행 현황 조회" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block text-[14px] font-medium text-ink">
          보증번호
          <input
            required
            value={number}
            onChange={(e) => {
              setNumber(e.target.value);
              setSubmitted(false);
            }}
            placeholder="예: 2026-1234-5678"
            className="mt-1.5 w-full rounded-md border border-line px-3.5 py-2.5 text-[15px] outline-none focus:border-harbor focus:ring-1 focus:ring-harbor"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-md bg-ink py-3 text-[15px] font-medium text-white hover:bg-harbor"
        >
          조회하기
        </button>
      </form>

      {submitted && (
        <div className="mt-6 border-t border-line pt-6">
          {result ? (
            <>
              <p className="text-[14px] text-muted">
                보증번호 <span className="font-medium text-ink">{number.trim()}</span>의 현재 상태
              </p>
              <p className="mt-2 font-serif text-[24px] font-bold text-harbor">{result.step}</p>
              <ol className="mt-5 space-y-2">
                {statusSteps.map((step, i) => (
                  <li key={step} className="flex items-center gap-3 text-[14px]">
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[12px] font-bold ${
                        i <= result.index ? "bg-harbor text-white" : "bg-mist text-muted"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className={i <= result.index ? "text-ink" : "text-muted"}>{step}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-5 text-[13px] text-muted">
                실제 심사 데이터가 아닌, 입력한 보증번호를 바탕으로 만든 데모 결과입니다.
              </p>
            </>
          ) : (
            <p className="text-[14px] text-muted">보증번호를 입력해 주세요.</p>
          )}
        </div>
      )}
    </Modal>
  );
}
