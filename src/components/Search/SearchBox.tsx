"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { menuGroups } from "@/components/Header/menu";
import { RECENT_KEY, RECENT_MAX, recommendedKeywords } from "./suggestions";

function readRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function writeRecent(list: string[]) {
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    /* 저장소를 쓸 수 없으면 무시 */
  }
}

const normalize = (s: string) => s.replace(/\s+/g, "").toLowerCase();

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>(readRecent);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputId = useId();

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const results = useMemo(() => {
    const q = normalize(query);
    if (!q) return [];
    return menuGroups.flatMap((g) =>
      g.items
        .filter((it) => normalize(it.label).includes(q))
        .map((it) => ({ ...it, group: g.label })),
    );
  }, [query]);

  const commit = (value: string) => {
    const v = value.trim();
    if (!v) return;
    const next = [v, ...recent.filter((r) => r !== v)].slice(0, RECENT_MAX);
    setRecent(next);
    writeRecent(next);
    setQuery(v);
    setOpen(true);
  };

  const removeRecent = (value: string) => {
    const next = recent.filter((r) => r !== value);
    setRecent(next);
    writeRecent(next);
  };

  const clearRecent = () => {
    setRecent([]);
    writeRecent([]);
  };

  return (
    <div ref={rootRef} className="relative">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          commit(query);
        }}
        className="flex h-[60px] items-center rounded-xl bg-white pl-5 pr-2 text-ink focus-within:ring-2 focus-within:ring-brass"
      >
        <label htmlFor={inputId} className="sr-only">
          통합 검색
        </label>
        <input
          id={inputId}
          type="search"
          value={query}
          autoComplete="off"
          placeholder="어떤 보증이 필요하세요?"
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          className="h-full min-w-0 flex-1 bg-transparent text-[17px] outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden"
        />
        <button
          type="submit"
          aria-label="검색"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-ink text-white transition-colors hover:bg-harbor"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4.5 4.5" />
          </svg>
        </button>
      </form>

      {open && (
        <div className="absolute inset-x-0 top-full z-30 mt-2 rounded-xl border border-line bg-white p-5 text-ink shadow-[0_18px_40px_-18px_rgba(18,35,63,0.45)]">
          {query.trim() ? (
            results.length > 0 ? (
              <ul>
                {results.map((r) => (
                  <li key={`${r.group}-${r.label}`}>
                    <a
                      href={r.href}
                      className="flex items-baseline justify-between gap-4 rounded-md px-2 py-2.5 hover:bg-mist"
                    >
                      <span className="text-[16px] font-medium">{r.label}</span>
                      <span className="text-[13px] text-muted">{r.group}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-2 py-3 text-[15px] text-muted">
                “{query.trim()}”와 일치하는 메뉴가 없습니다. 다른 검색어를 입력해 주세요.
              </p>
            )
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              <section>
                <div className="flex items-center justify-between">
                  <h2 className="text-[14px] font-bold">최근 검색어</h2>
                  {recent.length > 0 && (
                    <button type="button" onClick={clearRecent} className="text-[13px] text-muted hover:text-ink">
                      전체 삭제
                    </button>
                  )}
                </div>
                {recent.length > 0 ? (
                  <ul className="mt-3 space-y-1">
                    {recent.map((r) => (
                      <li key={r} className="flex items-center justify-between rounded-md hover:bg-mist">
                        <button
                          type="button"
                          onClick={() => commit(r)}
                          className="flex-1 px-2 py-2 text-left text-[15px]"
                        >
                          {r}
                        </button>
                        <button
                          type="button"
                          aria-label={`${r} 삭제`}
                          onClick={() => removeRecent(r)}
                          className="grid h-8 w-8 place-items-center text-muted hover:text-ink"
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                            <path d="M6 6l12 12M18 6 6 18" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-[14px] leading-6 text-muted">
                    검색한 내용이 여기에 표시됩니다.
                  </p>
                )}
              </section>
              <section>
                <h2 className="text-[14px] font-bold">추천 검색어</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {recommendedKeywords.map((k) => (
                    <li key={k}>
                      <button
                        type="button"
                        onClick={() => commit(k)}
                        className="rounded-full border border-line px-3.5 py-1.5 text-[14px] hover:border-harbor hover:text-harbor"
                      >
                        #{k.replace(/\s/g, "")}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
