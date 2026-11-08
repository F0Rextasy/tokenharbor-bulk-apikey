<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

# Token Harbor — 一括APIキー

ターミナルから Token Harbor (tokenharbor.ai) のアカウントとAPIキーを作成します。
Token Harbor は**OpenAI互換**のエンドポイントを恒久的な無料枠付きで提供しているため、
キーは任意の OpenAI SDK、CLI、ローカルルーターで利用できます。

```bash
git clone https://github.com/F0Rextasy/tokenharbor-bulk-apikey.git
cd tokenharbor-bulk-apikey
npm install
echo "YOUR_MAILTRAP_TOKEN" > mailtrap.txt   # free Mailtrap API token, one line (see Setup)
npm start            # menu → "Mint keys" → how many → done
```

`npm start` でメニューが開きます。**1) Mint keys** を選び、数値を入力すると、CLI がキーごとに
1アカウントを作成し、それぞれを**ライブチャット呼び出し**で検証し、成功したものを
`keys.txt` に書き込みます。以下の一度きりの Mailtrap トークン設定以外は何も求められません。captcha トークンもプロキシもプロンプトも不要です。

## セットアップ（1分）

Token Harbor は実在する受信メールホストのように見えるメールドメインを受け付け、公開の使い捨てドメインは拒否するため、CLI には読み取り可能なメールボックスが必要です：

