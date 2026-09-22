"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { notices, pressReleases } from "./notices";

const tabs = [
  { id: "notice", label: "공지사항", posts: notices },
  { id: "press", label: "보도자료", posts: pressReleases },
] as const;

export default function NoticeTabs() {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("notice");
  const [openTitle, setOpenTitle] = useState<string | null>(null);
  const baseId = useId();
  const current = tabs.find((t) => t.id === active)!;

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const i = tabs.findIndex((t) => t.id === active);
    const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    setActive(next.id);
    setOpenTitle(null);
    document.getElementById(`${baseId}-${next.id}`)?.focus();
  };

  return (
    <div>
      <div className="border-b border-ink">
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
                onClick={() => {
                  setActive(t.id);
                  setOpenTitle(null);
                }}
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
      </div>

      <ul id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-${active}`} className="divide-y divide-line">
        {current.posts.map((p) => {
          const expanded = openTitle === p.title;
          return (
            <li key={p.title}>
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setOpenTitle(expanded ? null : p.title)}
                className="flex w-full flex-col gap-1 py-4 text-left sm:flex-row sm:items-baseline sm:gap-6"
              >
                <span
                  className={`flex-1 text-[17px] leading-7 underline-offset-4 ${expanded ? "font-bold text-harbor" : ""}`}
                >
                  {p.title}
                </span>
                <span className="flex items-center gap-3 sm:shrink-0">
                  <time className="text-[14px] tabular-nums text-muted sm:w-[88px] sm:text-right">{p.date}</time>
                  <svg
                    viewBox="0 0 20 20"
                    className={`h-4 w-4 shrink-0 text-muted transition-transform ${expanded ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="m5 8 5 5 5-5" />
                  </svg>
                </span>
              </button>
              {expanded && (
                <p className="pb-5 pr-4 text-[15px] leading-7 text-muted sm:pr-24">{p.content}</p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
