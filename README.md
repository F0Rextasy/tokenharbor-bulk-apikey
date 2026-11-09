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

**Bulk-create Token Harbor accounts with auto-generated API keys — OpenAI-compatible inference (DeepSeek V4.1 Flash, DeepSeek V4 Flash, MiMo V2.5, MiMo V2.6 Flash) + 9Router / OmniRoute connectors.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-1%20(browser%20only)-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/free%20models-4-412991?style=for-the-badge)](https://tokenharbor.ai/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)

[🛠 Quick start](#-quick-start) · [🎁 Free tier](#-free-tier--how-much-you-get) · [🤖 Models](#-models--all-4-of-them) · [🧪 Use the API](#-how-to-use-the-api) · [✅ Verified](#-verified-working--every-key-is-tested) · [🧭 How it works](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Why this exists

Token Harbor is a Next.js panel (Supabase auth) whose free tier is **percentage based**: a
personal **7-day window** starts with your first free request and consumes a share of the
list price, not a fixed request count. Sign-up is e-mail + password with a **Cloudflare
Turnstile widget** and a per-network limit — one network means one account — so a bulk run is
really "one fresh exit per account".

Two gates sit after sign-up and both are easy to miss: the API answers
`403 email_verification_required` until the link from the sign-up mail is opened, and every
`:free` route answers `403 free_models_disabled` until the free-models consent is enabled —
and that consent endpoint **validates the text the client showed** (`shown_text`), so a bare
`{"free_models_enabled":true}` answers `400 reload_and_retry`. This CLI does all of it,
reads the Next.js action ids from the live page on every run, and only writes keys that pass
a live chat-200.

## 🎁 Free tier — how much you get

| What | Value |
| --- | --- |
| Free models | **4** — DeepSeek V4.1 Flash, DeepSeek V4 Flash, MiMo V2.5, MiMo V2.6 Flash (`:free` suffix) |
| Allowance | **percentage of list price**, no fixed request count (measured: still `0%` after ~25 calls) |
| Window | **personal 7 days**, starts with your first free request (`x-th-free-resets` header) |
| Account rate limit | **60 req/min**, **1,800 req/h** |
| IP rate limit | **100 req/min**, **3,000 req/h** (over-rate answers `429`, or HTTP `200` with an `error` body, and names the wait time) |
| Concurrency | not capped |
| Paid models | 70+ (Claude, Grok, GLM, MiMo Pro …) — they need credits; a zero-balance account answers `402` |
| Card required | **No** |
| Phone required | **No** |
| Captcha | **Cloudflare Turnstile** on sign-up — `src/solver.js` mints a real token in an offscreen Chrome through the same exit |
| E-mail verification | **required** — the CLI opens the link and follows the `307` to `?verify=success` |
| The unit that scales | **one account = one key** → `--count N` is really "N accounts from N networks" |

Headers worth logging: `x-th-plan`, `x-th-free-used-pct`, `x-th-free-resets`,
`x-th-upstream-model`, `x-th-route-decision`.

## 🤖 Models — all 4 of them

| Model id | Notes |
| --- | --- |
| `deepseek-v4.1-flash:free` | the default; answers PONG in ~9-11 s |
| `deepseek-v4-flash:free` | fallback model the CLI also tries in the live gate |
| `mimo-v2.5:free` | MiMo family |
| `mimo-v2.6-flash:free` | fastest of the four |

The endpoint serves **78 model ids** in total (`GET /v1/models` with any valid key); the four
above are the ones that work without credits. Tools/function calling work on the free routes:
a `get_time` schema comes back as a real `tool_calls` array.

## 🧪 How to use the API

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

## 🚀 One command

```bash
npm start            # menu → "Mint keys" → how many → done
```

`npm start` opens the launcher, **1) Mint keys** asks a count and nothing else, then the CLI
creates one account per key, verifies each one with a live chat call and writes the survivors
to `keys.txt`.

## 🛠 Quick start

```bash
git clone https://github.com/F0Rextasy/tokenharbor-bulk-apikey.git
cd tokenharbor-bulk-apikey
npm install
echo "YOUR_MAILTRAP_TOKEN" > mailtrap.txt   # REQUIRED — see the warning below
npm start            # menu → 1) Mint keys → how many → done
```

> **Without `mailtrap.txt` the mint cannot work at all.** Token Harbor refuses every public
> mailbox domain, so nothing can read the verification link and every account would stall at
> `403 email_verification_required`. There is no fallback: get a free token first.

**The Mailtrap token is the only setup step.** Token Harbor
accepts a mail domain that looks like a real inbound-mail host and answers "complete the human
check" to public disposable domains (for those it does not even render the widget), so the CLI
needs a mailbox it can read. Free tier is enough: create an account at
[mailtrap.io](https://mailtrap.io) → **Settings → API Tokens**, then write that value into
`mailtrap.txt` next to `package.json` (one line), or export `MAILTRAP_TOKEN`. The launcher
checks it and tells you if it is missing — it never asks for the value itself.

Without the token the CLI still tries the public mail rails first, and every account stops at
the panel's human-check wall — that is why the file is required, not optional.

## ✅ Verified working — every key is tested

A key is written to `keys.txt` only after, at mint time:

- a live `chat-200` on a `:free` model, and
- **two different prompts** answering 200 with non-empty and **different** content.

Measured end to end (`node src/cli.js --auto --count 1 --pool proxies.txt`):

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

Re-check any time with `npm start` → **2) Verify keys** (`node src/cli.js --verify`); dead
keys move to `keys-dead.txt`, a key whose live gate could not complete (e.g. the network hit a
rate limit) lands in `keys-unverified.txt` so the account is never lost.

## 🧭 How it works

1. **Mailbox** — a fresh inbox per account on your Mailtrap account (`mailtrap.txt`); public
   mail.tm / mail.gw are the fallback rails.
2. **Sign-up** — the Next.js server-action ids (`next-action`, `$ACTION_KEY`,
   `x-deployment-id`) are read from the live page every run, so a panel redeploy does not break
   the CLI; the device fingerprint and the timezone travel with the request, and the timezone is
   measured from the exit, not from your machine.
3. **Human check** — when the panel renders the widget, the sign-up is replayed in a real Chrome
   (`src/solver.js`, `puppeteer-core` + the Chrome already installed; `--enable-automation` is
   suppressed on purpose), the checkbox is clicked with the mouse, and that browser's session
   cookies are handed back to the CLI.
4. **E-mail verification** — the link from the mailbox is opened; the token is consumed
   server-side and answers `307 → /dashboard?verify=success`.
5. **Free-models consent** — `POST /api/me/privacy` with the consent text the dashboard shows
   (`src/consent-text.txt`), `screen: "consent_modal"`, `path: "/dashboard"`.
6. **Key + live gate** — `POST /api/keys`, then two different prompts must both answer 200 with
   different content before the key is written.

## ⚙️ CLI options

```bash
node src/cli.js --auto --count 5             # five accounts → five keys
node src/cli.js --auto --count 5 --pool proxies.txt
node src/cli.js --verify                     # live-check keys.txt, dead ones → keys-dead.txt
node src/cli.js --screen --pool proxies.txt  # which exits reach the panel at all
node src/cli.js --models                     # the free model list (needs a key)
node src/cli.js --help
```

| flag | meaning |
| --- | --- |
| `--count <n>` | accounts (and keys) to create, default 1 |
| `--pool <file>` | proxy list, one exit per line (`http://host:port`, `socks5://user:pass@host:port`, `host:port`); inline `#` comments are fine |
| `--headless` | run the fallback browser headless (default: off-screen window, which is what the captcha expects) |
| `--screen` | test the pool against the panel and print live/dead per exit |
| `--verify` | live-verify `keys.txt`; dead keys are written to `keys-dead.txt` |
| `--models` | print the free model ids |
| `--strict-proxy` | never send a direct request: the live gate must also go through the pool (env `TOKENHARBOR_STRICT=1` does the same) |

A dying exit never costs an account: sign-up and the live gate both retry on other pool lines,
and a rate limit (a `429`, or a `200` whose body carries `rate_limit_exceeded`) waits the time the panel names.

## 🛰️ Behind a proxy

The CLI runs **direct** by default. Put one exit per line in `proxies.txt` (the launcher picks
it up automatically) or pass `--pool`:

```text
http://127.0.0.1:8080
socks5://user:pass@10.0.0.5:1080
10.0.0.5:8080
```

Optional — recommended at scale: the panel limits sign-ups **per network**, so one fresh exit
per account keeps a larger run healthy. Mail is read from your Mailtrap account directly (a
mail provider is not the panel), so a slow exit cannot break the mailbox step.

## 📄 Files

| Path | What |
| --- | --- |
| `keys.txt` | verified keys, one per line (written only after the live gate) |
| `keys-dead.txt` | keys that stopped answering (from `--verify`) |
| `keys-unverified.txt` | keys whose live gate could not finish — the account exists, the key is real |
| `accounts.jsonl` | one line per account: e-mail + step results |
| `mailtrap.txt` | your Mailtrap API token (one line) |
| `proxies.txt` | optional proxy list |
| `src/cli.js` | the mint / verify / screen CLI |
| `src/launcher.js` | the menu (`npm start`) |
| `src/solver.js` | the browser half for the Turnstile widget |
| `src/consent-text.txt` | the consent text the panel validates |
| `src/connect-9router.js`, `src/connect-omniroute.js` | router connectors |

## 🔌 Connect to 9Router

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

Registers one `openai-compatible` provider node (`tokenharbor`, base URL
`https://tokenharbor.ai/v1`) and one connection per key in `keys.txt`, so 9Router load-balances
across your keys. Idempotent: an existing node or connection is reused, and numbering continues
from the highest `tokenharbor-0NN` already there.

## 🔌 Connect to OmniRoute

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
```

Same shape for OmniRoute (provider node + one connection per key). The launcher exposes both as
menu items **6** and **7**, and `npm run 9router` / `npm run omniroute` do the same.

## 🔑 What one key gets you

- the four `:free` models above, at 60 req/min and 1,800 req/h per account (100 req/min per IP);
- a percentage-based allowance inside a personal 7-day window (`x-th-free-resets` tells you when
  it rolls over);
- OpenAI-compatible `/v1/chat/completions` with tool calling, so any OpenAI SDK, CLI or router
  works by changing `base_url` to `https://tokenharbor.ai/v1`;
- paid models stay locked until the account has credits (`402` otherwise).

## 🐞 Issues

Open an issue with the command, the step that failed (the CLI prints `precheck / signup /
verify / consent / key / chat`) and the panel's own message. Never paste a full API key — the
last four characters are enough.

## 📄 License

MIT — see [LICENSE](LICENSE). The tool is not affiliated with Token Harbor; use it for accounts
you own and respect the panel's terms.
