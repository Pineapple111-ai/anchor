import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { ADMIN_SELECTABLE_STATUSES, type ApplicationStatus } from "@/lib/applications";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;
  let body: { status?: string };
  try {
    body = (await request.json()) as { status?: string };
  } catch {
    return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const status = body.status as ApplicationStatus | undefined;
  if (!status || !ADMIN_SELECTABLE_STATUSES.includes(status)) {
    return NextResponse.json({ error: "유효하지 않은 상태입니다." }, { status: 400 });
  }

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
    .update({ status })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "상태 변경 중 오류가 발생했습니다." }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "신청 내역을 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({ application: data });
}
