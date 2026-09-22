export function generateGuaranteeNumber(): string {
  const year = new Date().getFullYear();
  const a = Math.floor(1000 + Math.random() * 9000);
  const b = Math.floor(1000 + Math.random() * 9000);
  return `${year}-${a}-${b}`;
}

const STATUS_STEPS = ["접수 완료", "서류 심사 중", "심사 완료", "보증서 발급 완료"] as const;
export type StatusStep = (typeof STATUS_STEPS)[number];

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function lookupStatus(guaranteeNumber: string): { step: StatusStep; index: number } | null {
  const trimmed = guaranteeNumber.trim();
  if (!trimmed) return null;
  const h = hashString(trimmed);
  const index = h % STATUS_STEPS.length;
  return { step: STATUS_STEPS[index], index };
}

export const statusSteps = STATUS_STEPS;
