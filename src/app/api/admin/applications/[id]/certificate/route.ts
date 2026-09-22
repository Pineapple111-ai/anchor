import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { CERTIFICATE_MAX_BYTES } from "@/lib/applications";

async function requireAdmin() {
  const cookieStore = await cookies();
  return verifyAdminSession(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }
  const { id } = await params;

  let body: { dataUrl?: string };
  try {
    body = (await request.json()) as { dataUrl?: string };
  } catch {
    return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const dataUrl = body.dataUrl;
  if (!dataUrl || !/^data:image\/(png|jpe?g|webp);base64,/.test(dataUrl)) {
    return NextResponse.json(
      { error: "PNG, JPG, WEBP 이미지 파일만 업로드할 수 있습니다." },
      { status: 400 },
    );
  }

  const base64Part = dataUrl.slice(dataUrl.indexOf(",") + 1);
  const approxBytes = Math.floor((base64Part.length * 3) / 4);
  if (approxBytes > CERTIFICATE_MAX_BYTES) {
    return NextResponse.json(
      { error: "이미지 용량이 너무 큽니다. 3MB 이하로 업로드해 주세요." },
      { status: 400 },
    );
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
    .update({ certificate_data: dataUrl })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "업로드 중 오류가 발생했습니다." }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "신청 내역을 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({ application: data });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }
  const { id } = await params;

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch {
    return NextResponse.json(
      { error: "서버 설정이 완료되지 않았습니다. Supabase 환경 변수를 확인해 주세요." },
      { status: 500 },
    );
  }

  const { error } = await supabase.from("applications").update({ certificate_data: null }).eq("id", id);
  if (error) {
    return NextResponse.json({ error: "삭제 중 오류가 발생했습니다." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
