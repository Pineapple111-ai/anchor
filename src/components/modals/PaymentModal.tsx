"use client";

import { useState, type FormEvent } from "react";
import Modal from "./Modal";
import { formatGuaranteeNumberInput, formatPhoneInput } from "@/lib/format";
import type { ApplicationSummary } from "@/lib/applications";

type Mode = "number" | "identity";

export default function PaymentModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<Mode>("number");
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [results, setResults] = useState<ApplicationSummary[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedFor, setCopiedFor] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setResults(null);
    try {
      const params = new URLSearchParams();
      if (mode === "number") {
        params.set("number", number.trim());
      } else {
        params.set("name", name.trim());
        params.set("phone", phone.trim());
      }
      const res = await fetch(`/api/applications/lookup?${params.toString()}`);
      const json = (await res.json()) as { results?: ApplicationSummary[]; error?: string };
      if (!res.ok) {
        setError(json.error ?? "조회 중 오류가 발생했습니다.");
        return;
      }
      setResults(json.results ?? []);
    } catch {
      setError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  const copyAccount = async (account: string) => {
    try {
      await navigator.clipboard.writeText(account);
      setCopiedFor(account);
      setTimeout(() => setCopiedFor(null), 1500);
    } catch {
      /* 클립보드 접근이 막힌 환경이면 조용히 무시합니다. */
    }
  };

  return (
    <Modal title="보험료 납입" onClose={onClose}>
      <p className="text-[13px] leading-5 text-muted">
        보증번호 또는 이름·연락처로 조회하면 현재 진행 상황과 납부할 보험료, 입금 계좌를 확인할 수
        있습니다.
      </p>

      <div className="mt-4 flex gap-1.5 rounded-lg bg-chalk p-1">
        {(
          [
            ["number", "보증번호로 조회"],
            ["identity", "이름·연락처로 조회"],
          ] as const
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setResults(null);
              setError(null);
            }}
            className={`flex-1 rounded-md py-2 text-[13px] font-medium transition-colors ${
              mode === m ? "bg-white text-ink shadow-sm" : "text-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        {mode === "number" ? (
          <label className="block text-[14px] font-medium text-ink">
            보증번호
            <input
              required
              value={number}
              onChange={(e) => setNumber(formatGuaranteeNumberInput(e.target.value))}
              inputMode="numeric"
              placeholder="2026-1234-5678"
              className="mt-1.5 w-full rounded-md border border-line px-3.5 py-2.5 text-[15px] outline-none focus:border-harbor focus:ring-1 focus:ring-harbor"
            />
          </label>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <label className="text-[14px] font-medium text-ink">
              이름
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                className="mt-1.5 w-full rounded-md border border-line px-3.5 py-2.5 text-[15px] outline-none focus:border-harbor focus:ring-1 focus:ring-harbor"
              />
            </label>
            <label className="text-[14px] font-medium text-ink">
              연락처
              <input
                required
                value={phone}
                onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                inputMode="numeric"
                placeholder="010-0000-0000"
                className="mt-1.5 w-full rounded-md border border-line px-3.5 py-2.5 text-[15px] outline-none focus:border-harbor focus:ring-1 focus:ring-harbor"
              />
            </label>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-ink py-3 text-[15px] font-medium text-white hover:bg-harbor disabled:opacity-60"
        >
          {loading ? "조회 중…" : "조회하기"}
        </button>
      </form>

      {error && <p className="mt-4 text-[13px] text-red-600">{error}</p>}

      {results && (
        <div className="mt-6 border-t border-line pt-6">
          {results.length === 0 ? (
            <p className="text-[14px] text-muted">일치하는 신청 내역을 찾을 수 없습니다.</p>
          ) : (
            <ul className="space-y-4">
              {results.map((r) => (
                <li key={r.guarantee_number} className="rounded-md border border-line p-4">
                  <div className="flex items-baseline justify-between">
                    <span className="font-serif text-[17px] font-bold text-harbor">
                      {r.guarantee_number}
                    </span>
                    <span className="text-[13px] text-muted">{r.type}</span>
                  </div>
                  <p className="mt-1.5 text-[14px] font-medium text-ink">진행 상황: {r.status}</p>

                  <div className="mt-3 divide-y divide-line rounded-md bg-chalk px-3.5">
                    <div className="flex items-center justify-between py-2.5 text-[14px]">
                      <span className="text-muted">납부할 보험료</span>
                      <span className="font-medium tabular-nums text-ink">
                        {r.premium_amount != null
                          ? `${r.premium_amount.toLocaleString()}원`
                          : "아직 안내되지 않았습니다"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2.5 text-[14px]">
                      <span className="text-muted">입금 계좌</span>
                      {r.payment_account ? (
                        <span className="flex items-center gap-2">
                          <span className="font-medium text-ink">{r.payment_account}</span>
                          <button
                            type="button"
                            onClick={() => copyAccount(r.payment_account!)}
                            className="text-[12px] text-harbor hover:underline"
                          >
                            {copiedFor === r.payment_account ? "복사됨" : "복사"}
                          </button>
                        </span>
                      ) : (
                        <span className="text-ink">아직 안내되지 않았습니다</span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Modal>
  );
}
