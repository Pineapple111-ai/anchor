export function formatPhoneInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  const p1 = digits.slice(0, 3);
  const p2 = digits.slice(3, 7);
  const p3 = digits.slice(7, 11);
  if (digits.length <= 3) return p1;
  if (digits.length <= 7) return `${p1}-${p2}`;
  return `${p1}-${p2}-${p3}`;
}

export function formatGuaranteeNumberInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 12);
  const p1 = digits.slice(0, 4);
  const p2 = digits.slice(4, 8);
  const p3 = digits.slice(8, 12);
  if (digits.length <= 4) return p1;
  if (digits.length <= 8) return `${p1}-${p2}`;
  return `${p1}-${p2}-${p3}`;
}

export function formatDigitsWithCommas(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 12);
  if (!digits) return "";
  return Number(digits).toLocaleString();
}

export function stripNonDigits(raw: string): string {
  return raw.replace(/\D/g, "");
}
