<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

# Token Harbor — 대량 API 키

터미널에서 Token Harbor(tokenharbor.ai) 계정과 API 키를 생성하세요.
Token Harbor는 영구 무료 티어가 포함된 **OpenAI 호환** 엔드포인트를 제공하므로,
키는 모든 OpenAI SDK, CLI 또는 로컬 라우터에서 작동합니다.

```bash
git clone https://github.com/F0Rextasy/tokenharbor-bulk-apikey.git
cd tokenharbor-bulk-apikey
npm install
echo "YOUR_MAILTRAP_TOKEN" > mailtrap.txt   # free Mailtrap API token, one line (see Setup)
npm start            # menu → "Mint keys" → how many → done
```

`npm start`는 메뉴를 엽니다. **1) Mint keys**를 선택하고 숫자를 입력하면 CLI가 키마다
계정 하나를 생성하고, **실시간 채팅 호출**로 각각을 검증한 뒤, 통과한 키를
`keys.txt`에 기록합니다. 아래의 일회성 Mailtrap 토큰 설정 이후에는 아무것도 요구하지 않습니다. 캡차 토큰도, 프록시도, 프롬프트도 없습니다.

## 설정 (1분)

Token Harbor는 실제 인바운드 메일 호스트처럼 보이는 메일 도메인을 허용하고 공개 일회용
도메인은 거부하므로, CLI에는 읽을 수 있는 메일함이 필요합니다:

