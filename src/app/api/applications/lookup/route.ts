import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const number = searchParams.get("number")?.trim();
  const name = searchParams.get("name")?.trim();
  const phone = searchParams.get("phone")?.trim();

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch {
    return NextResponse.json(
      { error: "서버 설정이 완료되지 않았습니다. Supabase 환경 변수를 확인해 주세요." },
      { status: 500 },
    );
  }

  if (number) {
    const { data, error } = await supabase
      .from("applications")
      .select("guarantee_number,type,amount,period,status,certificate_data,created_at")
      .eq("guarantee_number", number)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: "조회 중 오류가 발생했습니다." }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ results: [] });
    }
    return NextResponse.json({ results: [data] });
  }

  if (name && phone) {
    const { data, error } = await supabase
      .from("applications")
      .select("guarantee_number,type,amount,period,status,certificate_data,created_at")
      .eq("name", name)
      .eq("phone", phone)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "조회 중 오류가 발생했습니다." }, { status: 500 });
    }
    return NextResponse.json({ results: data ?? [] });
  }

  return NextResponse.json({ error: "보증번호 또는 이름·연락처를 입력해 주세요." }, { status: 400 });
}
