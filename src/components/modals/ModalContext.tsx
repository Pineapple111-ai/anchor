"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type ModalName = "apply" | "status" | "consult" | "eligibility" | null;

type ModalContextValue = {
  active: ModalName;
  open: (name: Exclude<ModalName, null>) => void;
  close: () => void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<ModalName>(null);
  const open = useCallback((name: Exclude<ModalName, null>) => setActive(name), []);
  const close = useCallback(() => setActive(null), []);
  const value = useMemo(() => ({ active, open, close }), [active, open, close]);
  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal은 ModalProvider 내부에서만 사용할 수 있습니다.");
  return ctx;
}