1. [mailtrap.io](https://mailtrap.io)에서 무료 계정을 만드세요 → **Settings → API Tokens**.
2. 토큰을  옆에  에 넣거나(한 줄), 를 내보내세요.

이것이 유일한 설정 단계입니다. 나머지 — 계정별 받은편지함, 인증 링크,
무료 모델 동의, 키 — 는 모두 자동입니다.

## 제공 항목

| 필드 | 값 |
|---|---|
| API 베이스 | `https://tokenharbor.ai/v1` |
| 인증 | `Authorization: Bearer YOUR_KEY` |
| 무료 모델 | `deepseek-v4.1-flash:free` · `deepseek-v4-flash:free` · `mimo-v2.5:free` · `mimo-v2.6-flash:free` |
| 유료 모델 | 70개 이상 (Claude, Grok, GLM, MiMo Pro …) — 계정에 크레딧이 필요합니다 |
| 키 형식 | `thk_live_` + 63자 |
| 카드 / 전화번호 | 무료 티어에는 필요하지 않음 |

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

## CLI

```bash
node src/cli.js --auto --count 5        # five accounts → five keys, one command
node src/cli.js --auto --count 5 --pool proxies.txt
node src/cli.js --verify                # re-check every key in keys.txt with a live call
node src/cli.js --models                # print the free model list (needs a key)
node src/cli.js --help
```

| 플래그 | 의미 |
|---|---|
| `--count <n>` | 생성할 계정(및 키) 수, 기본값 1 |
| `--pool <file>` | 프록시 목록, 한 줄에 출구 하나 (`http://host:port`, `socks5://user:pass@host:port`, `host:port`) |
| `--headless` | 대체 브라우저를 헤드리스로 실행 (기본값: 꺼짐 — 캡차가 기대하는 화면 밖 창) |
| `--verify` | `keys.txt`를 실시간 검증하고 키별로 live/dead 출력 |

출력: `keys.txt` (한 줄에 키 하나, 통과한 키만), `accounts.jsonl` (계정당 한 줄,
단계별 결과 포함, 소유한 계정 이메일 외의 비밀 정보 없음).

## 발급 작동 방식

1. **메일함** — Mailtrap 토큰(무료 티어, `mailtrap.txt`에 한 줄)이 있으면 CLI는
   본인의 Mailtrap 계정에 계정마다 새 받은편지함을 엽니다. 없으면
   공개 서비스인 mail.tm / mail.gw로 대체합니다.
2. **가입** — Next.js 서버 액션 id는 매 실행마다 라이브 페이지에서 읽으므로
   패널이 재배포되어도 CLI가 깨지지 않습니다. 기기 지문과 시간대가
   요청과 함께 전송되며, 시간대는 사용자 머신이 아닌 출구에서 측정됩니다.
3. **인간 확인** — 일회용 메일 도메인은 패널이 "인간 확인을 완료하세요"라고 응답하게 만들고
   (해당 위치에는 위젯조차 렌더링하지 않음), 따라서 실제 인바운드 메일 호스트가
   작동하는 경로입니다. 위젯이 *렌더링되는* 경우, 가입은
   실제 Chrome에서 재생됩니다 (`src/solver.js`, `puppeteer-core` + 사용자 머신에 이미 있는 Chrome):
   양식은 실제 키 입력으로 채워지고, Turnstile 체크박스는 마우스로 클릭되며,
   세션 쿠키는 CLI로 다시 전달됩니다.
4. **이메일 인증** — 메일함의 링크가 열립니다 (토큰은 서버 측에서 소비되고
   `?verify=success`로 `307`을 응답합니다).
5. **무료 모델 동의** — 데이터 공유 스위치가 대시보드에 표시되는 동의 텍스트로
   활성화됩니다 (`src/consent-text.txt`). 이것이 없으면 모든 `:free` 호출이
   `403 free_models_disabled`를 응답합니다.
6. **키** — `POST /api/keys` 후 **실시간 게이트**: 두 개의 서로 다른 프롬프트가 모두
   비어 있지 않고 서로 다른 텍스트로 `200`을 응답해야 합니다. 게이트를 통과하지 못한 키는
   절대 기록되지 않습니다.

## 품질 게이트

`keys.txt`의 모든 키는 발급 시점에 다음을 통과했습니다:

- `:free` 모델에서 실시간 `chat-200`, 그리고
- **두 개의 서로 다른 프롬프트**가 비어 있지 않고 **서로 다른** 콘텐츠로 200을 응답.

도구를 사용할 수 없는 키, 죽은 키 또는 죽은 제공자는 이 저장소의
출력에 기록되거나 콤보에 연결되지 않습니다. 언제든 `node src/cli.js --verify`로 재확인하세요.

## 제한 (무료 티어)

| 제한 | 값 |
|---|---|
| 허용량 | **정가 대비 백분율** — 고정 요청 수 없음 |
| 기간 | **개인별 7일**, 첫 무료 요청과 함께 시작 (`x-th-free-resets`) |
| 계정 속도 | 분당 60 요청, 시간당 1,800 요청 |
| IP 속도 | 분당 100 요청, 시간당 3,000 요청 |
| 동시성 | 제한 없음; 속도 초과 시 `429` 응답 |

기록해 둘 만한 응답 헤더: `x-th-plan`, `x-th-free-used-pct`, `x-th-free-resets`,
`x-th-upstream-model`, `x-th-route-decision`.

## 프록시 — 선택 사항

CLI는 기본적으로 **직접** 실행됩니다. `proxies.txt`에 한 줄에 출구 하나를 넣거나
(`--pool` 전달) 모든 요청 — 대체 브라우저 포함 — 이 프록시를 통해 나갑니다:

```text
http://127.0.0.1:8080
socks5://user:pass@10.0.0.5:1080
```

선택 사항 — 대규모 실행 시 권장: 패널은 네트워크당 가입 수를 제한하므로, 계정마다
새 출구 하나를 사용하면 더 큰 실행을 건강하게 유지합니다.

## 로컬 라우터 연결

두 커넥터 모두 멱등적이며 `keys.txt`를 읽습니다:

```bash
node src/connect-9router.js    --base http://localhost:8080 --password 123456
node src/connect-omniroute.js  --base http://localhost:20128 --password 123456
```

각각 `openai-compatible` 제공자 노드(`tokenharbor`)를 베이스 URL
`https://tokenharbor.ai/v1`로 하나 생성하고 키마다 연결 하나를 만들므로, 라우터가
키들에 걸쳐 로드 밸런싱합니다. 실행 메뉴에서도 동일한 두 작업을 제공합니다.

## 참고

- 각 계정은 생성된 이메일 주소에 속합니다 — 나중에 다시 로그인하려면 `accounts.jsonl`을
  보관하세요.
- 무료 티어는 `src/consent-text.txt`에 설명된 동의 하에 무료 경로 트래픽을 저장합니다.
  유료 경로는 학습에 사용되지 않습니다.
- 동의 텍스트는 패널에서 버전 관리됩니다. 변경되면 CLI가 알려주며, 대시보드에서
  **Enable free models**를 누른 후 한 번 다시 실행하면 됩니다.
- Node.js 18+가 필요합니다. `puppeteer-core`는 패널이 인간 확인을 요구할 때만
  사용되며, CLI 자체는 표준 라이브러리만 사용합니다.

## 라이선스

MIT — [LICENSE](LICENSE) 참조.