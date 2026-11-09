<div align="center">

```
████████╗ ██████╗ ██╗  ██╗███████╗███╗   ██╗██╗  ██╗ █████╗ ██████╗ ██████╗  ██████╗ ██████╗
╚══██╔══╝██╔═══██╗██║ ██╔╝██╔════╝████╗  ██║██║  ██║██╔══██╗██╔══██╗██╔══██╗██╔═══██╗██╔══██╗
   ██║   ██║   ██║█████╔╝ █████╗  ██╔██╗ ██║███████║███████║██████╔╝██████╔╝██║   ██║██████╔╝
   ██║   ██║   ██║██╔═██╗ ██╔══╝  ██║╚██╗██║██╔══██║██╔══██║██╔══██╗██╔══██╗██║   ██║██╔══██╗
   ██║   ╚██████╔╝██║  ██╗███████╗██║ ╚████║██║  ██║██║  ██║██║  ██║██║  ██║╚██████╔╝██║  ██║
   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝
```

# tokenharbor-bulk-apikey

**자동 생성된 API 키로 Token Harbor 계정을 대량 생성 — OpenAI 호환 추론(DeepSeek V4.1 Flash, DeepSeek V4 Flash, MiMo V2.5, MiMo V2.6 Flash) + 9Router / OmniRoute 커넥터.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-1%20(browser%20only)-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/free%20models-4-412991?style=for-the-badge)](https://tokenharbor.ai/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)

[🛠 빠른 시작](#-quick-start) · [🎁 무료 티어](#-free-tier--how-much-you-get) · [🤖 모델](#-models--all-4-of-them) · [🧪 API 사용하기](#-how-to-use-the-api) · [✅ 검증됨](#-verified-working--every-key-is-tested) · [🧭 작동 방식](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ 옵션](#️-cli-options) · [🛰️ 프록시](#️-behind-a-proxy) · [🐞 이슈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 이 도구가 존재하는 이유

Token Harbor는 Next.js 패널(Supabase 인증)이며, 무료 티어는 **비율 기반**입니다. 개인
**7일 윈도우**가 첫 무료 요청과 함께 시작되고, 고정된 요청 수가 아니라 정가의 일부를
소비합니다. 가입은 이메일 + 비밀번호에 **Cloudflare Turnstile 위젯**과 네트워크당 제한이
적용됩니다 — 하나의 네트워크는 하나의 계정을 의미하므로, 대량 실행은 사실상 "계정마다
새로운 출구 하나"입니다.

가입 후에는 두 개의 관문이 있으며 둘 다 놓치기 쉽습니다. 가입 메일의 링크를 열기 전까지
API는 `403 email_verification_required`를 응답하고, 무료 모델 동의를 활성화하기 전까지
모든 `:free` 라우트는 `403 free_models_disabled`를 응답합니다 — 그리고 그 동의 엔드포인트는
**클라이언트가 표시한 텍스트를 검증**하므로(`shown_text`), `{"free_models_enabled":true}`만
보내면 `400 reload_and_retry`를 응답합니다. 이 CLI는 이 모든 과정을 처리하고, 매 실행마다
라이브 페이지에서 Next.js 액션 id를 읽어오며, 라이브 chat-200을 통과한 키만 기록합니다.

## 🎁 무료 티어 — 얼마나 받을 수 있나

| 항목 | 값 |
| --- | --- |
| 무료 모델 | **4개** — DeepSeek V4.1 Flash, DeepSeek V4 Flash, MiMo V2.5, MiMo V2.6 Flash (`:free` 접미사) |
| 허용량 | **정가 대비 비율**, 고정 요청 수 없음 (측정: 약 25회 호출 후에도 여전히 `0%`) |
| 윈도우 | **개인 7일**, 첫 무료 요청과 함께 시작 (`x-th-free-resets` 헤더) |
| 계정 속도 제한 | **60 req/min**, **1,800 req/h** |
| IP 속도 제한 | **100 req/min**, **3,000 req/h** (초과 시 `429`, 또는 `error` 본문이 담긴 HTTP `200`을 응답하며 대기 시간을 알려줌) |
| 동시성 | 제한 없음 |
| 유료 모델 | 70개 이상 (Claude, Grok, GLM, MiMo Pro …) — 크레딧이 필요하며, 잔액이 0인 계정은 `402`를 응답 |
| 카드 필요 | **아니요** |
| 전화번호 필요 | **아니요** |
| 캡차 | 가입 시 **Cloudflare Turnstile** — `src/solver.js`가 동일한 출구를 통해 오프스크린 Chrome에서 실제 토큰을 발급 |
| 이메일 인증 | **필수** — CLI가 링크를 열고 `307`을 따라 `?verify=success`로 이동 |
| 확장 단위 | **계정 하나 = 키 하나** → `--count N`은 사실상 "N개의 네트워크에서 N개의 계정" |

기록해 둘 만한 헤더: `x-th-plan`, `x-th-free-used-pct`, `x-th-free-resets`,
`x-th-upstream-model`, `x-th-route-decision`.

## 🤖 모델 — 4개 전부

| 모델 id | 비고 |
| --- | --- |
| `deepseek-v4.1-flash:free` | 기본값; 약 9-11초에 PONG 응답 |
| `deepseek-v4-flash:free` | CLI가 라이브 게이트에서도 시도하는 대체 모델 |
| `mimo-v2.5:free` | MiMo 계열 |
| `mimo-v2.6-flash:free` | 네 개 중 가장 빠름 |

엔드포인트는 총 **78개의 모델 id**를 제공하며(유효한 키로 `GET /v1/models`), 위의 네 개가
크레딧 없이 작동하는 모델입니다. 무료 라우트에서 도구/함수 호출이 작동합니다: `get_time`
스키마는 실제 `tool_calls` 배열로 반환됩니다.

## 🧪 API 사용 방법

```bash
curl https://tokenharbor.ai/v1/chat/completions \
  -H "Authorization: Bearer $TOKENHARBOR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash:free","messages":[{"role":"user","content":"hi"}]}'
```

```python
from openai import OpenAI

client = OpenAI(base_url="https://tokenharbor.ai/v1", api_key="YOUR_KEY")
print(client.chat.completions.create(
    model="deepseek-v4.1-flash:free",
    messages=[{"role": "user", "content": "hi"}],
).choices[0].message.content)
```

## 🚀 명령어 하나

```bash
npm start            # 메뉴 → "Mint keys" → 개수 → 완료
```

`npm start`는 런처를 열고, **1) Mint keys**는 개수만 묻고 그 외에는 아무것도 묻지 않으며,
그다음 CLI가 키마다 계정 하나를 생성하고, 라이브 채팅 호출로 각각을 검증한 뒤, 살아남은
키를 `keys.txt`에 기록합니다.

## 🛠 빠른 시작

```bash
git clone https://github.com/F0Rextasy/tokenharbor-bulk-apikey.git
cd tokenharbor-bulk-apikey
npm install
echo "YOUR_MAILTRAP_TOKEN" > mailtrap.txt   # 필수 — 아래 경고 참고
npm start            # 메뉴 → 1) Mint keys → 개수 → 완료
```

> **`mailtrap.txt` 없이는 민트가 전혀 작동할 수 없습니다.** Token Harbor는 모든 공개
> 메일함 도메인을 거부하므로, 인증 링크를 읽을 수 있는 것이 없고 모든 계정이
> `403 email_verification_required`에서 멈춥니다. 대체 수단은 없습니다: 먼저 무료 토큰을
> 발급받으세요.

**Mailtrap 토큰이 유일한 설정 단계입니다.** Token Harbor는 실제 인바운드 메일 호스트처럼
보이는 메일 도메인을 허용하고, 공개 일회용 도메인에는 "인간 확인을 완료하세요"라고
응답합니다(그런 도메인에는 위젯조차 렌더링하지 않음). 따라서 CLI에는 읽을 수 있는 메일함이
필요합니다. 무료 티어로 충분합니다: [mailtrap.io](https://mailtrap.io)에서 계정을 만들고 →
**Settings → API Tokens**로 이동한 뒤, 그 값을 `package.json` 옆의 `mailtrap.txt`에
기록하세요(한 줄). 또는 `MAILTRAP_TOKEN`을 내보내세요. 런처가 이를 확인하고 없으면
알려줍니다 — 값 자체를 묻지는 않습니다.

토큰이 없으면 CLI는 여전히 공개 메일 경로를 먼저 시도하지만, 모든 계정이 패널의 인간 확인
벽에서 멈춥니다 — 이것이 이 파일이 선택이 아니라 필수인 이유입니다.

## ✅ 검증됨 — 모든 키가 테스트됩니다

키는 민트 시점에 다음을 통과한 후에만 `keys.txt`에 기록됩니다:

- `:free` 모델에서 라이브 `chat-200`, 그리고
- **서로 다른 두 개의 프롬프트**가 비어 있지 않고 **서로 다른** 내용으로 200을 응답.

측정된 전체 실행(`node src/cli.js --auto --count 1 --pool proxies.txt`):

```
[1/1] mailbox th-…@inbound-mailtrap.io (mailtrap)
   precheck 200 · human check no
   signup 200 · session ok
   verify 307 https://tokenharbor.ai/dashboard?verify=success
   consent 200
   key 201
  ✔ thk_live_… saved to keys.txt (1/1)
done
```

언제든 `npm start` → **2) Verify keys**로 재확인할 수 있습니다(`node src/cli.js --verify`).
죽은 키는 `keys-dead.txt`로 이동하고, 라이브 게이트를 완료할 수 없었던 키(예: 네트워크가
속도 제한에 걸린 경우)는 `keys-unverified.txt`에 들어가므로 계정을 잃지 않습니다.

## 🧭 작동 방식

1. **메일함** — Mailtrap 계정(`mailtrap.txt`)에서 계정마다 새 받은편지함을 생성합니다.
   공개 mail.tm / mail.gw가 대체 경로입니다.
2. **가입** — Next.js 서버 액션 id(`next-action`, `$ACTION_KEY`, `x-deployment-id`)를 매
   실행마다 라이브 페이지에서 읽어오므로, 패널이 재배포되어도 CLI가 깨지지 않습니다. 기기
   지문과 시간대가 요청과 함께 전달되며, 시간대는 사용자 머신이 아니라 출구에서 측정됩니다.
3. **인간 확인** — 패널이 위젯을 렌더링하면, 실제 Chrome에서 가입을 재생합니다
   (`src/solver.js`, `puppeteer-core` + 이미 설치된 Chrome; `--enable-automation`은 의도적으로
   억제됨). 체크박스를 마우스로 클릭하고, 그 브라우저의 세션 쿠키를 CLI로 넘겨줍니다.
4. **이메일 인증** — 메일함의 링크를 엽니다. 토큰은 서버 측에서 소비되고
   `307 → /dashboard?verify=success`를 응답합니다.
5. **무료 모델 동의** — 대시보드가 표시하는 동의 텍스트(`src/consent-text.txt`)와 함께
   `POST /api/me/privacy`를 호출합니다. `screen: "consent_modal"`, `path: "/dashboard"`.
6. **키 + 라이브 게이트** — `POST /api/keys` 후, 키가 기록되기 전에 서로 다른 두 프롬프트가
   모두 서로 다른 내용으로 200을 응답해야 합니다.

## ⚙️ CLI 옵션

```bash
node src/cli.js --auto --count 5             # 계정 다섯 개 → 키 다섯 개
node src/cli.js --auto --count 5 --pool proxies.txt
node src/cli.js --verify                     # keys.txt 라이브 확인, 죽은 키 → keys-dead.txt
node src/cli.js --screen --pool proxies.txt  # 어떤 출구가 패널에 도달하는지 확인
node src/cli.js --models                     # 무료 모델 목록 (키 필요)
node src/cli.js --help
```

| 플래그 | 의미 |
| --- | --- |
| `--count <n>` | 생성할 계정(및 키) 수, 기본값 1 |
| `--pool <file>` | 프록시 목록, 한 줄에 출구 하나 (`http://host:port`, `socks5://user:pass@host:port`, `host:port`); 인라인 `#` 주석 허용 |
| `--headless` | 대체 브라우저를 헤드리스로 실행 (기본값: 캡차가 기대하는 오프스크린 창) |
| `--screen` | 풀을 패널에 대해 테스트하고 출구별로 라이브/죽음 출력 |
| `--verify` | `keys.txt` 라이브 검증; 죽은 키는 `keys-dead.txt`에 기록 |
| `--models` | 무료 모델 id 출력 |
| `--strict-proxy` | 직접 요청을 절대 보내지 않음: 라이브 게이트도 풀을 통과해야 함 (환경 변수 `TOKENHARBOR_STRICT=1`도 동일) |

죽어가는 출구가 계정을 잃게 하지는 않습니다: 가입과 라이브 게이트 모두 다른 풀 라인에서
재시도하며, 속도 제한(`429`, 또는 본문에 `rate_limit_exceeded`가 담긴 `200`)은 패널이
알려준 시간만큼 대기합니다.

## 🛰️ 프록시 뒤에서

CLI는 기본적으로 **직접** 실행됩니다. `proxies.txt`에 한 줄에 출구 하나를 넣거나(런처가
자동으로 인식) `--pool`로 전달하세요:

```text
http://127.0.0.1:8080
socks5://user:pass@10.0.0.5:1080
10.0.0.5:8080
```

선택 사항 — 대규모에서는 권장: 패널은 **네트워크당** 가입을 제한하므로, 계정마다 새로운
출구를 쓰면 더 큰 실행을 건강하게 유지할 수 있습니다. 메일은 Mailtrap 계정에서 직접
읽으므로(메일 제공자는 패널이 아님), 느린 출구가 메일함 단계를 깨뜨릴 수 없습니다.

## 📄 파일

| 경로 | 내용 |
| --- | --- |
| `keys.txt` | 검증된 키, 한 줄에 하나 (라이브 게이트 후에만 기록) |
| `keys-dead.txt` | 응답이 멈춘 키 (`--verify`에서) |
| `keys-unverified.txt` | 라이브 게이트를 완료할 수 없었던 키 — 계정은 존재하고 키는 실제 |
| `accounts.jsonl` | 계정당 한 줄: 이메일 + 단계별 결과 |
| `mailtrap.txt` | Mailtrap API 토큰 (한 줄) |
| `proxies.txt` | 선택적 프록시 목록 |
| `src/cli.js` | 민트 / 검증 / 스크린 CLI |
| `src/launcher.js` | 메뉴 (`npm start`) |
| `src/solver.js` | Turnstile 위젯용 브라우저 부분 |
| `src/consent-text.txt` | 패널이 검증하는 동의 텍스트 |
| `src/connect-9router.js`, `src/connect-omniroute.js` | 라우터 커넥터 |

## 🔌 9Router에 연결

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

`openai-compatible` 제공자 노드 하나(`tokenharbor`, 기본 URL `https://tokenharbor.ai/v1`)와
`keys.txt`의 키마다 연결 하나를 등록하므로, 9Router가 여러분의 키에 걸쳐 부하 분산합니다.
멱등성: 기존 노드나 연결은 재사용되며, 번호는 이미 존재하는 가장 높은 `tokenharbor-0NN`에서
이어집니다.

## 🔌 OmniRoute에 연결

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
```

OmniRoute도 같은 형태입니다(제공자 노드 + 키마다 연결 하나). 런처는 둘 다 메뉴 항목 **6**과
**7**로 노출하며, `npm run 9router` / `npm run omniroute`도 동일하게 동작합니다.

## 🔑 키 하나로 얻는 것

- 위의 네 가지 `:free` 모델, 계정당 60 req/min 및 1,800 req/h (IP당 100 req/min);
- 개인 7일 윈도우 내 비율 기반 허용량 (`x-th-free-resets`가 롤오버 시점을 알려줌);
- 도구 호출을 지원하는 OpenAI 호환 `/v1/chat/completions`이므로, `base_url`을
  `https://tokenharbor.ai/v1`로 바꾸면 어떤 OpenAI SDK, CLI, 라우터든 작동합니다;
- 유료 모델은 계정에 크레딧이 있을 때까지 잠겨 있습니다 (그렇지 않으면 `402`).

## 🐞 이슈

명령어, 실패한 단계(CLI는 `precheck / signup / verify / consent / key / chat`을 출력) 및
패널 자체의 메시지를 포함하여 이슈를 열어 주세요. 전체 API 키를 붙여넣지 마세요 — 마지막
네 글자면 충분합니다.

## 📄 라이선스

MIT — [LICENSE](LICENSE) 참고. 이 도구는 Token Harbor와 제휴 관계가 없습니다. 소유한
계정에만 사용하고 패널의 약관을 준수하세요.