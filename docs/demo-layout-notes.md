# 데모·게임 임베드와 레이아웃 구상

직접 만든 실험용 게임·인터랙티브 데모를 "실행하기 좋은 형태"로 올리는 것이 이 블로그의 요구사항 중 하나. 글 성격이 다양하므로 레이아웃을 처음부터 여러 종류로 설계한다.

## 현재 데모 재고와 기술 상태

| 데모 | 상태 | 반입 조건 |
| --- | --- | --- |
| conway-game-of-life-webgl | 완전 self-contained (ES module, 외부 의존 없음) | 폴더 복사만으로 가능. HTTP 서빙 필요(ES module 제약 — 정적 호스팅이면 자동 충족) |
| rubiks-nn-cube | 완전 self-contained (CSS 3D + 자체 MLP, 외부 의존 없음) | 폴더 복사만으로 가능, preview 이미지 3장 보유 |
| hexapod-nn-terrain | three.js를 jsdelivr CDN importmap으로 로드 | three.js 로컬 vendoring 후 반입 권장 (오프라인 완결성 + CDN 장애 대비) |

공통: 빌드 스텝 불필요, 순수 정적 파일. Astro 기준 `public/demos/<이름>/`에 폴더째 두면 됨.

## 임베드 방식

- **iframe 임베드 (기본)**: 포스트 본문에 `<iframe src="/demos/conway/">`. 데모의 JS/CSS가 사이트와 격리되어 안전하고, 데모 쪽 코드 수정이 전혀 필요 없음.
- **풀스크린 링크 병행**: iframe 상단이나 하단에 "전체 화면으로 열기" 링크(`/demos/conway/` 직접 이동). 게임류는 풀스크린이 본 경험이므로 필수.
- Astro 아일랜드(`client:only`)는 데모를 컴포넌트로 재작성할 때만 — 기존 self-contained 데모는 iframe이 정답.

## 레이아웃 타입 (Astro 레이아웃 컴포넌트로 분리)

1. **PostLayout (기본)**: 장문 리포트·리뷰·리서치용. 본문 최대폭 제한(한국어 가독 65–75자), 목차(장문일 때), 태그·날짜·AI 명시 배지.
2. **DemoLayout**: 데모 소개 포스트용. 상단에 iframe(반응형 비율 유지) + 풀스크린 버튼, 하단에 조작법·구현 노트. 모바일에서는 iframe 대신 preview 이미지 + "새 탭에서 열기"로 대체하는 분기 고려 (모바일 WebGL 성능·터치 조작 문제).
3. **FullscreenDemo — 구현됨 (`src/pages/play/[id].astro`)**: `/play/<데모>/` 전용 플레이 페이지. 상단 2.75rem 바(← 글로 돌아가기 + 제목)만 두고 나머지 전체를 iframe(`/demos/<데모>/index.html`)이 차지. 데모 추가 시 getStaticPaths 배열에 항목 하나(id·title·post 경로)만 추가하면 됨. noindex 처리(본 글이 검색 대상, 플레이 페이지는 제외). 원본 `/demos/*`는 그대로 direct 접근 가능.
4. **ListLayout (추후)**: 추천 리스트형 글(웹툰 30선 등)이 많아지면 카드/표 스타일 컴포넌트 추가.

폴더 구상:

```
src/layouts/PostLayout.astro
src/layouts/DemoLayout.astro
src/content/posts/*.md          # frontmatter의 layout/type 필드로 레이아웃 선택
public/demos/<이름>/            # self-contained 데모 원본
```

## 추후 결정 사항 (아직 미정)

- 데모 목록 전용 인덱스 페이지(/demos)를 둘지, 포스트 태그로만 묶을지
- 게임류 조회수·플레이 시간 같은 지표를 통계 도구로 잡을지
- 데모 썸네일 규격(카드·OG 이미지 겸용) 통일
