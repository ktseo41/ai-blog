# 정적 사이트 프레임워크 비교 조사 (2026-07 기준)

시나리오: 한국어 마크다운 리포트 중심 + 가끔 self-contained HTML 인터랙티브 데모(WebGL, 신경망 시각화) 임베드. 작성자는 프론트엔드 개발자라 커스터마이징 능력은 충분하지만 유지보수 시간은 최소화하고 싶음.

## 결론: Astro 채택

| 순위 | 프레임워크 | 요지 |
| --- | --- | --- |
| 1 | **Astro** | 블로그 지향 설계 + 데모 임베드 최강 + 국내 사례 풍부 |
| 2 | Hugo | 유지보수 최소화 최강 (단일 바이너리, zero-config) — Node 의존이 싫어지면 탈출구 |
| 3 | Eleventy | 가볍고 자유롭지만 국내 자료 적음, v4 알파 |
| — | VitePress | 탈락: 블로그 기능(태그·RSS·아카이브) 전부 수동 구현, 2.0이 아직 alpha |
| — | Docusaurus | 탈락: 문서 사이트 지향, React 앱 전체 부트스트랩으로 무거움 |
| — | Next.js+Nextra | 탈락: 정적 export는 비주류 경로, 개인 블로그에 오버킬 |

## 후보별 상세

### Astro (채택)

- 콘텐츠 사이트 전용 설계. 기본 zero-JS 정적 HTML, 필요한 곳만 아일랜드 하이드레이션.
- Astro 7 릴리스(Vite 8, Rust 컴파일러), 매달 "What's new" 포스트가 나올 정도로 릴리스 카덴스 빠름.
- Content Collections(zod 스키마)로 frontmatter 타입 안전. `@astrojs/sitemap`·`@astrojs/rss` 공식 통합. 태그는 라우팅 직접 구성.
- **데모 임베드가 후보 중 가장 매끄러움**: `public/`에 self-contained HTML을 두고 iframe 또는 `client:only`로 붙임. React/Vue/Svelte 아무거나 섬으로 삽입 가능.
- SEO: sitemap 공식 통합, OG는 `BaseHead` 컴포넌트 패턴(표준 레시피 존재), `astro-opengraph`로 OG 이미지 자동 생성 가능.
- 국내 사례: 카카오페이 기술블로그 계기로 채택 다수 (eatsteak.dev, log8.kr 등). 한국어 튜토리얼 풍부.
- 단점: 메이저 버전업이 잦아(6→7) 연 1회 정도 업그레이드 대응 필요.

### Hugo (2순위)

- Go 단일 바이너리, Node 툴체인 불필요. 1만 페이지 2.95초 빌드. 2026년에도 매달 릴리스.
- 태그/카테고리 텍소노미·RSS·sitemap 전부 zero-config 기본 내장 — 유지보수 부담 최저.
- 마크다운에 raw HTML 자유 삽입, `static/` + iframe으로 데모 임베드 무리 없음.
- 단점: Go 템플릿이 React/Vue 개발자에게 이질적, 아일랜드 등 최신 컴포넌트 패턴 없음(이 시나리오엔 큰 문제 아님).

### Eleventy (3순위)

- 얇고 unopinionated, 블로그 특화 기능(아카이브, RSS 플러그인, IndieWeb) 풍부. passthrough copy로 데모 임베드 자연스러움.
- 안정판 v3.1, v4는 알파. 국내 사례·한국어 자료가 적어 트러블슈팅 시 영어 의존.

### 탈락 사유 상세

- **VitePress**: Vue 팀 문서 프레임워크. 태그·RSS·아카이브·댓글 전부 직접 구축 필요, v2.0.0-alpha 단계. 로컬 검색은 최강이지만 블로그 용도 부적합.
- **Docusaurus**: 3.9(2026-05) 활발하지만 문서 사이트 색이 강함. React 전체 부트스트랩으로 빌드 무겁고, 순수 HTML 데모 삽입이 Astro/Hugo보다 번거로움.
- **Next.js+Nextra**: `output: 'export'`로 정적화 가능하나 이미지 최적화 등 핵심 기능 무력화. 의존성 유지보수 부담 최대.

### 기타 신흥 대안 (참고)

- **Zola**: Rust 기반, Hugo보다 빠르다는 평가, 생태계 작음.
- **Quartz**: 옵시디언 볼트 발행용 디지털 가든 — 블로그 포스트 나열과는 결이 다름.
- **Astro Starlight / Fumadocs**: 문서 사이트 특화.

## 출처

- https://github.com/withastro/astro / https://astro.build/blog/whats-new-june-2026/
- https://joost.blog/astro-seo-complete-guide/ / https://docs.astro.build/en/guides/integrations-guide/sitemap/
- https://eatsteak.dev/post/constructing-blog/ / https://log8.kr/blog/blog-platform-change-monetization-plan/
- https://gohugo.io/ / https://github.com/gohugoio/hugo / https://blog.bumgu.com/post/2025/04/22/making_blog_with_hugo/
- https://www.11ty.dev/ / https://11tybundle.dev/
- https://docsio.co/blog/vitepress / https://github.com/vuejs/vitepress/blob/main/CHANGELOG.md
- https://github.com/facebook/docusaurus/releases / https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-blog
- https://nextra.site/docs/guide/static-exports / https://nextjs.org/docs/pages/guides/static-exports
- https://www.pkgpulse.com/guides/best-static-site-generators-2026 / https://hygraph.com/blog/top-12-ssgs
