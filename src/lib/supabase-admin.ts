import "server-only";
import { createClient } from "@supabase/supabase-js";

// 서비스 롤 키를 쓰는 클라이언트입니다. 반드시 서버 코드(라우트 핸들러)에서만
// import 하세요. 클라이언트 컴포넌트에서 import하면 안 됩니다.
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- 스키마 타입을 아직 생성하지 않아 permissive 클라이언트로 사용합니다.
let cached: ReturnType<typeof createClient<any>> | null = null;

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 환경 변수가 설정되어 있지 않습니다.",
    );
  }
  if (!cached) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- 위와 동일한 이유입니다.
    cached = createClient<any>(url, key, {
      auth: { persistSession: false },
    });
  }
  return cached;
}
