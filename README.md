<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

# Token Harbor — bulk API keys

Create Token Harbor (tokenharbor.ai) accounts and API keys from your terminal.
Token Harbor serves an **OpenAI-compatible** endpoint with a permanently free tier, so a
key works in any OpenAI SDK, CLI or local router.

```bash
git clone https://github.com/F0Rextasy/tokenharbor-bulk-apikey.git
cd tokenharbor-bulk-apikey
npm install
echo "YOUR_MAILTRAP_TOKEN" > mailtrap.txt   # free Mailtrap API token, one line (see Setup)
npm start            # menu → "Mint keys" → how many → done
```

`npm start` opens a menu; pick **1) Mint keys**, type a number, and the CLI creates one
account per key, verifies each one with a **live chat call**, and writes the survivors to
`keys.txt`. After the one-time Mailtrap token below, nothing else is asked: no captcha tokens, no proxy, no prompts.

## Setup (one minute)

Token Harbor accepts a mail domain that looks like a real inbound-mail host and refuses
public disposable ones, so the CLI needs a mailbox it can read:

1. Create a free account at [mailtrap.io](https://mailtrap.io) → **Settings → API Tokens**.
2. Put the token in  next to  (one line), or export .

That is the only setup step. Everything else — the inbox per account, the verification link,
the free-models consent, the key — is automatic.

## What you get

| field | value |
|---|---|
| API base | `https://tokenharbor.ai/v1` |
| Auth | `Authorization: Bearer YOUR_KEY` |
| Free models | `deepseek-v4.1-flash:free` · `deepseek-v4-flash:free` · `mimo-v2.5:free` · `mimo-v2.6-flash:free` |
| Paid models | 70+ (Claude, Grok, GLM, MiMo Pro …) — they need credits on the account |
| Key format | `thk_live_` + 63 characters |
| Card / phone | not required for the free tier |

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

| flag | meaning |
|---|---|
| `--count <n>` | accounts (and keys) to create, default 1 |
| `--pool <file>` | proxy list, one exit per line (`http://host:port`, `socks5://user:pass@host:port`, `host:port`) |
| `--headless` | run the fallback browser headless (default: off-screen window, which is what the captcha expects) |
| `--verify` | live-verify `keys.txt` and print live/dead per key |

Output: `keys.txt` (one key per line, only keys that passed), `accounts.jsonl` (one line
per account with the step results, no secrets beyond the account e-mail you own).

## How the mint works

1. **Mailbox** — with a Mailtrap token (free tier, one line in `mailtrap.txt`) the CLI opens a
   fresh inbox per account on your own Mailtrap account; without it, it falls back to the
   public mail.tm / mail.gw services.
2. **Signup** — the Next.js server action ids are read from the live page on every run, so
   a panel redeploy does not break the CLI. The device fingerprint and the timezone travel
   with the request; the timezone is measured from your exit, not from your machine.
3. **Human check** — a disposable mail domain makes the panel answer "complete the human check"
   (and it does not even render the widget there), so a real inbound-mail host is the rail that
   works. When a widget *is* rendered, the signup is
   replayed in a real Chrome (`src/solver.js`, `puppeteer-core` + the Chrome already on your
   machine): the form is typed with real keys, the Turnstile checkbox is clicked with the
   mouse, and the session cookies are handed back to the CLI.
4. **E-mail verification** — the link from the mailbox is opened (the token is consumed
   server-side and answers a `307` to `?verify=success`).
5. **Free-models consent** — the data-sharing switch is enabled with the consent text the
   dashboard shows (`src/consent-text.txt`). Without it every `:free` call answers
   `403 free_models_disabled`.
6. **Key** — `POST /api/keys`, then a **live gate**: two different prompts must both answer
   `200` with non-empty, different text. A key that fails the gate is never written.

## Quality gates

Every key in `keys.txt` passed, at mint time:

- a live `chat-200` on a `:free` model, and
- **two different prompts** answering 200 with non-empty and **different** content.

A key that cannot use tools, a dead key or a dead provider is never written to this repo's
output or wired into a combo. Re-check any time with `node src/cli.js --verify`.

## Limits (free tier)

| limit | value |
|---|---|
| allowance | **percentage of list price** — no fixed request count |
| window | **personal 7 days**, starts with your first free request (`x-th-free-resets`) |
| account rate | 60 requests/min, 1,800 requests/hour |
| IP rate | 100 requests/min, 3,000 requests/hour |
| concurrency | not capped; over-rate answers `429` |

Response headers worth logging: `x-th-plan`, `x-th-free-used-pct`, `x-th-free-resets`,
`x-th-upstream-model`, `x-th-route-decision`.

## Proxies — optional

The CLI runs **direct** by default. Put one exit per line in `proxies.txt` (or pass
`--pool`) and every request — including the fallback browser — leaves through a proxy:

```text
http://127.0.0.1:8080
socks5://user:pass@10.0.0.5:1080
```

Optional — recommended at scale: the panel limits sign-ups per network, so one fresh exit
per account keeps a larger run healthy.

## Connect a local router

Both connectors are idempotent and read `keys.txt`:

```bash
node src/connect-9router.js    --base http://localhost:8080 --password 123456
node src/connect-omniroute.js  --base http://localhost:20128 --password 123456
```

Each creates one `openai-compatible` provider node (`tokenharbor`) with base URL
`https://tokenharbor.ai/v1` and one connection per key, so the router load-balances across
your keys. The launcher menu exposes the same two actions.

## Notes

- Each account belongs to the e-mail address it was created with — keep `accounts.jsonl`
  if you want to log back in later.
- The free tier stores free-route traffic under the consent described in
  `src/consent-text.txt`; paid routes are not used for training.
- The consent text is versioned by the panel. If it changes, the CLI says so and you re-run
  once after pressing **Enable free models** in the dashboard.
- Node.js 18+ is required. `puppeteer-core` is only used when the panel asks for the human
  check; the CLI itself is stdlib-only.

## License

MIT — see [LICENSE](LICENSE).
