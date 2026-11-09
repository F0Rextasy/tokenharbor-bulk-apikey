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

**APIキーを自動生成してToken Harborアカウントを一括作成 — OpenAI互換の推論（DeepSeek V4.1 Flash、DeepSeek V4 Flash、MiMo V2.5、MiMo V2.6 Flash）+ 9Router / OmniRouteコネクタ。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-1%20(browser%20only)-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/free%20models-4-412991?style=for-the-badge)](https://tokenharbor.ai/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)

[🛠 クイックスタート](#-quick-start) · [🎁 無料枠](#-free-tier--how-much-you-get) · [🤖 モデル](#-models--all-4-of-them) · [🧪 APIを使う](#-how-to-use-the-api) · [✅ 検証済み](#-verified-working--every-key-is-tested) · [🧭 仕組み](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ オプション](#️-cli-options) · [🛰️ プロキシ](#️-behind-a-proxy) · [🐞 問題報告](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ これが存在する理由

Token HarborはNext.jsのパネル（Supabase認証）で、無料枠は**パーセンテージ制**です。個人の**7日間ウィンドウ**が最初の無料リクエストで始まり、固定のリクエスト数ではなく定価の一定割合を消費します。サインアップはメールアドレス + パスワードで、**Cloudflare Turnstileウィジェット**とネットワークごとの制限があります — 1ネットワークにつき1アカウントなので、一括実行は実質的に「アカウントごとに1つの新しい出口」です。

サインアップ後には2つのゲートがあり、どちらも見落としやすいものです。サインアップメールのリンクを開くまでAPIは`403 email_verification_required`を返し、無料モデルの同意を有効にするまで全ての`:free`ルートは`403 free_models_disabled`を返します — そしてその同意エンドポイントは**クライアントが表示したテキストを検証する**（`shown_text`）ため、単なる`{"free_models_enabled":true}`では`400 reload_and_retry`が返ります。このCLIはそのすべてを実行し、実行のたびにライブページからNext.jsのアクションIDを読み取り、ライブのchat-200を通過したキーだけを書き込みます。

## 🎁 無料枠 — どれだけ使えるか

| 項目 | 値 |
| --- | --- |
| 無料モデル | **4** — DeepSeek V4.1 Flash、DeepSeek V4 Flash、MiMo V2.5、MiMo V2.6 Flash（`:free`サフィックス） |
| 割当量 | **定価に対するパーセンテージ**、固定リクエスト数なし（実測: 約25回の呼び出し後も`0%`のまま） |
| ウィンドウ | **個人の7日間**、最初の無料リクエストで開始（`x-th-free-resets`ヘッダー） |
| アカウントのレート制限 | **60 req/min**、**1,800 req/h** |
| IPレート制限 | **100 req/min**、**3,000 req/h**（レート超過時は待ち時間とともに`429`を返す） |
| 同時実行数 | 上限なし |
| 有料モデル | 70以上（Claude、Grok、GLM、MiMo Pro …）— クレジットが必要。残高ゼロのアカウントは`402`を返す |
| カード必須 | **いいえ** |
| 電話番号必須 | **いいえ** |
| キャプチャ | サインアップ時の**Cloudflare Turnstile** — `src/solver.js`が同じ出口経由でオフスクリーンのChrome内で本物のトークンを生成 |
| メール認証 | **必須** — CLIがリンクを開き、`307`をたどって`?verify=success`へ |
| スケールする単位 | **1アカウント = 1キー** → `--count N`は実質的に「NネットワークからNアカウント」 |

記録しておく価値のあるヘッダー: `x-th-plan`、`x-th-free-used-pct`、`x-th-free-resets`、`x-th-upstream-model`、`x-th-route-decision`。

## 🤖 モデル — 全4種類

| モデルID | 備考 |
| --- | --- |
| `deepseek-v4.1-flash:free` | デフォルト。PONGを約9〜11秒で返す |
| `deepseek-v4-flash:free` | CLIがライブゲートでも試すフォールバックモデル |
| `mimo-v2.5:free` | MiMoファミリー |
| `mimo-v2.6-flash:free` | 4つの中で最速 |

エンドポイントは合計**78のモデルID**を提供します（有効なキーで`GET /v1/models`）。上記の4つはクレジットなしで動作するものです。ツール/関数呼び出しは無料ルートでも動作します: `get_time`スキーマは実際の`tool_calls`配列として返ります。

## 🧪 APIの使い方

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

## 🚀 コマンド1つ

```bash
npm start            # メニュー → 「Mint keys」 → いくつ → 完了
```

`npm start`はランチャーを開き、**1) Mint keys**は数だけを尋ねてそれ以外は何も聞かず、その後CLIがキーごとに1アカウントを作成し、それぞれをライブのchat呼び出しで検証して、生き残ったものを`keys.txt`に書き込みます。

## 🛠 クイックスタート

```bash
git clone https://github.com/F0Rextasy/tokenharbor-bulk-apikey.git
cd tokenharbor-bulk-apikey
npm install
echo "YOUR_MAILTRAP_TOKEN" > mailtrap.txt   # 必須 — 下記の警告を参照
npm start            # メニュー → 1) Mint keys → いくつ → 完了
```

> **`mailtrap.txt`がないとミントは全く動作しません。** Token Harborはすべての公開メールボックスドメインを拒否するため、認証リンクを読めるものがなく、すべてのアカウントが`403 email_verification_required`で止まります。フォールバックはありません: まず無料トークンを取得してください。

**Mailtrapトークンが唯一のセットアップ手順です。** Token Harborは本物の受信メールホストのように見えるメールドメインを受け入れ、公開の使い捨てドメインには「complete the human check」と返します（それらについてはウィジェットすらレンダリングしません）。そのためCLIには読み取り可能なメールボックスが必要です。無料枠で十分です: [mailtrap.io](https://mailtrap.io)でアカウントを作成 → **Settings → API Tokens**、その値を`package.json`の隣の`mailtrap.txt`に書き込み（1行）、または`MAILTRAP_TOKEN`をエクスポートします。ランチャーはそれをチェックし、欠けていれば知らせます — 値そのものを尋ねることは決してありません。

トークンがない場合、CLIはまず公開メールレールを試みますが、すべてのアカウントがパネルのヒューマンチェックの壁で止まります — だからこそこのファイルは任意ではなく必須なのです。

## ✅ 動作検証済み — すべてのキーがテストされる

キーが`keys.txt`に書き込まれるのは、ミント時に以下の条件を満たした後だけです:

- `:free`モデルでのライブ`chat-200`、および
- **2つの異なるプロンプト**が200を返し、内容が空でなく、かつ**異なる**こと。

エンドツーエンドの実測（`node src/cli.js --auto --count 1 --pool proxies.txt`）:

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

いつでも`npm start` → **2) Verify keys**（`node src/cli.js --verify`）で再チェックできます。死んだキーは`keys-dead.txt`に移動し、ライブゲートを完了できなかったキー（例: ネットワークがレート制限に達した）は`keys-unverified.txt`に入るので、アカウントが失われることはありません。

## 🧭 仕組み

1. **メールボックス** — Mailtrapアカウント（`mailtrap.txt`）上でアカウントごとに新しい受信箱を作成。公開のmail.tm / mail.gwがフォールバックレールです。
2. **サインアップ** — Next.jsのサーバーアクションID（`next-action`、`$ACTION_KEY`、`x-deployment-id`）は実行のたびにライブページから読み取られるため、パネルの再デプロイでCLIが壊れることはありません。デバイスフィンガープリントとタイムゾーンはリクエストとともに送られ、タイムゾーンはあなたのマシンではなく出口から測定されます。
3. **ヒューマンチェック** — パネルがウィジェットをレンダリングする場合、サインアップは実際のChromeで再生されます（`src/solver.js`、`puppeteer-core` + 既にインストール済みのChrome。`--enable-automation`は意図的に抑制）。チェックボックスはマウスでクリックされ、そのブラウザのセッションCookieがCLIに引き渡されます。
4. **メール認証** — メールボックスからのリンクが開かれます。トークンはサーバー側で消費され、`307 → /dashboard?verify=success`を返します。
5. **無料モデルの同意** — ダッシュボードが表示する同意テキスト（`src/consent-text.txt`）とともに`POST /api/me/privacy`を送信、`screen: "consent_modal"`、`path: "/dashboard"`。
6. **キー + ライブゲート** — `POST /api/keys`の後、キーが書き込まれる前に2つの異なるプロンプトが両方とも200で異なる内容を返す必要があります。

## ⚙️ CLIオプション

```bash
node src/cli.js --auto --count 5             # 5アカウント → 5キー
node src/cli.js --auto --count 5 --pool proxies.txt
node src/cli.js --verify                     # keys.txtをライブチェック、死んだもの → keys-dead.txt
node src/cli.js --screen --pool proxies.txt  # どの出口がパネルに到達できるか
node src/cli.js --models                     # 無料モデル一覧（キーが必要）
node src/cli.js --help
```

| フラグ | 意味 |
| --- | --- |
| `--count <n>` | 作成するアカウント（およびキー）の数、デフォルト1 |
| `--pool <file>` | プロキシリスト、1行に1出口（`http://host:port`、`socks5://user:pass@host:port`、`host:port`）。インラインの`#`コメントも可 |
| `--headless` | フォールバックブラウザをヘッドレスで実行（デフォルト: オフスクリーンウィンドウ、キャプチャが期待するもの） |
| `--screen` | プールをパネルに対してテストし、出口ごとにライブ/デッドを表示 |
| `--verify` | `keys.txt`をライブ検証。死んだキーは`keys-dead.txt`に書き込まれる |
| `--models` | 無料モデルIDを表示 |
| `--strict-proxy` | 直接リクエストを一切送らない: ライブゲートもプール経由でなければならない（環境変数`TOKENHARBOR_STRICT=1`も同じ） |

死にかけた出口がアカウントを失わせることはありません: サインアップとライブゲートは両方とも他のプール行でリトライし、`429`はパネルが指定した時間だけ待機します。

## 🛰️ プロキシの背後で

CLIはデフォルトで**直接**実行されます。`proxies.txt`に1行に1出口を記述するか（ランチャーが自動的に拾います）、`--pool`を渡します:

```text
http://127.0.0.1:8080
socks5://user:pass@10.0.0.5:1080
10.0.0.5:8080
```

任意 — 大規模実行では推奨: パネルはサインアップを**ネットワークごと**に制限するため、アカウントごとに新しい出口を使うと大規模な実行が健全に保たれます。メールはMailtrapアカウントから直接読まれる（メールプロバイダはパネルではない）ため、遅い出口がメールボックスのステップを壊すことはありません。

## 📄 ファイル

| パス | 内容 |
| --- | --- |
| `keys.txt` | 検証済みキー、1行に1つ（ライブゲート通過後にのみ書き込み） |
| `keys-dead.txt` | 応答しなくなったキー（`--verify`から） |
| `keys-unverified.txt` | ライブゲートを完了できなかったキー — アカウントは存在し、キーは本物 |
| `accounts.jsonl` | アカウントごとに1行: メール + ステップ結果 |
| `mailtrap.txt` | あなたのMailtrap APIトークン（1行） |
| `proxies.txt` | 任意のプロキシリスト |
| `src/cli.js` | ミント / 検証 / スクリーニングのCLI |
| `src/launcher.js` | メニュー（`npm start`） |
| `src/solver.js` | Turnstileウィジェット用のブラウザ側部分 |
| `src/consent-text.txt` | パネルが検証する同意テキスト |
| `src/connect-9router.js`、`src/connect-omniroute.js` | ルーターコネクタ |

## 🔌 9Routerへの接続

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

1つの`openai-compatible`プロバイダノード（`tokenharbor`、ベースURL `https://tokenharbor.ai/v1`）と、`keys.txt`内のキーごとに1つの接続を登録するので、9Routerがあなたのキー間で負荷分散します。冪等: 既存のノードや接続は再利用され、番号は既に存在する最大の`tokenharbor-0NN`から続きます。

## 🔌 OmniRouteへの接続

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
```

OmniRouteも同じ形（プロバイダノード + キーごとに1接続）。ランチャーは両方をメニュー項目**6**と**7**として公開し、`npm run 9router` / `npm run omniroute`も同じことを行います。

## 🔑 1つのキーで得られるもの

- 上記の4つの`:free`モデル、アカウントあたり60 req/minおよび1,800 req/h（IPあたり100 req/min）。
- 個人の7日間ウィンドウ内でのパーセンテージベースの割当量（`x-th-free-resets`がロールオーバーの時期を教えてくれます）。
- ツール呼び出し対応のOpenAI互換`/v1/chat/completions`なので、`base_url`を`https://tokenharbor.ai/v1`に変えるだけで、あらゆるOpenAI SDK、CLI、ルーターが動作します。
- 有料モデルはアカウントにクレジットがあるまでロックされたままです（それ以外は`402`）。

## 🐞 問題報告

コマンド、失敗したステップ（CLIは`precheck / signup / verify / consent / key / chat`を出力します）、パネル自身のメッセージを添えてissueを開いてください。完全なAPIキーを貼り付けないでください — 最後の4文字で十分です。

## 📄 ライセンス

MIT — [LICENSE](LICENSE)を参照。このツールはToken Harborと提携していません。所有するアカウントにのみ使用し、パネルの利用規約を尊重してください。