1. [mailtrap.io](https://mailtrap.io) で無料アカウントを作成 → **Settings → API Tokens**。
2. トークンを の隣の に記述する（1行）、または をエクスポートします。

セットアップ手順はこれだけです。それ以外 — アカウントごとの受信箱、確認リンク、
無料モデルの同意、キー — はすべて自動です。

## 得られるもの

| 項目 | 値 |
|---|---|
| API ベース | `https://tokenharbor.ai/v1` |
| 認証 | `Authorization: Bearer YOUR_KEY` |
| 無料モデル | `deepseek-v4.1-flash:free` · `deepseek-v4-flash:free` · `mimo-v2.5:free` · `mimo-v2.6-flash:free` |
| 有料モデル | 70以上（Claude、Grok、GLM、MiMo Pro など）— アカウントにクレジットが必要です |
| キー形式 | `thk_live_` + 63文字 |
| カード / 電話番号 | 無料枠では不要 |

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
| `--count <n>` | 作成するアカウント（およびキー）の数、デフォルトは1 |
| `--pool <file>` | プロキシリスト、1行に1つの出口（`http://host:port`、`socks5://user:pass@host:port`、`host:port`） |
| `--headless` | フォールバックブラウザをヘッドレスで実行（デフォルト：オフスクリーンウィンドウ、captcha が期待する形式） |
| `--verify` | `keys.txt` をライブ検証し、キーごとに live/dead を表示 |

出力：`keys.txt`（1行に1キー、合格したキーのみ）、`accounts.jsonl`（1行に
1アカウント、ステップ結果を含み、所有するアカウントのメールアドレス以外の秘密情報は含みません）。

## ミントの仕組み

1. **メールボックス** — Mailtrap トークン（無料枠、`mailtrap.txt` に1行）がある場合、CLI は
   あなた自身の Mailtrap アカウント上でアカウントごとに新しい受信箱を開きます。ない場合は、
   公開の mail.tm / mail.gw サービスにフォールバックします。
2. **サインアップ** — Next.js サーバーアクションの ID は実行のたびにライブページから読み取られるため、
   パネルの再デプロイで CLI が壊れることはありません。デバイスフィンガープリントとタイムゾーンは
   リクエストとともに送信されます。タイムゾーンはあなたのマシンではなく、出口から測定されます。
3. **人間チェック** — 使い捨てメールドメインではパネルが「complete the human check」と応答します
   （そしてその場合ウィジェットすらレンダリングしません）。そのため、実在する受信メールホストが
   機能するレールです。ウィジェットが*レンダリングされる*場合、サインアップは
   実際の Chrome で再実行されます（`src/solver.js`、`puppeteer-core` + あなたのマシンに既にある Chrome）：
   フォームは実際のキー入力で入力され、Turnstile チェックボックスはマウスでクリックされ、
   セッション Cookie が CLI に返されます。
4. **メール確認** — メールボックスからのリンクが開かれます（トークンはサーバー側で消費され、
   `?verify=success` への `307` を返します）。
5. **無料モデルの同意** — データ共有スイッチが、ダッシュボードに表示される同意テキスト
   （`src/consent-text.txt`）で有効化されます。これがないと、すべての `:free` 呼び出しが
   `403 free_models_disabled` を返します。
6. **キー** — `POST /api/keys`、続いて**ライブゲート**：2つの異なるプロンプトが両方とも
   `200` で空でない、異なるテキストを返す必要があります。ゲートに失敗したキーは書き込まれません。

## 品質ゲート

`keys.txt` 内のすべてのキーは、ミント時に以下を通過しています：

- `:free` モデルでのライブ `chat-200`、および
- **2つの異なるプロンプト**が 200 で空でない、**異なる**内容を返すこと。

ツールを使用できないキー、死んだキー、死んだプロバイダーは、このリポジトリの
出力に書き込まれたり、コンボに組み込まれたりすることはありません。`node src/cli.js --verify` でいつでも再確認できます。

## 制限（無料枠）

| 制限 | 値 |
|---|---|
| 許容量 | **定価に対する割合** — 固定のリクエスト数ではありません |
| ウィンドウ | **個人ごとの7日間**、最初の無料リクエストで開始（`x-th-free-resets`） |
| アカウントレート | 60リクエスト/分、1,800リクエスト/時 |
| IPレート | 100リクエスト/分、3,000リクエスト/時 |
| 同時実行数 | 上限なし、レート超過時は `429` を返します |

ログに記録する価値のあるレスポンスヘッダー：`x-th-plan`、`x-th-free-used-pct`、`x-th-free-resets`、
`x-th-upstream-model`、`x-th-route-decision`。

## プロキシ — オプション

CLI はデフォルトで**直接**実行されます。`proxies.txt` に1行に1つの出口を記述する（または
`--pool` を渡す）と、すべてのリクエスト — フォールバックブラウザを含む — がプロキシ経由で送信されます：

```text
http://127.0.0.1:8080
socks5://user:pass@10.0.0.5:1080
```

オプション — 大規模な実行では推奨：パネルはネットワークごとのサインアップを制限するため、
アカウントごとに1つの新しい出口を使用すると、大規模な実行を健全に保てます。

## ローカルルーターへの接続

両方のコネクターは冪等で、`keys.txt` を読み取ります：

```bash
node src/connect-9router.js    --base http://localhost:8080 --password 123456
node src/connect-omniroute.js  --base http://localhost:20128 --password 123456
```

それぞれが1つの `openai-compatible` プロバイダーノード（`tokenharbor`）をベース URL
`https://tokenharbor.ai/v1` で作成し、キーごとに1つの接続を作成するため、ルーターは
あなたのキー間で負荷分散します。ランチャーメニューでも同じ2つのアクションを実行できます。

## 注意事項

- 各アカウントは作成に使用したメールアドレスに属します — 後でログインし直したい場合は
  `accounts.jsonl` を保管してください。
- 無料枠は、`src/consent-text.txt` に記載された同意のもとで無料ルートのトラフィックを保存します。
  有料ルートはトレーニングには使用されません。
- 同意テキストはパネルによってバージョン管理されています。変更された場合、CLI がその旨を通知するので、
  ダッシュボードで **Enable free models** を押してから一度再実行してください。
- Node.js 18+ が必要です。`puppeteer-core` はパネルが人間チェックを要求した場合にのみ使用されます。
  CLI 自体は標準ライブラリのみを使用します。

## ライセンス

MIT — [LICENSE](LICENSE) を参照してください。
