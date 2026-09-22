import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }
  const { id } = await params;

  let body: { premiumAmount?: number | string | null; paymentAccount?: string | null };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  let premiumAmount: number | null = null;
  if (body.premiumAmount !== undefined && body.premiumAmount !== null && body.premiumAmount !== "") {
    const n = Number(body.premiumAmount);
    if (!Number.isFinite(n) || n < 0) {
      return NextResponse.json({ error: "보험료는 0 이상의 숫자여야 합니다." }, { status: 400 });
    }
    premiumAmount = n;
  }
  const paymentAccount = body.paymentAccount?.trim() || null;

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch {
    return NextResponse.json(
      { error: "서버 설정이 완료되지 않았습니다. Supabase 환경 변수를 확인해 주세요." },
      { status: 500 },
    );
  }

  const { data, error } = await supabase
    .from("applications")
    .update({ premium_amount: premiumAmount, payment_account: paymentAccount })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "저장 중 오류가 발생했습니다." }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "신청 내역을 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({ application: data });
}
