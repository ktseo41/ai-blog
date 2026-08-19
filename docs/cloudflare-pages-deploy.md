# Cloudflare Pages 배포·접근 제한·사용량 조회 가이드

작성: 2026-07-24. 계정: 블로그 운영 계정 (Account ID는 대시보드 → Workers & Pages 우측에서 확인)

## 1. 배포 (GitHub 연동 자동 빌드 — 2026-07-30부터 현행)

`ktseo41/blog-with-ai` 저장소가 Pages 프로젝트에 연결돼 있어 **main에 push하면 Cloudflare가 알아서 빌드·배포**한다.
따로 실행할 명령은 없다. 프로덕션 URL은 연동 전과 같은 https://blog-with-ai.pages.dev 이고,
Access 설정도 도메인이 안 바뀌었으므로 그대로 유효하다.

대시보드 빌드 설정값:

| 항목 | 값 |
| --- | --- |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | 비움 (저장소 루트) |
| Production branch | `main` |

- **Node 버전은 저장소 루트 `.node-version`(현재 22.17.1)으로 고정한다.** `package.json` engines가
  22.12 이상을 요구하고 Astro 7도 그렇다. Cloudflare 빌드 환경 기본 Node는 그보다 낮아 설치 단계에서 깨진다.
  대시보드 환경변수 `NODE_VERSION`으로도 되지만, 파일로 두면 로컬·CI가 같은 값을 본다.
- 의존성 설치는 지정할 것이 없다. `package-lock.json`이 있으면 Cloudflare가 `npm ci`로 잡는다.
- main 외 브랜치 push는 프리뷰 배포가 된다. 안 쓸 거면 Settings → Builds → Branch control에서 끈다.
- `notes/**`·`docs/**`는 빌드 산출물에 안 들어가므로 Build watch paths의 exclude에 넣으면 빌드 횟수를 아낀다(선택).

### 수동 배포 (fallback)

연동이 끊겼거나 대시보드를 못 쓸 때만. 정적 Astro 사이트라 어댑터 없이 `dist`를 그대로 올린다.

```sh
npm run build
npx wrangler pages deploy dist --project-name blog-with-ai --branch main
```

- 배포 목록: `npx wrangler pages deployment list --project-name blog-with-ai`
- 로그인 상태 확인: `npx wrangler whoami` — **계정이 <운영 계정 이메일>인지 반드시 본다.**
  다른 계정 토큰이 저장돼 있으면 배포가 `Authentication error [code: 10000]`으로 떨어진다
  (2026-07-30에 다른 계정 토큰이 물려 있어 실제로 겪음). 재로그인은 `npx wrangler login`.
- `--branch main`이 아닌 다른 브랜치명을 주면 프리뷰 배포로 취급된다.

## 2. Google 로그인으로 접근 제한 (Cloudflare Access)

원리: Pages 프로젝트 앞에 Zero Trust **Access 애플리케이션**을 붙이면, 방문자는 지정한
IdP(이미 등록해 둔 Google 프리셋)로 로그인하고 정책(이메일 allowlist)을 통과해야 페이지를 볼 수 있다.
정적 파일 서빙 앞단에서 Cloudflare가 차단하므로 앱 코드는 전혀 수정하지 않는다.

### 가장 쉬운 길 — Pages 대시보드의 원클릭 "Access policy"

1. dash.cloudflare.com → Workers & Pages → `ai-blog` → **Settings** → **General** 아래 **Access policy** → **Enable**.
2. 기본값은 *프리뷰 배포만* 보호한다. 프로덕션(`blog-with-ai.pages.dev`)까지 막으려면
   안내 링크를 따라 Zero Trust 대시보드에서 생성된 앱의 도메인에
   `blog-with-ai.pages.dev` 와 `*.blog-with-ai.pages.dev` 둘 다 추가.
3. Zero Trust → Access → Applications → 해당 앱 → **Policies**: Allow / Include → Emails → `<운영 계정 이메일>`.
4. 같은 앱의 **Authentication** 탭에서 로그인 방식을 Google만 남기면 (Accept all identity providers 끄기)
   방문 시 바로 Google 로그인으로 간다.

### 수동으로 만들 때 (Zero Trust 대시보드)

Zero Trust → Access → Applications → **Add an application** → Self-hosted:

- Application domain: `blog-with-ai.pages.dev` + 추가로 `*.blog-with-ai.pages.dev`
- Identity providers: Google (기존 프리셋 선택)
- Policy: Action **Allow**, Include **Emails** = `<운영 계정 이메일>`
- Session duration: 취향대로 (예: 1 week)

### 나중에 퍼블릭 공개로 전환

