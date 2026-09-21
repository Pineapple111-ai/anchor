# 앵커보증 (포트폴리오 컨셉 프로젝트)

가상의 중소기업 보증 서비스 **앵커보증**의 메인 페이지를 새로 설계한 포트폴리오 프로젝트입니다.
실제 기관과 무관하며, 화면의 상품·연락처·문구·수치는 모두 가상입니다.

## 프로젝트 성격

- 국내 보증 서비스 사이트의 일반적인 메인 화면 구성(GNB → 통합검색 → 바로가기 → 공지 → 푸터)을 참고했습니다.
- 로고, 이미지, 아이콘, 문구, 레이아웃 비율, 컬러, 타이포는 모두 새로 만들었습니다.
- 외부 사이트의 이미지나 텍스트를 가져오지 않았습니다.
- 로그인·가입·신청 등 실제 업무 기능은 없고 UI만 있습니다.

## 실행 방법

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 프로덕션 빌드
npm run lint
```

## 배포 설정

`.env.local` 또는 호스팅 환경 변수에 실제 도메인을 지정하면 OG 이미지, sitemap, robots의 절대 주소가 그 도메인으로 만들어집니다.

```
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

OG 이미지(`public/og.png`, 1200×630)의 원본은 `docs/og-source.html`입니다. 문구를 바꾸려면 이 파일을 수정한 뒤 1200×630으로 캡처해 교체하세요.

배포 절차는 [docs/deploy.md](docs/deploy.md)를 참고하세요.

## 사용 기술

Next.js (App Router), React, TypeScript, Tailwind CSS v4, `next/font/google` (Noto Serif KR, Noto Sans KR)

## 구현 범위 (메인 페이지만)

| 영역 | 내용 |
| --- | --- |
| Header / GNB | 로고, 6개 메뉴, 전체 하위 메뉴 패널, 모바일 아코디언 메뉴 |
| Hero | 헤드라인, 보증서 일러스트(인장 모션 1회) |
| 통합검색 | 메뉴 실시간 검색, 추천 검색어, 최근 검색어(localStorage) |
| 자주 찾는 서비스 | 6개 바로가기 |
| 새 소식 | 공지사항 / 보도자료 탭, 고객센터 |
| 배너 | 안내 배너 2종 |
| Footer | 정책 링크, 회사 정보, 관련 사이트, 컨셉 프로젝트 고지 |

접근성: 본문 바로가기, 키보드 포커스 표시, 탭 방향키 이동, `prefers-reduced-motion` 대응.

## 폴더 구조

```
src/
├── app/            # layout, page, globals.css (디자인 토큰)
└── components/
    ├── Header/     # Header, GNB, MegaPanel, MobileMenu, Logo, menu 데이터
    ├── Hero/       # Hero, Certificate
    ├── Search/     # SearchBox, suggestions
    ├── Shortcut/   # Shortcut, icons
    ├── MainContent/# NoticeTabs, 고객센터, notices 데이터
    ├── Banner/
    └── Footer/
docs/
├── design-notes.md
└── og-source.html
```

## 이미지 자산

외부 이미지는 없습니다. 로고 마크, 아이콘, 보증서 일러스트는 모두 코드(SVG/CSS)로 직접 그렸습니다.

## 추후 구현할 수 있는 서브페이지

보증 상품 목록/상세, 보증료 계산기, 신청 절차 안내, 공지사항 목록/상세, 지점 찾기, 회사 소개
