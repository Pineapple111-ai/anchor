# 배포 가이드 (GitHub → Netlify)

## 준비된 것

- `netlify.toml`: 빌드 명령과 Node 22 지정. Next.js는 Netlify가 자동 감지하므로 publish 폴더는 지정하지 않는다.
- `NEXT_PUBLIC_SITE_URL`이 없으면 Netlify의 `URL` 값(대표 주소)을 자동으로 사용한다.

## 해야 할 일

1. 로컬 확인
   ```bash
   npm install
   npm run dev
   ```
   폰트(Noto Serif KR / Sans KR)가 적용된 화면을 데스크톱과 모바일 너비에서 확인한다.
   이어서 `npm run build`가 오류 없이 끝나는지 확인한다.

2. GitHub에 올리기
   ```bash
   git init
   git add .
   git commit -m "feat: 앵커보증 메인 페이지"
   git branch -M main
   git remote add origin https://github.com/<계정>/<리포지토리>.git
   git push -u origin main
   ```

3. Netlify 연결
   - Add new site → Import an existing project → GitHub → 리포지토리 선택
   - 빌드 설정은 `netlify.toml`에서 읽으므로 그대로 Deploy
   - 배포 후 `main`에 push할 때마다 자동 재배포된다.

4. 주소 확정 후 환경 변수 (커스텀 도메인을 쓸 때만)
   - Site configuration → Environment variables → `NEXT_PUBLIC_SITE_URL` = `https://내도메인`
   - 저장 후 재배포

5. 배포 후 확인
   - 공유 미리보기: 카카오톡 공유 디버거, Facebook 공유 디버거에서 OG 이미지 확인
   - `/robots.txt`, `/sitemap.xml` 주소가 실제 도메인으로 나오는지 확인
   - 모바일 실기기에서 메뉴, 검색, 탭 동작 확인

6. (선택) 커스텀 도메인
   - Netlify의 Domain management에서 도메인을 추가하고, 안내되는 값을 도메인 등록업체의 DNS 관리에 입력한다.

## 포트폴리오에 올릴 때

- 소개 문구에 "가상 브랜드를 새로 설계한 컨셉 프로젝트"임을 함께 적는다.
- 사이트 푸터의 고지 문구는 지우지 않는다.
