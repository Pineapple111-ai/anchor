"use client";

import { menuGroups } from "./menu";

type Props = {
  openId: string | null;
  onOpen: (id: string | null) => void;
};

export default function GNB({ openId, onOpen }: Props) {
  return (
    <nav aria-label="주 메뉴" className="hidden lg:block">
      <ul className="flex items-center">
        {menuGroups.map((g) => {
          const active = openId === g.id;
          return (
            <li key={g.id}>
              <button
                type="button"
                aria-expanded={active}
                aria-controls="mega-panel"
                onMouseEnter={() => onOpen(g.id)}
                onFocus={() => onOpen(g.id)}
                onClick={() => onOpen(active ? null : g.id)}
                className={`relative h-[72px] px-[18px] text-[16px] font-medium transition-colors ${
                  active ? "text-harbor" : "text-ink"
                }`}
              >
                {g.label}
                <span
                  className={`absolute inset-x-[18px] bottom-0 h-[3px] bg-brass transition-transform origin-left ${
                    active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
