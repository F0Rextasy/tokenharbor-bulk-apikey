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

**Crie contas em massa no Token Harbor com chaves de API geradas automaticamente — inferência compatível com OpenAI (DeepSeek V4.1 Flash, DeepSeek V4 Flash, MiMo V2.5, MiMo V2.6 Flash) + conectores 9Router / OmniRoute.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-1%20(browser%20only)-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/free%20models-4-412991?style=for-the-badge)](https://tokenharbor.ai/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)

[🛠 Início rápido](#-quick-start) · [🎁 Plano gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-4-of-them) · [🧪 Use a API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Como funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Opções](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Por que isto existe

O Token Harbor é um painel Next.js (autenticação Supabase) cujo plano gratuito é **baseado em porcentagem**: uma **janela pessoal de 7 dias** começa com sua primeira requisição gratuita e consome uma fração do preço de tabela, não uma contagem fixa de requisições. O cadastro é e-mail + senha com um **widget Cloudflare Turnstile** e um limite por rede — uma rede significa uma conta — então uma execução em massa é, na prática, "uma saída nova por conta".

Dois portões ficam após o cadastro e ambos são fáceis de perder: a API responde
`403 email_verification_required` até que o link do e-mail de cadastro seja aberto, e toda
rota `:free` responde `403 free_models_disabled` até que o consentimento de modelos gratuitos
seja habilitado — e esse endpoint de consentimento **valida o texto que o cliente exibiu**
(`shown_text`), então um simples `{"free_models_enabled":true}` responde `400 reload_and_retry`. Esta CLI faz tudo isso,
lê os ids de ação do Next.js da página ao vivo a cada execução, e só grava chaves que passam
em um chat-200 ao vivo.

## 🎁 Plano gratuito — quanto você recebe

| O quê | Valor |
| --- | --- |
| Modelos gratuitos | **4** — DeepSeek V4.1 Flash, DeepSeek V4 Flash, MiMo V2.5, MiMo V2.6 Flash (sufixo `:free`) |
| Franquia | **porcentagem do preço de tabela**, sem contagem fixa de requisições (medido: ainda `0%` após ~25 chamadas) |
| Janela | **7 dias pessoais**, começa com sua primeira requisição gratuita (cabeçalho `x-th-free-resets`) |
| Limite de taxa da conta | **60 req/min**, **1.800 req/h** |
| Limite de taxa por IP | **100 req/min**, **3.000 req/h** (acima da taxa responde `429` com o tempo de espera) |
| Concorrência | não limitada |
| Modelos pagos | 70+ (Claude, Grok, GLM, MiMo Pro …) — precisam de créditos; uma conta com saldo zero responde `402` |
| Cartão exigido | **Não** |
| Telefone exigido | **Não** |
| Captcha | **Cloudflare Turnstile** no cadastro — `src/solver.js` gera um token real em um Chrome offscreen pela mesma saída |
| Verificação de e-mail | **obrigatória** — a CLI abre o link e segue o `307` para `?verify=success` |
| A unidade que escala | **uma conta = uma chave** → `--count N` é, na prática, "N contas de N redes" |

Cabeçalhos que vale registrar: `x-th-plan`, `x-th-free-used-pct`, `x-th-free-resets`,
`x-th-upstream-model`, `x-th-route-decision`.

## 🤖 Modelos — todos os 4

| Id do modelo | Observações |
| --- | --- |
| `deepseek-v4.1-flash:free` | o padrão; responde PONG em ~9-11 s |
| `deepseek-v4-flash:free` | modelo de fallback que a CLI também tenta no portão ao vivo |
| `mimo-v2.5:free` | família MiMo |
| `mimo-v2.6-flash:free` | o mais rápido dos quatro |

O endpoint serve **78 ids de modelo** no total (`GET /v1/models` com qualquer chave válida); os quatro
acima são os que funcionam sem créditos. Ferramentas/chamada de função funcionam nas rotas gratuitas:
um schema `get_time` retorna como um array `tool_calls` real.

## 🧪 Como usar a API

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

## 🚀 Um comando

```bash
npm start            # menu → "Mint keys" → how many → done
```

`npm start` abre o launcher, **1) Mint keys** pergunta uma quantidade e nada mais, então a CLI
cria uma conta por chave, verifica cada uma com uma chamada de chat ao vivo e grava as sobreviventes
em `keys.txt`.

## 🛠 Início rápido

```bash
git clone https://github.com/F0Rextasy/tokenharbor-bulk-apikey.git
cd tokenharbor-bulk-apikey
npm install
echo "YOUR_MAILTRAP_TOKEN" > mailtrap.txt   # free Mailtrap API token, one line
npm start
```

**O token do Mailtrap é o único passo de configuração.** O Token Harbor aceita um domínio de e-mail que
parece um host real de e-mail de entrada e responde "complete the human check" para domínios descartáveis
públicos (para esses ele nem renderiza o widget), então a CLI precisa de uma caixa de correio que consiga
ler. O plano gratuito é suficiente: crie uma conta em [mailtrap.io](https://mailtrap.io) → **Settings
→ API Tokens** → cole o token em `mailtrap.txt` (ou exporte `MAILTRAP_TOKEN`).

Sem o token a CLI ainda roda, recorre a serviços de e-mail públicos e avisa
claramente quando o painel recusa esse endereço.

## ✅ Verificado funcionando — toda chave é testada

Uma chave só é gravada em `keys.txt` depois que, no momento da criação:

- um `chat-200` ao vivo em um modelo `:free`, e
- **dois prompts diferentes** respondem 200 com conteúdo não vazio e **diferente**.

Medido de ponta a ponta (`node src/cli.js --auto --count 1 --pool proxies.txt`):

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

Re-verifique a qualquer momento com `npm start` → **2) Verify keys** (`node src/cli.js --verify`); chaves
mortas vão para `keys-dead.txt`, uma chave cujo portão ao vivo não pôde ser concluído (por exemplo, a rede atingiu um
limite de taxa) vai para `keys-unverified.txt` para que a conta nunca seja perdida.

## 🧭 Como funciona

1. **Caixa de correio** — uma caixa de entrada nova por conta na sua conta Mailtrap (`mailtrap.txt`); mail.tm / mail.gw públicos
   são os trilhos de fallback.
2. **Cadastro** — os ids de ação do servidor Next.js (`next-action`, `$ACTION_KEY`,
   `x-deployment-id`) são lidos da página ao vivo a cada execução, então um redeploy do painel não quebra
   a CLI; a impressão digital do dispositivo e o fuso horário viajam com a requisição, e o fuso horário é
   medido a partir da saída, não da sua máquina.
3. **Verificação humana** — quando o painel renderiza o widget, o cadastro é reproduzido em um Chrome real
   (`src/solver.js`, `puppeteer-core` + o Chrome já instalado; `--enable-automation` é
   suprimido de propósito), a caixa de seleção é clicada com o mouse, e os cookies de sessão desse navegador são devolvidos
   à CLI.
4. **Verificação de e-mail** — o link da caixa de correio é aberto; o token é consumido
   no servidor e responde `307 → /dashboard?verify=success`.
5. **Consentimento de modelos gratuitos** — `POST /api/me/privacy` com o texto de consentimento que o painel exibe
   (`src/consent-text.txt`), `screen: "consent_modal"`, `path: "/dashboard"`.
6. **Chave + portão ao vivo** — `POST /api/keys`, então dois prompts diferentes devem ambos responder 200 com
   conteúdo diferente antes que a chave seja gravada.

## ⚙️ Opções da CLI

```bash
node src/cli.js --auto --count 5             # five accounts → five keys
node src/cli.js --auto --count 5 --pool proxies.txt
node src/cli.js --verify                     # live-check keys.txt, dead ones → keys-dead.txt
node src/cli.js --screen --pool proxies.txt  # which exits reach the panel at all
node src/cli.js --models                     # the free model list (needs a key)
node src/cli.js --help
```

| flag | significado |
| --- | --- |
| `--count <n>` | contas (e chaves) a criar, padrão 1 |
| `--pool <file>` | lista de proxies, uma saída por linha (`http://host:port`, `socks5://user:pass@host:port`, `host:port`); comentários inline com `#` são permitidos |
| `--headless` | executa o navegador de fallback em modo headless (padrão: janela fora da tela, que é o que o captcha espera) |
| `--screen` | testa o pool contra o painel e imprime vivo/morto por saída |
| `--verify` | verifica ao vivo `keys.txt`; chaves mortas são gravadas em `keys-dead.txt` |
| `--models` | imprime os ids dos modelos gratuitos |

Uma saída que morre nunca custa uma conta: o cadastro e o portão ao vivo ambos tentam novamente em outras linhas do pool,
e um `429` espera o tempo que o painel indica.

## 🛰️ Atrás de um proxy

A CLI roda **direto** por padrão. Coloque uma saída por linha em `proxies.txt` (o launcher a detecta
automaticamente) ou passe `--pool`:

```text
http://127.0.0.1:8080
socks5://user:pass@10.0.0.5:1080
10.0.0.5:8080
```

Opcional — recomendado em escala: o painel limita cadastros **por rede**, então uma saída nova
por conta mantém uma execução maior saudável. O e-mail é lido diretamente da sua conta Mailtrap (um
provedor de e-mail não é o painel), então uma saída lenta não pode quebrar a etapa da caixa de correio.

## 📄 Arquivos

| Caminho | O quê |
| --- | --- |
| `keys.txt` | chaves verificadas, uma por linha (gravadas apenas após o portão ao vivo) |
| `keys-dead.txt` | chaves que pararam de responder (de `--verify`) |
| `keys-unverified.txt` | chaves cujo portão ao vivo não pôde terminar — a conta existe, a chave é real |
| `accounts.jsonl` | uma linha por conta: e-mail + resultados das etapas |
| `mailtrap.txt` | seu token de API do Mailtrap (uma linha) |
| `proxies.txt` | lista de proxies opcional |
| `src/cli.js` | a CLI de criação / verificação / triagem |
| `src/launcher.js` | o menu (`npm start`) |
| `src/solver.js` | a metade do navegador para o widget Turnstile |
| `src/consent-text.txt` | o texto de consentimento que o painel valida |
| `src/connect-9router.js`, `src/connect-omniroute.js` | conectores de roteador |

## 🔌 Conectar ao 9Router

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

Registra um nó de provedor `openai-compatible` (`tokenharbor`, URL base
`https://tokenharbor.ai/v1`) e uma conexão por chave em `keys.txt`, então o 9Router faz balanceamento de carga
entre suas chaves. Idempotente: um nó ou conexão existente é reutilizado, e a numeração continua
a partir do maior `tokenharbor-0NN` já presente.

## 🔌 Conectar ao OmniRoute

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
```

Mesmo formato para o OmniRoute (nó de provedor + uma conexão por chave). O launcher expõe ambos como
itens de menu **6** e **7**, e `npm run 9router` / `npm run omniroute` fazem o mesmo.

## 🔑 O que uma chave te dá

- os quatro modelos `:free` acima, a 60 req/min e 1.800 req/h por conta (100 req/min por IP);
- uma franquia baseada em porcentagem dentro de uma janela pessoal de 7 dias (`x-th-free-resets` te diz quando
  ela reinicia);
- `/v1/chat/completions` compatível com OpenAI com chamada de ferramentas, então qualquer SDK, CLI ou roteador OpenAI
  funciona mudando `base_url` para `https://tokenharbor.ai/v1`;
- modelos pagos permanecem bloqueados até que a conta tenha créditos (`402` caso contrário).

## 🐞 Problemas

Abra uma issue com o comando, a etapa que falhou (a CLI imprime `precheck / signup /
verify / consent / key / chat`) e a mensagem do próprio painel. Nunca cole uma chave de API completa — os
últimos quatro caracteres são suficientes.

## 📄 Licença

MIT — veja [LICENSE](LICENSE). A ferramenta não é afiliada ao Token Harbor; use-a para contas
que você possui e respeite os termos do painel.