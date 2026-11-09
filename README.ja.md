<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

# Token Harbor — 一括 API キー

ターミナルから Token Harbor (tokenharbor.ai) のアカウントと API キーを作成します。
Token Harbor は**OpenAI 互換**のエンドポイントを恒久的な無料枠付きで提供しているため、
キーはあらゆる OpenAI SDK、CLI、ローカルルーターで利用できます。

```bash
git clone https://github.com/F0Rextasy/tokenharbor-bulk-apikey.git
cd tokenharbor-bulk-apikey
npm install
echo "YOUR_MAILTRAP_TOKEN" > mailtrap.txt   # free Mailtrap API token, one line (see Setup)
npm start            # menu → "Mint keys" → how many → done
```

`npm start` でメニューが開きます。**1) Mint keys** を選び、数値を入力すると、CLI はキーごとに
1 つのアカウントを作成し、それぞれを**ライブチャット呼び出し**で検証し、成功したものを
`keys.txt` に書き出します。以下の一度きりの Mailtrap トークン設定以外は何も求められません。captcha トークンもプロキシもプロンプトもありません。

## セットアップ (1 分)

Token Harbor は本物の受信メールホストのように見えるメールドメインを受け付け、公開の使い捨てドメインを拒否するため、CLI には読み取り可能なメールボックスが必要です:

