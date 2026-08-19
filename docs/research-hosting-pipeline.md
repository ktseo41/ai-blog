# 호스팅·리포 구조·발행 파이프라인 조사 (2026-07 기준)

## 1. 리포 구조 (확정)

```
private 작업 리포 (비공개)      ← 원자료·초안·작업 전 과정, 비공개 유지
        │  발행할 글만 선별·다듬어 파일 단위 복사
        ▼
이 repo (ai-blog)                              ← 사이트 코드 + 발행용 최종본만
        │  (나중에) remote add + push
        ▼
GitHub public repo → 호스팅 자동 빌드·배포
```

- 조사에서 확인된 표준 패턴: "private 작업 repo → 출간 완성고만 받는 public repo". public repo에 들어오는 시점 자체가 게이트 역할.
- **핵심 원칙: 이 repo는 첫 커밋부터 공개 가능한 히스토리로 유지한다.** private 리포의 git 이력을 절대 끌어오지 않고, 발행 시 새 커밋으로만 추가. 이렇게 하면 git filter-repo / BFG 같은 이력 세탁 도구를 쓸 상황 자체가 안 생김.
- 이동은 당분간 수동 복사(파일 내용 검토 겸). 발행 빈도가 높아지면 private 쪽에 발행 스크립트 추가 검토.
- 만약 실수로 민감정보가 커밋되면: 해당 값이 자격증명이면 즉시 폐기/로테이션이 최우선, 그 다음 git filter-repo(`--replace-text`) 또는 BFG로 이력 정리. 정리는 백업본에서 수행.

## 2. 호스팅 비교 (공개 시점에 결정)

| 항목 | Cloudflare Pages | GitHub Pages | Vercel | Netlify |
| --- | --- | --- | --- | --- |
| 대역폭(무료) | 무제한 | 소프트 리밋 100GB/월 | 100GB/월 | 100GB/월(초과 과금 비쌈) |
| 빌드 | 500 빌드/월, GitHub 연동 자동 | Actions 직접 구성, 리포 1GB 제한 | 6,000분/월 | 300분/월 |
| 한국 속도 | 서울 PoP, TTFB 30–50ms 최상 | Fastly CDN | 80–120ms | 리전 미설정 시 250–400ms |
| 상업적 사용 | 무료 티어 가능 | 가능 | Hobby는 비상업 한정 | 가능 |

**결론: Cloudflare Pages 1순위** (무제한 대역폭 + 국내 최저 지연 + GitHub 연동 자동 빌드로 별도 Actions 불필요). 애드센스를 붙일 계획이 있으므로 Vercel Hobby(비상업 한정)는 제외. 주의: 비교 수치는 2026년 SEO성 비교 블로그가 많아 결정 전 공식 pricing 페이지 재확인 권장.

## 3. 배포 파이프라인 (공개 시)

- Cloudflare Pages는 GitHub repo 연결만 하면 push마다 자동 빌드·배포 — 자체 GitHub Actions 불필요. **2026-07-30에 실제로 연결 완료** (그 전까지는 wrangler 수동 배포였고, 이 문서만 보고 자동 배포로 착각해 발행 글이 라이브에 안 올라간 사고가 있었다). 설정값·주의점은 [docs/cloudflare-pages-deploy.md](./cloudflare-pages-deploy.md) §1.
- GitHub Pages를 쓸 경우: push → SSG 빌드 → `actions/deploy-pages` 표준 패턴. Settings에서 Pages 소스를 "GitHub Actions"로 먼저 설정.
- **대용량 에셋(이미지·동영상)은 repo에 넣지 않는다**: 이미지 위주 블로그가 5GB로 불어나 clone/push가 마비된 사례. 발행 시점에 Cloudflare R2(S3 호환, 저비용) 업로드 후 URL 참조가 정석. 로컬 전용인 지금부터도 원본 대형 이미지는 최적화(압축·리사이즈) 후 반입.
- 데모/게임 폴더는 순수 정적 파일이라 그대로 포함 (research-framework.md, demo-layout-notes.md 참조).

## 4. 커스텀 도메인 (공개 시)

- **.com 등 범용 TLD: Cloudflare Registrar** — 원가 판매(마크업 없음), 등록·갱신 동일 약 $10/년. 첫해 할인 후 갱신비 급등 구조가 없음.
- **.kr/.co.kr: 가비아 등 국내 등록대행사 필수** (Cloudflare 미취급). 첫해 할인 약 16,500–19,800원, 갱신은 정상가(23,100–26,400원) 기준으로 판단.
- DNS: Cloudflare Pages 사용 시 네임서버를 Cloudflare로 위임하는 게 가장 깔끔. GitHub Pages는 apex에 A 레코드 4개 + www CNAME.
- SEO 주의: `*.pages.dev`/`*.github.io` 서브도메인은 검색엔진이 별개 사이트로 취급 — 도메인을 나중에 바꾸면 색인·순위가 리셋되어 복구에 3–4주 이상. **가능하면 공개 첫날부터 커스텀 도메인으로 시작**하고, 플랫폼 기본 서브도메인과 동시 접근되면 canonical 태그로 중복 콘텐츠 방지.

## 5. 공개 시점 체크리스트

1. GitHub public repo 생성 → remote add → push (히스토리 이미 깨끗함 전제)
2. Cloudflare Pages 연결, 커스텀 도메인 즉시 연결 + canonical 설정
3. 구글 서치콘솔 + 네이버 서치어드바이저(HTML 파일 방식) + 다음 등록, sitemap/RSS 제출
4. JSON-LD(BlogPosting: headline·image·datePublished — 리치 결과 필수 필드), OG 태그(og:image 1200×630, 카카오톡 캐시는 카카오 디벨로퍼스 디버거로 초기화)
5. giscus 댓글(repo Discussions 활성화), Cloudflare Web Analytics 또는 GoatCounter
6. 공개 직전 최종 스윕: 전체 파일·커밋 이력에서 개인정보/비공개 세부 재검수 (기준: docs/content-guidelines.md)
7. (수익화 단계) About·개인정보처리방침 페이지 → 애드센스 신청

## 출처 (주요)

- https://danubedata.ro/blog/cloudflare-pages-vs-netlify-vs-vercel-static-hosting-2026
- https://dev.to/lazydev_oh/vercel-vs-netlify-vs-cloudflare-pages-2026-deep-comparison-with-real-numbers-8pl
- https://kyrrego.github.io/blog/2026/01/24/github-repo.html (private 개발 + public 릴리스 관리)
- https://voxelmanip.se/2025/10/04/cleaning-up-a-git-repository-for-public-consumption/
- https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
- https://developers.cloudflare.com/pages/tutorials/use-r2-as-static-asset-storage-for-pages/
- https://www.codemzy.com/blog/hosting-image-files-without-bloating-git
- https://www.cloudflare.com/products/registrar/ / https://domain.gabia.com/
- https://inblog.ai/blog/do-custom-domains-affect-seo-5114
- https://dev.to/imranparthib/from-custom-domain-to-vercel-subdomain-how-i-recovered-my-seo-rankings-56i7
