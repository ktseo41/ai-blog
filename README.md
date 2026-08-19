# ai-blog

AI(Claude 등)와 함께 조사·정리한 콘텐츠를 공유하는 개인 블로그 프로젝트.

## 왜 하는가

- 개인적인 필요로 생성한 조사·리서치 산출물이 계속 쌓이고 있다.
- 공유해서 조회수도 얻고, 같은 걸 궁금해하는 사람에게 도움도 되면 좋겠다.
- 직접 만든 실험용 게임·인터랙티브 데모(WebGL, 신경망 시각화 등)를 실행하기 좋은 형태로 올릴 수 있어야 한다. 글마다 성격이 달라서 **다양한 레이아웃**(장문 리포트형, 리스트형, 풀스크린 데모형 등)을 미리 염두에 둔다.
- 최종적으로는 구글 애드센스 등 광고 수익화도 붙일 생각이 있다 (우선순위는 아님).

## 원칙

1. **AI 조사·정리 콘텐츠임을 명시한다.** 각 글에 AI가 조사·정리했고 사람이 검수했다는 표기를 넣는다. 상세: [docs/content-guidelines.md](docs/content-guidelines.md)
2. **이 repo는 처음부터 공개 가능한 히스토리로 유지한다.** 개인 정보·비공개 세부·유료 콘텐츠 전사물은 어떤 커밋에도 들어오지 않는다. 원자료와 작업 과정은 private 작업 리포에 남고, 여기에는 발행용으로 다듬은 최종본만 들어온다.
3. **공개 저장소·Cloudflare Pages 자동 배포.** main에 push하면 배포된다. 절차: [docs/cloudflare-pages-deploy.md](docs/cloudflare-pages-deploy.md), 배경 조사: [docs/research-hosting-pipeline.md](docs/research-hosting-pipeline.md)

## 기술 방향 (조사 결론, 2026-07-20)

- 프레임워크: **Astro** — 블로그 지향, sitemap/RSS 공식 통합, self-contained HTML 데모 임베드가 가장 자유로움. 근거: [docs/research-framework.md](docs/research-framework.md)
- 호스팅(공개 시): **Cloudflare Pages** 1순위. 근거: [docs/research-hosting-pipeline.md](docs/research-hosting-pipeline.md)
- 검색 노출·수익화 현실: [docs/research-seo-monetization.md](docs/research-seo-monetization.md)
- 데모/게임 레이아웃 구상: [docs/demo-layout-notes.md](docs/demo-layout-notes.md)

## 로드맵

1. Astro 스캐폴드 생성, 카테고리·태그 체계와 레이아웃 골격 잡기
2. 성격이 다른 파일럿 글 3–5편 이관 (장문 분석 1, 리스트형 리뷰 1, 인터랙티브 데모 1, 생활 리서치 1)
3. 로컬 프리뷰로 파이프라인 검증, 글 재고 쌓기
4. public repo 전환 → Cloudflare Pages 배포 (완료, 2026-08) → 도메인 → 서치콘솔/서치어드바이저 → 댓글·통계 → 애드센스 검토

## 라이선스

- 코드(Astro 소스, 컴포넌트, 스타일, 데모): [MIT](LICENSE)
- 글·이미지(`src/content/`, `public/` 안의 콘텐츠): [CC BY-NC 4.0](LICENSE-content) — 출처를 밝히면 비상업적으로 옮겨 쓸 수 있다.

