import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { generateGuaranteeNumber } from "@/lib/applications";

type Body = {
  name?: string;
  phone?: string;
  business?: string;
  type?: string;
  amount?: number | string;
  period?: string;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const name = body.name?.trim();
  const phone = body.phone?.trim();
  const type = body.type?.trim();
  const period = body.period?.trim();
  const amount = Number(body.amount);
  const business = body.business?.trim() || null;

  if (!name || !phone || !type || !period || !amount || amount <= 0) {
    return NextResponse.json({ error: "필수 항목이 비어 있습니다." }, { status: 400 });
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

  // 보증번호 중복 시 최대 3회 재시도합니다.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const guaranteeNumber = generateGuaranteeNumber();
    const { error } = await supabase.from("applications").insert({
      guarantee_number: guaranteeNumber,
      name,
      phone,
      business,
      type,
      amount,
      period,
      status: "접수 완료",
    });

    if (!error) {
      return NextResponse.json({ guaranteeNumber });
    }
    if (error.code !== "23505") {
      return NextResponse.json({ error: "신청 저장 중 오류가 발생했습니다." }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "잠시 후 다시 시도해 주세요." }, { status: 500 });
}
