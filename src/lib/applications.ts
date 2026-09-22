export const STATUS_VALUES = [
  "접수 완료",
  "서류 심사 중",
  "심사 완료",
  "보험료 입금 대기",
  "보증서 발급 완료",
] as const;

export type ApplicationStatus = (typeof STATUS_VALUES)[number];

// 관리자가 직접 선택할 수 있는 상태(최초 접수 상태는 시스템이 자동으로 부여합니다)
export const ADMIN_SELECTABLE_STATUSES = STATUS_VALUES.slice(1);

export type Application = {
  id: string;
  guarantee_number: string;
  name: string;
  phone: string;
  business: string | null;
  type: string;
  amount: number;
  period: string;
  status: ApplicationStatus;
  certificate_data: string | null;
  premium_amount: number | null;
  payment_account: string | null;
  created_at: string;
};

export type ApplicationSummary = Pick<
  Application,
  | "guarantee_number"
  | "type"
  | "amount"
  | "period"
  | "status"
  | "certificate_data"
  | "premium_amount"
  | "payment_account"
  | "created_at"
>;

export function toSummary(app: Application): ApplicationSummary {
  return {
    guarantee_number: app.guarantee_number,
    type: app.type,
    amount: app.amount,
    period: app.period,
    status: app.status,
    certificate_data: app.certificate_data,
    premium_amount: app.premium_amount,
    payment_account: app.payment_account,
    created_at: app.created_at,
  };
}

// 보증서 이미지 업로드 용량 제한 (base64 인코딩 전 원본 기준)
export const CERTIFICATE_MAX_BYTES = 3 * 1024 * 1024;

export function generateGuaranteeNumber(): string {
  const year = new Date().getFullYear();
  const a = Math.floor(1000 + Math.random() * 9000);
  const b = Math.floor(1000 + Math.random() * 9000);
  return `${year}-${a}-${b}`;
}
