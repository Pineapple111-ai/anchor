# 보증 신청 백엔드 설정 (Supabase)

보증 신청 접수, 진행 현황 조회, 관리자 페이지(`/admin`)는 Supabase 데이터베이스와
연결되어야 동작합니다. 아래 순서대로 한 번만 설정하면 됩니다.

## 1. Supabase 프로젝트 만들기

1. supabase.com 에서 로그인하고 **New project**를 누릅니다.
2. 이름과 비밀번호(데이터베이스 비밀번호, 나중에 쓸 일은 거의 없습니다)를 정하고 생성합니다.
3. 리전은 가까운 곳(Northeast Asia 계열)을 고르면 됩니다.

## 2. 테이블 만들기

1. 왼쪽 메뉴에서 **SQL Editor**를 엽니다.
2. 이 저장소의 `docs/supabase-schema.sql` 파일 내용을 그대로 붙여넣고 **Run**을 누릅니다.
3. `applications`라는 테이블이 생성됩니다.

## 3. API 키 확인하기

1. 왼쪽 메뉴에서 **Project Settings → API**를 엽니다.
2. **Project URL** 값을 복사합니다. → `SUPABASE_URL`
3. **service_role** 키(비밀 키, `anon` 키가 아닙니다)를 복사합니다. → `SUPABASE_SERVICE_ROLE_KEY`

service_role 키는 데이터베이스 전체에 접근할 수 있는 강력한 키입니다. 절대 GitHub에
커밋하거나 브라우저 코드에 넣지 마세요. 이 프로젝트에서는 서버 코드(Route Handler)
에서만 사용하도록 만들어져 있습니다.

## 4. 로컬에서 환경 변수 설정하기

1. 프로젝트 폴더의 `.env.local.example` 파일을 복사해 `.env.local`이라는 이름으로 저장합니다.
2. `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`에 2~3단계에서 복사한 값을 넣습니다.
3. `ADMIN_PASSWORD`에 관리자 페이지(`/admin`) 로그인 비밀번호를 직접 정해서 넣습니다.
4. 저장 후 `npm run dev`를 다시 실행합니다.

`.env.local`은 `.gitignore`에 포함되어 있어 GitHub에 올라가지 않습니다.

## 5. Netlify에 환경 변수 설정하기

로컬에서만 설정하면 배포된 사이트에서는 동작하지 않습니다. Netlify에도 같은 값을 넣어야 합니다.

1. Netlify 프로젝트의 **Project configuration → Environment variables**를 엽니다.
2. **Add a variable**로 아래 세 개를 추가합니다.
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`
3. 저장 후 **Deploys → Trigger deploy → Clear cache and deploy site**로 다시 배포합니다.
   환경 변수는 새로 빌드할 때만 반영됩니다.

## 6. 확인하기

1. 배포된 사이트에서 "보증 신청하기"로 신청을 하나 넣어봅니다.
2. `주소/admin`으로 접속해 방금 설정한 비밀번호로 로그인합니다.
3. 방금 넣은 신청이 목록에 보이고, 상태를 바꿀 수 있으면 정상입니다.
4. "진행 현황 조회"에서 방금 받은 보증번호, 또는 이름·연락처로 조회가 되는지 확인합니다.

## 참고

- `/admin`은 별도 로그인 화면이 있지만, 페이지 주소 자체는 누구나 열 수 있습니다.
  이 프로젝트는 포트폴리오용 데모이므로 간단한 비밀번호 방식으로 만들었습니다. 실제 서비스로
  운영한다면 더 강한 인증 방식을 검토하세요.
- Supabase 무료 플랜 한도 내에서는 비용이 들지 않습니다.
