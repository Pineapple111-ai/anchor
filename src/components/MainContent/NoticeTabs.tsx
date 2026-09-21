"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { notices, pressReleases } from "./notices";

const tabs = [
  { id: "notice", label: "공지사항", posts: notices },
  { id: "press", label: "보도자료", posts: pressReleases },
] as const;

export default function NoticeTabs() {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("notice");
  const baseId = useId();
  const current = tabs.find((t) => t.id === active)!;

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const i = tabs.findIndex((t) => t.id === active);
    const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    setActive(next.id);
    document.getElementById(`${baseId}-${next.id}`)?.focus();
  };

  return (
    <div>
      <div className="flex items-end justify-between border-b border-ink">
        <div role="tablist" aria-label="새 소식 종류" className="flex gap-7">
          {tabs.map((t) => {
            const selected = t.id === active;
            return (
              <button
                key={t.id}
                id={`${baseId}-${t.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(t.id)}
                onKeyDown={onKeyDown}
                className={`-mb-px border-b-[3px] pb-3 font-serif text-[22px] font-bold transition-colors ${
                  selected ? "border-brass text-ink" : "border-transparent text-muted hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <a href="#" className="pb-3 text-[14px] text-muted hover:text-ink hover:underline">
          더 보기
        </a>
      </div>

      <ul
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-${active}`}
        className="divide-y divide-line"
      >
        {current.posts.map((p) => (
          <li key={p.title}>
            <a
              href={p.href}
              className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6 hover:[&_span:first-child]:underline"
            >
              <span className="flex-1 text-[17px] leading-7 underline-offset-4">{p.title}</span>
              <time className="text-[14px] tabular-nums text-muted sm:w-[88px] sm:text-right">{p.date}</time>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
