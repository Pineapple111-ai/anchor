"use client";

import { useState, type FormEvent } from "react";
import Modal from "./Modal";

const timeSlots = ["오전 (09:00–12:00)", "점심 이후 (13:00–15:00)", "오후 (15:00–18:00)"];

export default function ConsultModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [time, setTime] = useState(timeSlots[0]);
  const [done, setDone] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setDone(true);
  };

  if (done) {
    return (
      <Modal title="상담 예약 완료" onClose={onClose}>
        <div className="text-center">
          <p className="text-[15px] leading-6 text-ink">
            <span className="font-bold">{name}</span>님, 상담 예약이 접수되었습니다.
          </p>
          <dl className="mt-5 space-y-2 rounded-md border border-line p-4 text-left text-[14px]">
            <div className="flex justify-between">
              <dt className="text-muted">연락처</dt>
              <dd>{phone}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">희망 시간</dt>
              <dd>{time}</dd>
            </div>
          </dl>
          <p className="mt-4 text-[13px] text-muted">
            담당자가 순서대로 연락드립니다. 실제로 접수되는 예약은 아닌 디자인 예시입니다.
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
    <Modal title="상담 예약" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block text-[14px] font-medium text-ink">
          이름
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-line px-3.5 py-2.5 text-[15px] outline-none focus:border-harbor focus:ring-1 focus:ring-harbor"
            placeholder="홍길동"
          />
        </label>
        <label className="block text-[14px] font-medium text-ink">
          연락처
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-line px-3.5 py-2.5 text-[15px] outline-none focus:border-harbor focus:ring-1 focus:ring-harbor"
            placeholder="010-0000-0000"
          />
        </label>
        <label className="block text-[14px] font-medium text-ink">
          상담 가능 시간
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-line px-3.5 py-2.5 text-[15px] outline-none focus:border-harbor focus:ring-1 focus:ring-harbor"
          >
            {timeSlots.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="w-full rounded-md bg-ink py-3 text-[15px] font-medium text-white hover:bg-harbor"
        >
          예약 신청
        </button>
      </form>
    </Modal>
  );
}
