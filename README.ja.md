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

**自動生成された API キーで Token Harbor アカウントを一括作成 — OpenAI 互換推論 (DeepSeek V4.1 Flash、DeepSeek V4 Flash、MiMo V2.5、MiMo V2.6 Flash) + 9Router / OmniRoute コネクタ。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-1%20(browser%20only)-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/free%20models-4-412991?style=for-the-badge)](https://tokenharbor.ai/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)

[🛠 クイックスタート](#-quick-start) · [🎁 無料枠](#-free-tier--how-much-you-get) · [🤖 モデル](#-models--all-4-of-them) · [🧪 API の使い方](#-how-to-use-the-api) · [✅ 検証済み](#-verified-working--every-key-is-tested) · [🧭 仕組み](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ オプション](#️-cli-options) · [🛰️ プロキシ](#️-behind-a-proxy) · [🐞 問題報告](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ これが存在する理由

Token Harbor は Next.js のパネル (Supabase 認証) で、無料枠は**パーセンテージベース**です。個人の
**7 日間ウィンドウ**が最初の無料リクエストから始まり、固定のリクエスト数ではなく定価の一定割合を消費します。
サインアップはメール + パスワードで、**Cloudflare Turnstile ウィジェット**とネットワークごとの制限があります
— 1 ネットワークにつき 1 アカウント — そのため一括実行は実質的に「アカウントごとに 1 つの新しい出口」です。

サインアップ後には 2 つのゲートがあり、どちらも見落としやすいものです。サインアップメールのリンクを開くまで
API は `403 email_verification_required` を返し、無料モデルの同意を有効にするまで、すべての `:free` ルートは
`403 free_models_disabled` を返します — そしてその同意エンドポイントは**クライアントが表示したテキスト
(`shown_text`) を検証する**ため、単なる `{"free_models_enabled":true}` は `400 reload_and_retry` を返します。
この CLI はそのすべてを実行し、実行のたびにライブページから Next.js のアクション ID を読み取り、
ライブの chat-200 を通過したキーだけを書き込みます。

## 🎁 無料枠 — どれだけ使えるか

| 項目 | 値 |
| --- | --- |
| 無料モデル | **4** — DeepSeek V4.1 Flash、DeepSeek V4 Flash、MiMo V2.5、MiMo V2.6 Flash (`:free` サフィックス) |
| 許容量 | **定価に対するパーセンテージ**、固定リクエスト数なし (計測値: 約 25 回の呼び出し後も `0%` のまま) |
| ウィンドウ | **個人の 7 日間**、最初の無料リクエストから開始 (`x-th-free-resets` ヘッダー) |
| アカウントのレート制限 | **60 req/min**、**1,800 req/h** |
| IP レート制限 | **100 req/min**、**3,000 req/h** (レート超過時は待ち時間とともに `429` を返す) |
| 同時実行数 | 上限なし |
| 有料モデル | 70+ (Claude、Grok、GLM、MiMo Pro …) — クレジットが必要。残高ゼロのアカウントは `402` を返す |
| カード登録 | **不要** |
| 電話番号 | **不要** |
| キャプチャ | サインアップ時の **Cloudflare Turnstile** — `src/solver.js` が同じ出口経由でオフスクリーンの Chrome 内で本物のトークンを生成 |
| メール認証 | **必須** — CLI がリンクを開き、`307` をたどって `?verify=success` に到達 |
| スケールする単位 | **1 アカウント = 1 キー** → `--count N` は実質的に「N ネットワークから N アカウント」 |

記録しておく価値のあるヘッダー: `x-th-plan`、`x-th-free-used-pct`、`x-th-free-resets`、
`x-th-upstream-model`、`x-th-route-decision`。

## 🤖 モデル — 4 つすべて

| モデル ID | 備考 |
| --- | --- |
| `deepseek-v4.1-flash:free` | デフォルト。約 9〜11 秒で PONG を返す |
| `deepseek-v4-flash:free` | CLI がライブゲートでも試すフォールバックモデル |
| `mimo-v2.5:free` | MiMo ファミリー |
| `mimo-v2.6-flash:free` | 4 つの中で最速 |

エンドポイントは合計 **78 個のモデル ID** を提供します (有効なキーで `GET /v1/models`)。上記の 4 つは
クレジットなしで動作するものです。ツール/関数呼び出しは無料ルートでも動作します:
`get_time` スキーマは実際の `tool_calls` 配列として返されます。

## 🧪 API の使い方

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

## 🚀 コマンド 1 つ

```bash
npm start            # メニュー → 「Mint keys」 → 個数 → 完了
```

`npm start` はランチャーを開き、**1) Mint keys** は個数だけを尋ねます。その後 CLI はキーごとに
1 アカウントを作成し、それぞれをライブのチャット呼び出しで検証して、生き残ったものを `keys.txt` に
書き込みます。

## 🛠 クイックスタート

```bash
git clone https://github.com/F0Rextasy/tokenharbor-bulk-apikey.git
cd tokenharbor-bulk-apikey
npm install
npm start            # メニューが無料の Mailtrap API トークンを一度だけ尋ね、その後は記憶します
```

**Mailtrap トークンが唯一のセットアップ手順で、ランチャーは一度だけ尋ねます。** Token Harbor は
本物の受信メールホストのように見えるメールドメインを受け付け、公開の使い捨てドメインには
「complete the human check」と返します (それらについてはウィジェットすら描画しません)。そのため CLI には
読み取り可能なメールボックスが必要です。無料枠で十分です: [mailtrap.io](https://mailtrap.io) で
アカウントを作成 → **Settings → API Tokens** → メニューのプロンプトにトークンを貼り付け — これは
`mailtrap.txt` に保存され、二度と尋ねられません (または `MAILTRAP_TOKEN` をエクスポートするか、
ファイルを自分で書いてください)。

トークンがなくても CLI は動作し、公開メールサービスにフォールバックし、パネルがそのアドレスを
拒否したときはっきりと伝えます。

## ✅ 動作検証済み — すべてのキーがテストされます

キーが `keys.txt` に書き込まれるのは、作成時に以下を通過した場合のみです:

- `:free` モデルでのライブ `chat-200`、および
- **2 つの異なるプロンプト**が 200 を返し、内容が空でなく、かつ**異なる**こと。

エンドツーエンドの計測 (`node src/cli.js --auto --count 1 --pool proxies.txt`):

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

いつでも `npm start` → **2) Verify keys** (`node src/cli.js --verify`) で再確認できます。死んだキーは
`keys-dead.txt` に移動し、ライブゲートを完了できなかったキー (例: ネットワークがレート制限に
達した) は `keys-unverified.txt` に入るため、アカウントが失われることはありません。

## 🧭 仕組み

1. **メールボックス** — あなたの Mailtrap アカウント上でアカウントごとに新しい受信箱 (`mailtrap.txt`)。
   公開の mail.tm / mail.gw がフォールバックのレールです。
2. **サインアップ** — Next.js のサーバーアクション ID (`next-action`、`$ACTION_KEY`、
   `x-deployment-id`) は実行のたびにライブページから読み取られるため、パネルの再デプロイで CLI が
   壊れることはありません。デバイスフィンガープリントとタイムゾーンはリクエストとともに送られ、
   タイムゾーンはあなたのマシンではなく出口から計測されます。
3. **ヒューマンチェック** — パネルがウィジェットを描画するとき、サインアップは実際の Chrome で
   リプレイされます (`src/solver.js`、`puppeteer-core` + 既にインストール済みの Chrome。
   `--enable-automation` は意図的に抑制されます)。チェックボックスはマウスでクリックされ、
   そのブラウザのセッション Cookie が CLI に引き渡されます。
4. **メール認証** — メールボックスからのリンクが開かれます。トークンはサーバー側で消費され、
   `307 → /dashboard?verify=success` を返します。
5. **無料モデルの同意** — ダッシュボードが表示する同意テキスト (`src/consent-text.txt`) を伴う
   `POST /api/me/privacy`、`screen: "consent_modal"`、`path: "/dashboard"`。
6. **キー + ライブゲート** — `POST /api/keys`、その後キーが書き込まれる前に 2 つの異なるプロンプトが
   両方とも 200 を返し、内容が異なる必要があります。

## ⚙️ CLI オプション

```bash
node src/cli.js --auto --count 5             # 5 アカウント → 5 キー
node src/cli.js --auto --count 5 --pool proxies.txt
node src/cli.js --verify                     # keys.txt をライブチェック、死んだもの → keys-dead.txt
node src/cli.js --screen --pool proxies.txt  # どの出口がパネルに到達できるか
node src/cli.js --models                     # 無料モデル一覧 (キーが必要)
node src/cli.js --help
```

| フラグ | 意味 |
| --- | --- |
| `--count <n>` | 作成するアカウント (およびキー) の数、デフォルト 1 |
| `--pool <file>` | プロキシリスト、1 行に 1 出口 (`http://host:port`、`socks5://user:pass@host:port`、`host:port`)。インラインの `#` コメントも可 |
| `--headless` | フォールバックブラウザをヘッドレスで実行 (デフォルト: オフスクリーンウィンドウ。キャプチャはこれを期待します) |
| `--screen` | プールをパネルに対してテストし、出口ごとに live/dead を表示 |
| `--verify` | `keys.txt` をライブ検証。死んだキーは `keys-dead.txt` に書き込まれる |
| `--models` | 無料モデル ID を表示 |

死にかけた出口がアカウントを犠牲にすることはありません: サインアップとライブゲートはどちらも
他のプール行でリトライし、`429` はパネルが指定した時間だけ待機します。

## 🛰️ プロキシ経由

CLI はデフォルトで**直接**実行されます。`proxies.txt` に 1 行に 1 出口を書くか (ランチャーが
自動的に読み取ります)、`--pool` を渡してください:

```text
http://127.0.0.1:8080
socks5://user:pass@10.0.0.5:1080
10.0.0.5:8080
```

オプション — 大規模実行では推奨: パネルはサインアップを**ネットワークごと**に制限するため、
アカウントごとに 1 つの新しい出口を使うと大規模実行が健全に保たれます。メールはあなたの Mailtrap
アカウントから直接読まれるため (メールプロバイダはパネルではありません)、遅い出口がメールボックス
のステップを壊すことはありません。

## 📄 ファイル

| パス | 内容 |
| --- | --- |
| `keys.txt` | 検証済みキー、1 行に 1 つ (ライブゲート通過後にのみ書き込まれる) |
| `keys-dead.txt` | 応答しなくなったキー (`--verify` から) |
| `keys-unverified.txt` | ライブゲートを完了できなかったキー — アカウントは存在し、キーは本物 |
| `accounts.jsonl` | アカウントごとに 1 行: メール + ステップ結果 |
| `mailtrap.txt` | あなたの Mailtrap API トークン (1 行) |
| `proxies.txt` | オプションのプロキシリスト |
| `src/cli.js` | mint / verify / screen の CLI |
| `src/launcher.js` | メニュー (`npm start`) |
| `src/solver.js` | Turnstile ウィジェット用のブラウザ側 |
| `src/consent-text.txt` | パネルが検証する同意テキスト |
| `src/connect-9router.js`、`src/connect-omniroute.js` | ルーターコネクタ |

## 🔌 9Router に接続

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

1 つの `openai-compatible` プロバイダノード (`tokenharbor`、ベース URL
`https://tokenharbor.ai/v1`) と、`keys.txt` 内のキーごとに 1 つの接続を登録するため、9Router は
あなたのキー間で負荷分散します。冪等: 既存のノードや接続は再利用され、番号は既に存在する
最大の `tokenharbor-0NN` から続きます。

## 🔌 OmniRoute に接続

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
```

OmniRoute も同じ形です (プロバイダノード + キーごとに 1 接続)。ランチャーは両方をメニュー項目
**6** と **7** として公開しており、`npm run 9router` / `npm run omniroute` も同じことを行います。

## 🔑 1 つのキーで得られるもの

- 上記の 4 つの `:free` モデルを、アカウントあたり 60 req/min および 1,800 req/h で (IP あたり 100 req/min);
- 個人の 7 日間ウィンドウ内でのパーセンテージベースの許容量 (`x-th-free-resets` がロールオーバーの
  タイミングを教えてくれます);
- ツール呼び出しを備えた OpenAI 互換の `/v1/chat/completions`。そのため任意の OpenAI SDK、CLI、
  ルーターが `base_url` を `https://tokenharbor.ai/v1` に変更するだけで動作します;
- 有料モデルはアカウントにクレジットがあるまでロックされたままです (それ以外は `402`)。

## 🐞 問題報告

コマンド、失敗したステップ (CLI は `precheck / signup / verify / consent / key / chat` を表示します)、
およびパネル自身のメッセージを添えて issue を開いてください。完全な API キーは決して貼り付けないで
ください — 最後の 4 文字で十分です。

## 📄 ライセンス

MIT — [LICENSE](LICENSE) を参照してください。このツールは Token Harbor とは提携していません。
所有するアカウントに使用し、パネルの利用規約を尊重してください。