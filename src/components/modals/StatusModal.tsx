"use client";

import { useState, type FormEvent } from "react";
import Modal from "./Modal";
import { formatGuaranteeNumberInput, formatPhoneInput } from "@/lib/format";
import type { ApplicationSummary } from "@/lib/applications";

type Mode = "number" | "identity";

export default function StatusModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<Mode>("number");
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [results, setResults] = useState<ApplicationSummary[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <Modal title="진행 현황 조회" onClose={onClose}>
      <div className="flex gap-1.5 rounded-lg bg-chalk p-1">
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
                    <span className="font-serif text-[18px] font-bold text-harbor">
                      {r.guarantee_number}
                    </span>
                    <span className="text-[13px] text-muted">{r.type}</span>
                  </div>
                  <p className="mt-2 text-[15px] font-medium text-ink">{r.status}</p>
                  <p className="mt-1 text-[13px] text-muted">
                    {r.amount.toLocaleString()}원 · {r.period} · 신청일{" "}
                    {new Date(r.created_at).toLocaleDateString("ko-KR")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Modal>
  );
}
