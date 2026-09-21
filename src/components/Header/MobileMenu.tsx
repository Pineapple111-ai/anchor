import { menuGroups } from "./menu";

export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div
      id="mobile-menu"
      className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-white lg:hidden"
    >
      <div className="flex gap-2 border-b border-line px-5 py-4">
        <a
          href="#"
          className="flex-1 rounded-md bg-ink py-3 text-center text-[15px] font-medium text-white"
        >
          로그인
        </a>
        <a
          href="#"
          className="flex-1 rounded-md border border-ink py-3 text-center text-[15px] font-medium text-ink"
        >
          가입
        </a>
      </div>
      <ul>
        {menuGroups.map((g) => (
          <li key={g.id} className="border-b border-line">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-serif text-[18px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {g.label}
                <svg
                  viewBox="0 0 20 20"
                  className="h-4 w-4 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="m5 8 5 5 5-5" />
                </svg>
              </summary>
              <ul className="bg-chalk px-5 pb-3">
                {g.items.map((it) => (
                  <li key={it.label}>
                    <a
                      href={it.href}
                      onClick={onClose}
                      className="block py-2.5 text-[15px] text-ink"
                    >
                      {it.label}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
