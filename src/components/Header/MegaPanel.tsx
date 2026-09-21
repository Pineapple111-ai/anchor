import { menuGroups } from "./menu";

export default function MegaPanel({ openId }: { openId: string | null }) {
  return (
    <div
      id="mega-panel"
      role="region"
      aria-label="전체 하위 메뉴"
      hidden={!openId}
      className="absolute inset-x-0 top-full hidden border-b border-line bg-white lg:block"
      style={{ display: openId ? undefined : "none" }}
    >
      <div className="mx-auto grid max-w-[1280px] grid-cols-6 gap-x-6 px-8 py-9">
        {menuGroups.map((g) => {
          const active = openId === g.id;
          return (
            <section key={g.id} className={active ? "" : "opacity-70"}>
              <h2
                className={`font-serif text-[17px] font-semibold ${
                  active ? "text-harbor" : "text-ink"
                }`}
              >
                {g.label}
              </h2>
              <p className="mt-1.5 min-h-[40px] text-[13px] leading-5 text-muted">{g.summary}</p>
              <ul className="mt-4 space-y-2.5 border-t border-line pt-4">
                {g.items.map((it) => (
                  <li key={it.label}>
                    <a
                      href={it.href}
                      className="text-[15px] text-ink transition-colors hover:text-harbor hover:underline"
                    >
                      {it.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