1. [mailtrap.io](https://mailtrap.io) で無料アカウントを作成 → **Settings → API Tokens**。
2. トークンを の隣の に (1 行で) 記入するか、 をエクスポートします。

これが唯一のセットアップ手順です。それ以外 — アカウントごとの受信トレイ、検証リンク、
無料モデルの同意、キー — はすべて自動です。

## 得られるもの

| フィールド | 値 |
|---|---|
| API ベース | `https://tokenharbor.ai/v1` |
| 認証 | `Authorization: Bearer YOUR_KEY` |
| 無料モデル | `deepseek-v4.1-flash:free` · `deepseek-v4-flash:free` · `mimo-v2.5:free` · `mimo-v2.6-flash:free` |
| 有料モデル | 70 以上 (Claude、Grok、GLM、MiMo Pro …) — アカウントにクレジットが必要です |
| キー形式 | `thk_live_` + 63 文字 |
| カード / 電話 | 無料枠では不要 |

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

| フラグ | 意味 |
|---|---|
| `--count <n>` | 作成するアカウント (およびキー) の数、デフォルトは 1 |
| `--pool <file>` | プロキシリスト、1 行に 1 つの出口 (`http://host:port`、`socks5://user:pass@host:port`、`host:port`) |
| `--headless` | フォールバックブラウザをヘッドレスで実行 (デフォルト: オフスクリーンウィンドウ。captcha が期待するのはこちら) |
| `--verify` | `keys.txt` をライブ検証し、キーごとに live/dead を表示 |

出力: `keys.txt` (1 行に 1 キー、合格したキーのみ)、`accounts.jsonl` (1 行に 1 アカウント、
ステップ結果付き。あなたが所有するアカウントのメールアドレス以外の秘密情報は含みません)。

## ミントの仕組み

1. **メールボックス** — Mailtrap トークン (無料枠、`mailtrap.txt` に 1 行) がある場合、CLI は
   あなた自身の Mailtrap アカウント上でアカウントごとに新しい受信トレイを開きます。ない場合は、
   公開の mail.tm / mail.gw サービスにフォールバックします。
2. **サインアップ** — Next.js サーバーアクションの ID は毎回ライブページから読み取られるため、
   パネルが再デプロイされても CLI は壊れません。デバイスフィンガープリントとタイムゾーンは
   リクエストとともに送信されます。タイムゾーンはあなたのマシンではなく、出口から測定されます。
3. **人間チェック** — 使い捨てメールドメインを使うと、パネルは「complete the human check」と応答します
   (しかもそこでウィジェットをレンダリングすらしません)。そのため、本物の受信メールホストが
   機能するレールとなります。ウィジェットが*実際に*レンダリングされた場合、サインアップは
   実際の Chrome で再生されます (`src/solver.js`、`puppeteer-core` + あなたのマシンに既にある
   Chrome): フォームは実際のキー入力で入力され、Turnstile チェックボックスはマウスでクリックされ、
   セッション Cookie が CLI に返されます。
4. **メール検証** — メールボックスからのリンクが開かれます (トークンはサーバー側で消費され、
   `?verify=success` への `307` を返します)。
5. **無料モデルの同意** — データ共有スイッチは、ダッシュボードが表示する同意テキスト
   (`src/consent-text.txt`) で有効化されます。これがないと、すべての `:free` 呼び出しは
   `403 free_models_disabled` を返します。
6. **キー** — `POST /api/keys` の後、**ライブゲート**: 2 つの異なるプロンプトが両方とも
   `200` で空でない、異なるテキストを返す必要があります。ゲートに失敗したキーは決して書き込まれません。

## 品質ゲート

`keys.txt` 内のすべてのキーは、ミント時に以下を通過しています:

- `:free` モデルでのライブ `chat-200`、および
- **2 つの異なるプロンプト**が 200 で空でない、**異なる**内容を返すこと。

ツールを使えないキー、死んだキー、死んだプロバイダーは、このリポジトリの出力に書き込まれたり、
コンボに組み込まれたりすることは決してありません。`node src/cli.js --verify` でいつでも再確認できます。

## 制限 (無料枠)

| 制限 | 値 |
|---|---|
| 許容量 | **定価に対する割合** — 固定のリクエスト数ではありません |
| ウィンドウ | **個人ごとに 7 日間**、最初の無料リクエストで開始 (`x-th-free-resets`) |
| アカウントレート | 60 リクエスト/分、1,800 リクエスト/時 |
| IP レート | 100 リクエスト/分、3,000 リクエスト/時 |
| 同時実行数 | 上限なし。レート超過時は `429` を返します |

ログに記録する価値のあるレスポンスヘッダー: `x-th-plan`、`x-th-free-used-pct`、`x-th-free-resets`、
`x-th-upstream-model`、`x-th-route-decision`。

## プロキシ — オプション

CLI はデフォルトで**直接**実行されます。`proxies.txt` に 1 行に 1 つの出口を記入する
(または `--pool` を渡す) と、すべてのリクエスト — フォールバックブラウザを含む — が
プロキシ経由で送信されます:

```text
http://127.0.0.1:8080
socks5://user:pass@10.0.0.5:1080
```

オプション — 大規模運用では推奨: パネルはネットワークごとにサインアップを制限するため、
アカウントごとに新しい出口を使うと、より大きな実行を健全に保てます。

## ローカルルーターへの接続

両方のコネクターは冪等で、`keys.txt` を読み取ります:

```bash
node src/connect-9router.js    --base http://localhost:8080 --password 123456
node src/connect-omniroute.js  --base http://localhost:20128 --password 123456
```

それぞれが 1 つの `openai-compatible` プロバイダーノード (`tokenharbor`) をベース URL
`https://tokenharbor.ai/v1` で作成し、キーごとに 1 つの接続を作成するため、ルーターは
あなたのキー間で負荷分散します。ランチャーメニューからも同じ 2 つの操作を実行できます。

## 注意事項

- 各アカウントは作成時のメールアドレスに属します — 後でログインし直したい場合は
  `accounts.jsonl` を保管してください。
- 無料枠は、`src/consent-text.txt` に記載された同意のもとで無料ルートのトラフィックを
  保存します。有料ルートはトレーニングには使用されません。
- 同意テキストはパネルによってバージョン管理されています。変更された場合、CLI がその旨を
  通知するので、ダッシュボードで **Enable free models** を押してから一度再実行してください。
- Node.js 18 以上が必要です。`puppeteer-core` はパネルが人間チェックを要求した場合にのみ
  使用されます。CLI 自体は標準ライブラリのみです。

## ライセンス

MIT — [LICENSE](LICENSE) を参照してください。