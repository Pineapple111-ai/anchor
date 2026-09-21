// 우선순위: 직접 지정한 주소 → Netlify가 빌드 시 넣어주는 대표 주소(URL) → 로컬
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.URL ?? "http://localhost:3000";
export const siteName = "앵커보증";
export const siteDescription =
  "실제 기관과 무관한 가상의 보증 서비스 브랜드를 새로 설계한 포트폴리오 컨셉 프로젝트입니다.";