Zero Trust → Access → Applications에서 해당 앱을 삭제(또는 비활성)하면 즉시 공개된다.
Pages 쪽 설정은 건드릴 필요 없음.

### CLI/API로 하려면

wrangler에는 Access 관리 명령이 없다 (wrangler OAuth 토큰에 Access 스코프도 없음).
API로 하려면 dash.cloudflare.com/profile/api-tokens 에서 **Access: Apps and Policies — Edit**
권한의 토큰을 만들어:

```sh
export CF_API_TOKEN=...   # Access: Apps and Policies Edit
export CF_ACCOUNT=<CF_ACCOUNT_ID>

# 앱 생성 (Google IdP의 uuid는 GET /access/identity_providers 로 조회)
curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT/access/apps" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{
    "name": "blog-with-ai",
    "type": "self_hosted",
    "domain": "blog-with-ai.pages.dev",
    "self_hosted_domains": ["blog-with-ai.pages.dev", "*.blog-with-ai.pages.dev"],
    "allowed_idps": ["<google-idp-uuid>"],
    "auto_redirect_to_identity": true,
    "session_duration": "168h"
  }'

# 정책 추가
curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT/access/apps/<app-uuid>/policies" \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"owner-only","decision":"allow","include":[{"email":{"email":"<운영 계정 이메일>"}}]}'
```

일회성 설정이라 대시보드가 더 빠르다. API 경로는 자동화가 필요해질 때 참고.

## 3. 트래픽·사용량 조회

### 대시보드 (가장 간단)

- Workers & Pages → 프로젝트 → **Metrics**: 요청 수, 대역폭, Functions 호출 수.
- 계정 홈 → Analytics: 계정 전체 트래픽.

### CLI/API

wrangler 자체에는 analytics 명령이 없고, **GraphQL Analytics API**를 curl로 때리는 방식이다.
토큰 권한: **Account Analytics — Read**.

```sh
export CF_API_TOKEN=...   # Account Analytics Read
export CF_ACCOUNT=<CF_ACCOUNT_ID>

# Pages Functions 호출량 (일별)
curl -s https://api.cloudflare.com/client/v4/graphql \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"query":"query { viewer { accounts(filter: {accountTag: \"'$CF_ACCOUNT'\"}) { pagesFunctionsInvocationsAdaptiveGroups(limit: 100, filter: {datetime_geq: \"2026-07-01T00:00:00Z\"}) { sum { requests } dimensions { scriptName date } } } } }"}'

# Workers 호출·에러·CPU 시간
# 데이터셋: workersInvocationsAdaptive (dimensions: scriptName, status / sum: requests, errors, duration)
```

유용한 데이터셋:

| 데이터셋 | 내용 |
| --- | --- |
| `pagesFunctionsInvocationsAdaptiveGroups` | Pages Functions 호출 수 |
| `workersInvocationsAdaptive` | Workers 요청·에러·CPU |
| `httpRequestsAdaptiveGroups` | HTTP 요청 상세 (zone 필요 — 커스텀 도메인을 연결한 경우만) |

주의: `*.pages.dev` 기본 도메인만 쓰는 동안은 zone-레벨 HTTP analytics(국가·경로·UA별 상세)가
없다. 커스텀 도메인을 붙이면 그 zone으로 상세 분석이 열린다.

### "이 사용량이 어디서 왔는가" 판별

- **정적 요청 vs Functions**: 이 블로그는 순수 정적이라 Functions가 없다. 정적 asset 서빙은
  Pages 무료·무제한이고 과금 카운트 대상이 아니다. 사용량 걱정은 Functions/Workers를 붙일 때부터.
- **실 유저 vs 내부 호출(Pages → Function)**: 호출량 숫자 자체는 출처를 구분해주지 않는다. 구분 방법:
  1. 실시간 로그: `npx wrangler pages deployment tail --project-name <이름>` — 각 요청의
     경로·UA·IP 국가가 보여서 봇/내 호출/실유저를 눈으로 구분 가능.
  2. zone analytics(커스텀 도메인 필요)에서 `clientRequestPath`, `userAgent`, `clientCountryName`
     차원으로 그룹핑.
  3. 내부 service binding 호출(Worker→Worker)은 별도 요청으로 과금되지 않고 invocation 수에서도
     하위 호출로 집계 방식이 다르므로, "내 Pages가 내 Function을 fetch로 호출"하는 구조라면
     그건 일반 HTTP 요청과 동일하게 집계된다 — service binding으로 바꾸면 이 중복이 사라진다.
- Access를 켜 두면 로그인 통과자만 도달하므로, 그 기간의 트래픽은 사실상 전부 본인 + Cloudflare 헬스체크다.
