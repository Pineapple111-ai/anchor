"use client";

import { useModal } from "@/components/modals/ModalContext";

const navLinks = [
  { label: "자주 찾는 서비스", href: "#services" },
  { label: "공지사항", href: "#notice" },
];

export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { open: openModal } = useModal();
  if (!open) return null;
  return (
    <div
      id="mobile-menu"
      className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-white lg:hidden"
    >
      <nav className="flex flex-col px-5 py-4">
        {navLinks.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={onClose}
            className="border-b border-line py-4 font-serif text-[18px] font-semibold text-ink"
          >
            {l.label}
          </a>
        ))}
        <button
          type="button"
          onClick={() => {
            onClose();
            openModal("apply");
          }}
          className="mt-6 rounded-md bg-ink py-3 text-center text-[15px] font-medium text-white"
        >
          보증 신청
        </button>
      </nav>
    </div>
  );
}
