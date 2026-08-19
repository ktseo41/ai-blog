# 직접 구축 블로그의 검색 노출·수익화 현실 조사 (2026-07 기준)

Tistory/네이버블로그/velog 대신 정적 사이트를 직접 구축할 때 감수할 것들과 대응.

## 1. 직접 구축의 실제 단점

- **초기 검색 유입 제로**: 새 도메인은 신뢰도 0에서 시작. 서치콘솔 사이트맵 등록이 꼬여 한 달간 포기를 고민한 사례, 초창기엔 커뮤니티에 직접 홍보해 백링크를 만들어야 했다는 경험담.
- **댓글·통계 직접 구축**: 플랫폼과 달리 기본 제공이 없음. Disqus 무료판은 광고가 심해 utterances/giscus로 가는 것이 정석.
- **네이버 노출 약함**: 서치어드바이저 등록·sitemap 제출을 해도 "여전히 아무것도 안 나온다"는 보고가 흔함. 네이버는 자사 서비스 우대 경향.
- **유지보수 부담**: 의존성 업그레이드·테마 관리가 내 몫. "포스팅보다 이슈 해결에 리소스가 더 든다"며 리메이크한 사례도 있음 (비주류 스택일수록 심함 — 프레임워크 선택에서 주류를 고른 이유).

## 2. 한국 검색 노출 현실

- **구글 서치콘솔**: 등록 후 데이터 표시까지 2–3일, sitemap 제출 후 색인까지 1–7일.
- **네이버 서치어드바이저**: 소유권 확인(HTML 파일 방식은 갱신 불필요, 메타태그 방식은 1년마다 갱신) → RSS/sitemap 제출. 수집까지 14–16일이고 그 후에도 노출 보장 없음.
- **점유율**: statcounter 기준(2025-12) 구글 47.9% vs 네이버 42.5% — 데스크톱은 구글 60%로 압도, 모바일은 네이버 60%로 우위. 개발자·리서치성 독자는 구글 비중이 높아 외부 블로그의 구조적 불리함이 상대적으로 덜함.
- **다음**: register.search.daum.net 등록 시 5일 내 심사, 네이트에도 함께 노출. 점유율 2.9%대.
- **빙**: 서치콘솔 등록 사이트 자동 가져오기 지원. 점유율 3–4%로 유입 효과는 작음.
- 참고: 네이버 블로그·카페는 역으로 구글에서 검색이 안 됨(크롤링 차단) — 어느 쪽을 골라도 반대편 검색엔진을 잃는 구조. 직접 구축 + 양쪽 등록이 유일하게 양쪽 다 노리는 방법.

## 3. 플랫폼 종속 리스크 (직접 구축의 반대급부)

Tistory 2025–2026 타임라인:

- 2025-06 앵커·오퍼월 광고 전면 금지 (위반 시 블로그 접근 제한), 2025-09 모바일 전면광고 금지 → 상위 블로거 수익 월평균 18–26% 감소 보고
- 2025-05 후원 기능 '응원하기' 종료
- 2025-03 카카오가 다음을 별도 법인 분사, 자회사 AXZ 운영
- 2025-09부터 3년 미로그인 시 계정·데이터 파기로 정책 강화
- 2026-02 동영상 업로드 차단, 기존 영상 2026-03-23까지 백업 안 하면 일괄 삭제

velog: 테마·폰트 커스터마이징 불가, 통계 부실, 광고 불가. SEO도 티스토리보다 약하다는 후기.

전례: 이글루스 2023 폐쇄(이사 도구 미제공, 대량 유실), 다음블로그 2022 종료. 티스토리 백업도 댓글·통계·스킨 미포함.

→ 마크다운 원본을 내 git repo에 두는 구조는 이 리스크가 0. 이것이 직접 구축의 가장 큰 이유.

## 4. 수익화 (애드센스)

- 승인 실패 공통 사유: 콘텐츠 부족, "가치 없는 콘텐츠"(단순 복사·번역·**AI 생성물**), 필수 페이지(About·개인정보처리방침) 미비, 도메인/HTTPS/크롤링 설정 오류.
- 정적 블로그는 CMS 대비 기술 설정이 더 필요하고, 티스토리보다 승인이 다소 까다롭다는 통설 (1차 실증 경험담은 미확보 — 통설 수준).
- **이 블로그와의 긴장점**: AI 조사·정리 콘텐츠임을 명시할 계획인데, 애드센스는 "가치 없는 AI 생성물"을 거절 사유로 봄. 대응 방향은 content-guidelines.md 참조 — 핵심은 단순 생성물이 아니라 "사람이 기획·검수하고 출처를 단 리서치"로서의 부가가치를 글 구조 자체로 보여주는 것. 수익화는 최종 단계 목표라 급하지 않음.

## 5. 댓글·방문자 분석 (무료 대안)

- **댓글: giscus 권장** — GitHub Discussions 기반. utterances(Issue 기반)보다 권한 스코프가 좁고(설치 저장소만 접근), strict matching으로 댓글이 엉뚱한 페이지에 붙는 문제 해결, 2026년에도 활발히 개발 중. Disqus는 광고 문제로 비추천.
- **통계**: Cloudflare Web Analytics(무료, 2025-10부터 기본 활성화, 30일 보관·10% 샘플링 한계) 또는 GoatCounter(무료, 쿠키 없음, 월 100만 pageview). GA4는 무겁고 소규모 사이트에서 thresholding으로 지표가 안 보이는 문제. Plausible 셀프호스팅은 봇 탐지가 빠져 통계가 무의미해졌다는 2026-02 후기가 있어 비추천, 클라우드판은 유료(월 $9부터).

## 출처 (주요)

- https://choiiis.github.io/github-blog/why-did-i-move-to-github-blog/
- https://wormwlrm.github.io/2023/05/07/SEO-for-Technical-Blog.html
- https://jaehee-kim24.github.io/posts/github블로그_검색노출하기_naver/
- https://seo.tbwakorea.com/blog/naver-search-advisor/
- https://seosem.kr/네이버-블로그가-구글-검색이-안되는-이유는/
- https://www.dataeconomy.co.kr/news/articleView.html?idxno=35954
- https://www.thewordcracker.com/blog/티스토리-6월-1일부터-애드센스-앵커-광고-및-오퍼월-광/
- https://www.fnnews.com/news/202508210801129653 (티스토리 휴면 정책)
- https://v.daum.net/v/20260128112105178 (티스토리 동영상 차단)
- https://namu.wiki/w/velog / https://hololog.dev/post/25
- https://worpsense.com/adsense-approval-probability-guide/ / https://henrypress.net/adsense-low-value-content-fix/
- https://shipit.dev/posts/from-utterances-to-giscus.html / https://github.com/giscus/giscus
- https://blog.cloudflare.com/the-rum-diaries-enabling-web-analytics-by-default/
- https://www.loopwerk.io/articles/2026/plausible/ / https://github.com/arp242/goatcounter
