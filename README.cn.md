<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

# Token Harbor — 批量 API 密钥

从你的终端创建 Token Harbor (tokenharbor.ai) 账户和 API 密钥。
Token Harbor 提供**兼容 OpenAI** 的端点，并带有永久免费套餐，因此
密钥可在任何 OpenAI SDK、CLI 或本地路由器中使用。

```bash
git clone https://github.com/F0Rextasy/tokenharbor-bulk-apikey.git
cd tokenharbor-bulk-apikey
npm install
echo "YOUR_MAILTRAP_TOKEN" > mailtrap.txt   # free Mailtrap API token, one line (see Setup)
npm start            # menu → "Mint keys" → how many → done
```

`npm start` 会打开一个菜单；选择 **1) Mint keys**，输入一个数字，CLI 就会为每个密钥创建一个
账户，用**实时聊天调用**验证每一个，并将通过验证的密钥写入
`keys.txt`。完成下面一次性的 Mailtrap 令牌设置后，不会再询问其他内容：无需验证码令牌、无需代理、无需提示。

## 设置（一分钟）

Token Harbor 接受看起来像真实入站邮件主机的邮件域名，并拒绝
公共一次性域名，因此 CLI 需要一个它能读取的邮箱：

1. 在 [mailtrap.io](https://mailtrap.io) 创建一个免费账户 → **Settings → API Tokens**。
2. 将令牌放在  旁边（一行），或导出 。

这是唯一的设置步骤。其他一切——每个账户的收件箱、验证链接、
免费模型同意、密钥——都是自动的。

## 你将获得

| 字段 | 值 |
|---|---|
| API 基础地址 | `https://tokenharbor.ai/v1` |
| 认证 | `Authorization: Bearer YOUR_KEY` |
| 免费模型 | `deepseek-v4.1-flash:free` · `deepseek-v4-flash:free` · `mimo-v2.5:free` · `mimo-v2.6-flash:free` |
| 付费模型 | 70+（Claude、Grok、GLM、MiMo Pro …）——它们需要账户上有额度 |
| 密钥格式 | `thk_live_` + 63 个字符 |
| 卡 / 手机 | 免费套餐不需要 |

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

| 标志 | 含义 |
|---|---|
| `--count <n>` | 要创建的账户（和密钥）数量，默认 1 |
| `--pool <file>` | 代理列表，每行一个出口（`http://host:port`、`socks5://user:pass@host:port`、`host:port`） |
| `--headless` | 以无头模式运行回退浏览器（默认：屏幕外窗口，这正是验证码所期望的） |
| `--verify` | 实时验证 `keys.txt` 并打印每个密钥的存活/失效状态 |

输出：`keys.txt`（每行一个密钥，仅包含通过验证的密钥）、`accounts.jsonl`（每个账户一行，
包含各步骤结果，除你拥有的账户电子邮件外不含其他机密）。

## 铸造流程

1. **邮箱** — 使用 Mailtrap 令牌（免费套餐，在 `mailtrap.txt` 中一行）时，CLI 会在你自己的 Mailtrap 账户上
   为每个账户打开一个新收件箱；没有它时，则回退到
   公共 mail.tm / mail.gw 服务。
2. **注册** — Next.js 服务器操作 ID 在每次运行时从实时页面读取，因此
   面板重新部署不会破坏 CLI。设备指纹和时区随
   请求一起发送；时区从你的出口测量，而不是从你的机器。
3. **人工检查** — 一次性邮件域名会让面板回答“完成人工检查”
   （而且它甚至不会在那里渲染组件），因此真实入站邮件主机是可行的
   路径。当组件*确实*被渲染时，注册会在
   真实 Chrome 中重放（`src/solver.js`、`puppeteer-core` + 你机器上已有的 Chrome）：
   表单用真实按键输入，Turnstile 复选框用鼠标点击，会话 cookie 交回给 CLI。
4. **电子邮件验证** — 打开来自邮箱的链接（令牌在
   服务器端被消耗，并返回 `307` 到 `?verify=success`）。
5. **免费模型同意** — 使用仪表板显示的同意文本启用数据共享开关
   （`src/consent-text.txt`）。没有它，每次 `:free` 调用都会返回
   `403 free_models_disabled`。
6. **密钥** — `POST /api/keys`，然后进行**实时门控**：两个不同的提示都必须返回
   `200`，且文本非空且不同。未通过门控的密钥绝不会被写入。

## 质量门控

`keys.txt` 中的每个密钥在铸造时都通过了：

- 在 `:free` 模型上的实时 `chat-200`，以及
- **两个不同的提示**返回 200，且内容非空且**不同**。

无法使用工具的密钥、失效的密钥或失效的提供商会绝不会写入此仓库的
输出或接入组合。可随时用 `node src/cli.js --verify` 重新检查。

## 限制（免费套餐）

| 限制 | 值 |
|---|---|
| 配额 | **标价的百分比**——没有固定请求数 |
| 窗口 | **个人 7 天**，从你的第一个免费请求开始（`x-th-free-resets`） |
| 账户速率 | 60 请求/分钟，1,800 请求/小时 |
| IP 速率 | 100 请求/分钟，3,000 请求/小时 |
| 并发 | 不设上限；超速率返回 `429` |

值得记录的响应头：`x-th-plan`、`x-th-free-used-pct`、`x-th-free-resets`、
`x-th-upstream-model`、`x-th-route-decision`。

## 代理——可选

CLI 默认**直连**。在 `proxies.txt` 中每行放一个出口（或传入
`--pool`），每个请求——包括回退浏览器——都会通过代理发出：

```text
http://127.0.0.1:8080
socks5://user:pass@10.0.0.5:1080
```

可选——大规模时推荐：面板限制每个网络的注册数，因此每个账户使用一个全新出口
可让更大规模的运行保持健康。

## 连接本地路由器

两个连接器都是幂等的，并读取 `keys.txt`：

```bash
node src/connect-9router.js    --base http://localhost:8080 --password 123456
node src/connect-omniroute.js  --base http://localhost:20128 --password 123456
```

每个都会创建一个 `openai-compatible` 提供商节点（`tokenharbor`），基础 URL 为
`https://tokenharbor.ai/v1`，每个密钥一个连接，因此路由器会在
你的密钥之间进行负载均衡。启动器菜单提供相同的两个操作。

## 说明

- 每个账户属于创建它时使用的电子邮件地址——如果你想以后重新登录，请保留 `accounts.jsonl`。
- 免费套餐根据 `src/consent-text.txt` 中描述的同意存储免费路由流量；
  付费路由不用于训练。
- 同意文本由面板进行版本管理。如果它发生变化，CLI 会提示，你在仪表板中按下 **Enable free models** 后
  重新运行一次即可。
- 需要 Node.js 18+。`puppeteer-core` 仅在面板要求人工
  检查时使用；CLI 本身仅使用标准库。

## 许可证

MIT——见 [LICENSE](LICENSE)。