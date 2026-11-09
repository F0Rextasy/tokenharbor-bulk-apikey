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

**批量创建 Token Harbor 账户并自动生成 API 密钥 — OpenAI 兼容推理（DeepSeek V4.1 Flash、DeepSeek V4 Flash、MiMo V2.5、MiMo V2.6 Flash）+ 9Router / OmniRoute 连接器。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-1%20(browser%20only)-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/free%20models-4-412991?style=for-the-badge)](https://tokenharbor.ai/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)

[🛠 快速开始](#-quick-start) · [🎁 免费额度](#-free-tier--how-much-you-get) · [🤖 模型](#-models--all-4-of-them) · [🧪 使用 API](#-how-to-use-the-api) · [✅ 已验证](#-verified-working--every-key-is-tested) · [🧭 工作原理](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ 选项](#️-cli-options) · [🛰️ 代理](#️-behind-a-proxy) · [🐞 问题](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 为什么有这个项目

Token Harbor 是一个 Next.js 面板（Supabase 认证），其免费额度是**按百分比计算**的：个人**7 天窗口**从你的第一次免费请求开始，消耗的是标价的一个比例，而不是固定的请求次数。注册使用邮箱 + 密码，并带有 **Cloudflare Turnstile 组件**和按网络限制——一个网络只能注册一个账户——所以批量运行实际上就是"每个账户一个全新出口"。

注册之后有两道关卡，两者都很容易被忽略：在打开注册邮件中的链接之前，API 会返回 `403 email_verification_required`；在启用免费模型同意之前，每个 `:free` 路由都会返回 `403 free_models_disabled`——而且该同意端点**会校验客户端展示的文本**（`shown_text`），所以只发送 `{"free_models_enabled":true}` 会返回 `400 reload_and_retry`。本 CLI 会完成所有这些步骤，每次运行都从实时页面读取 Next.js action id，并且只写入通过实时 chat-200 验证的密钥。

## 🎁 免费额度 — 你能获得多少

| 项目 | 值 |
| --- | --- |
| 免费模型 | **4** 个 — DeepSeek V4.1 Flash、DeepSeek V4 Flash、MiMo V2.5、MiMo V2.6 Flash（`:free` 后缀） |
| 额度 | **标价的百分比**，没有固定请求次数（实测：约 25 次调用后仍为 `0%`） |
| 窗口 | **个人 7 天**，从你的第一次免费请求开始（`x-th-free-resets` 响应头） |
| 账户速率限制 | **60 次/分钟**，**1,800 次/小时** |
| IP 速率限制 | **100 次/分钟**，**3,000 次/小时**（超速会返回 `429` 并附带等待时间） |
| 并发 | 不设上限 |
| 付费模型 | 70+ 个（Claude、Grok、GLM、MiMo Pro …）——需要额度；零余额账户会返回 `402` |
| 需要银行卡 | **否** |
| 需要手机号 | **否** |
| 验证码 | 注册时的 **Cloudflare Turnstile** — `src/solver.js` 通过同一出口在离屏 Chrome 中生成真实令牌 |
| 邮箱验证 | **必需** — CLI 会打开链接并跟随 `307` 跳转到 `?verify=success` |
| 可扩展的单位 | **一个账户 = 一个密钥** → `--count N` 实际上就是"来自 N 个网络的 N 个账户" |

值得记录的响应头：`x-th-plan`、`x-th-free-used-pct`、`x-th-free-resets`、`x-th-upstream-model`、`x-th-route-decision`。

## 🤖 模型 — 全部 4 个

| 模型 id | 说明 |
| --- | --- |
| `deepseek-v4.1-flash:free` | 默认模型；约 9-11 秒返回 PONG |
| `deepseek-v4-flash:free` | CLI 在实时验证中也会尝试的备用模型 |
| `mimo-v2.5:free` | MiMo 系列 |
| `mimo-v2.6-flash:free` | 四个中最快的 |

该端点总共提供 **78 个模型 id**（使用任意有效密钥调用 `GET /v1/models`）；上面四个是无需额度即可使用的模型。免费路由支持工具/函数调用：`get_time` schema 会返回真实的 `tool_calls` 数组。

## 🧪 如何使用 API

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

## 🚀 一条命令

```bash
npm start            # 菜单 → "Mint keys" → 数量 → 完成
```

`npm start` 会打开启动器，**1) Mint keys** 只询问数量，然后 CLI 为每个密钥创建一个账户，用实时 chat 调用验证每一个，并将存活的密钥写入 `keys.txt`。

## 🛠 快速开始

```bash
git clone https://github.com/F0Rextasy/tokenharbor-bulk-apikey.git
cd tokenharbor-bulk-apikey
npm install
npm start            # 菜单会要求输入一次免费的 Mailtrap API 令牌，然后记住它
```

**Mailtrap 令牌是唯一的设置步骤，启动器只会询问一次。** Token Harbor 接受看起来像真实入站邮件主机的邮件域名，而对公共一次性域名会返回"完成人机验证"（对于这些域名它甚至不会渲染组件），因此 CLI 需要一个它能读取的邮箱。免费套餐就足够了：在 [mailtrap.io](https://mailtrap.io) 创建账户 → **Settings → API Tokens**，然后在菜单提示处粘贴令牌——它会存储在 `mailtrap.txt` 中，之后不再询问（或者导出 `MAILTRAP_TOKEN`，或自行写入该文件）。

没有令牌时 CLI 仍可运行，会回退到公共邮件服务，并在面板拒绝该地址时明确告知你。

## ✅ 已验证可用 — 每个密钥都经过测试

只有在创建时满足以下条件，密钥才会被写入 `keys.txt`：

- 在 `:free` 模型上实时 `chat-200`，并且
- **两个不同的提示**都返回 200，且内容非空且**不同**。

端到端实测（`node src/cli.js --auto --count 1 --pool proxies.txt`）：

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

随时用 `npm start` → **2) Verify keys**（`node src/cli.js --verify`）重新检查；失效密钥会移到 `keys-dead.txt`，实时验证无法完成的密钥（例如网络触发了速率限制）会进入 `keys-unverified.txt`，这样账户永远不会丢失。

## 🧭 工作原理

1. **邮箱** — 在你的 Mailtrap 账户上为每个账户创建一个新收件箱（`mailtrap.txt`）；公共 mail.tm / mail.gw 是备用通道。
2. **注册** — 每次运行都从实时页面读取 Next.js server-action id（`next-action`、`$ACTION_KEY`、`x-deployment-id`），因此面板重新部署不会破坏 CLI；设备指纹和时区随请求一起发送，时区从出口测量，而不是从你的机器测量。
3. **人机验证** — 当面板渲染组件时，注册会在真实 Chrome 中重放（`src/solver.js`、`puppeteer-core` + 已安装的 Chrome；`--enable-automation` 被有意抑制），用鼠标点击复选框，并将该浏览器的会话 cookie 交回 CLI。
4. **邮箱验证** — 打开邮箱中的链接；令牌在服务端被消费，并返回 `307 → /dashboard?verify=success`。
5. **免费模型同意** — `POST /api/me/privacy`，携带仪表盘展示的同意文本（`src/consent-text.txt`）、`screen: "consent_modal"`、`path: "/dashboard"`。
6. **密钥 + 实时验证** — `POST /api/keys`，然后两个不同的提示都必须返回 200 且内容不同，密钥才会被写入。

## ⚙️ CLI 选项

```bash
node src/cli.js --auto --count 5             # five accounts → five keys
node src/cli.js --auto --count 5 --pool proxies.txt
node src/cli.js --verify                     # live-check keys.txt, dead ones → keys-dead.txt
node src/cli.js --screen --pool proxies.txt  # which exits reach the panel at all
node src/cli.js --models                     # the free model list (needs a key)
node src/cli.js --help
```

| 参数 | 含义 |
| --- | --- |
| `--count <n>` | 要创建的账户（和密钥）数量，默认 1 |
| `--pool <file>` | 代理列表，每行一个出口（`http://host:port`、`socks5://user:pass@host:port`、`host:port`）；行内 `#` 注释也可以 |
| `--headless` | 以无头模式运行备用浏览器（默认：离屏窗口，这正是验证码所期望的） |
| `--screen` | 用面板测试代理池，并打印每个出口的存活/失效状态 |
| `--verify` | 实时验证 `keys.txt`；失效密钥写入 `keys-dead.txt` |
| `--models` | 打印免费模型 id |

出口失效绝不会损失账户：注册和实时验证都会在代理池的其他行上重试，遇到 `429` 会等待面板指定的时间。

## 🛰️ 在代理后面

CLI 默认**直连**。在 `proxies.txt` 中每行放一个出口（启动器会自动读取它），或传入 `--pool`：

```text
http://127.0.0.1:8080
socks5://user:pass@10.0.0.5:1080
10.0.0.5:8080
```

可选——大规模时推荐：面板按**网络**限制注册，因此每个账户一个全新出口能让更大规模的运行保持健康。邮件直接从你的 Mailtrap 账户读取（邮件提供商不是面板），所以慢速出口不会破坏邮箱步骤。

## 📄 文件

| 路径 | 内容 |
| --- | --- |
| `keys.txt` | 已验证的密钥，每行一个（仅在实时验证后写入） |
| `keys-dead.txt` | 不再响应的密钥（来自 `--verify`） |
| `keys-unverified.txt` | 实时验证无法完成的密钥——账户存在，密钥是真实的 |
| `accounts.jsonl` | 每个账户一行：邮箱 + 步骤结果 |
| `mailtrap.txt` | 你的 Mailtrap API 令牌（一行） |
| `proxies.txt` | 可选的代理列表 |
| `src/cli.js` | 创建 / 验证 / 筛选 CLI |
| `src/launcher.js` | 菜单（`npm start`） |
| `src/solver.js` | Turnstile 组件的浏览器部分 |
| `src/consent-text.txt` | 面板校验的同意文本 |
| `src/connect-9router.js`、`src/connect-omniroute.js` | 路由器连接器 |

## 🔌 连接到 9Router

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

注册一个 `openai-compatible` 提供商节点（`tokenharbor`，基础 URL `https://tokenharbor.ai/v1`），并为 `keys.txt` 中的每个密钥注册一个连接，这样 9Router 就能在你的密钥之间进行负载均衡。幂等：已存在的节点或连接会被复用，编号从已有的最高 `tokenharbor-0NN` 继续。

## 🔌 连接到 OmniRoute

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
```

OmniRoute 的形式相同（提供商节点 + 每个密钥一个连接）。启动器将两者作为菜单项 **6** 和 **7** 提供，`npm run 9router` / `npm run omniroute` 效果相同。

## 🔑 一个密钥能给你什么

- 上述四个 `:free` 模型，每账户 60 次/分钟和 1,800 次/小时（每 IP 100 次/分钟）；
- 个人 7 天窗口内按百分比计算的额度（`x-th-free-resets` 告诉你何时重置）；
- OpenAI 兼容的 `/v1/chat/completions`，支持工具调用，因此任何 OpenAI SDK、CLI 或路由器只需将 `base_url` 改为 `https://tokenharbor.ai/v1` 即可使用；
- 付费模型在账户有额度之前保持锁定（否则返回 `402`）。

## 🐞 问题

提交 issue 时请附上命令、失败的步骤（CLI 会打印 `precheck / signup / verify / consent / key / chat`）以及面板自身的消息。切勿粘贴完整 API 密钥——最后四个字符就足够了。

## 📄 许可证

MIT — 见 [LICENSE](LICENSE)。本工具与 Token Harbor 无关联；请仅用于你拥有的账户，并遵守面板的条款。