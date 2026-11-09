<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

# Token Harbor — chaves de API em massa

Crie contas e chaves de API do Token Harbor (tokenharbor.ai) a partir do seu terminal.
O Token Harbor oferece um endpoint **compatível com OpenAI** com um nível gratuito permanente, então uma
chave funciona em qualquer SDK, CLI ou roteador local da OpenAI.

```bash
git clone https://github.com/F0Rextasy/tokenharbor-bulk-apikey.git
cd tokenharbor-bulk-apikey
npm install
echo "YOUR_MAILTRAP_TOKEN" > mailtrap.txt   # free Mailtrap API token, one line (see Setup)
npm start            # menu → "Mint keys" → how many → done
```

`npm start` abre um menu; escolha **1) Mint keys**, digite um número, e a CLI cria uma
conta por chave, verifica cada uma com uma **chamada de chat ao vivo**, e grava as sobreviventes em
`keys.txt`. Depois do token único do Mailtrap abaixo, nada mais é solicitado: sem tokens de captcha, sem proxy, sem prompts.

## Configuração (um minuto)

O Token Harbor aceita um domínio de e-mail que pareça um host real de e-mail de entrada e recusa
os descartáveis públicos, então a CLI precisa de uma caixa de correio que consiga ler:

1. Crie uma conta gratuita em [mailtrap.io](https://mailtrap.io) → **Settings → API Tokens**.
2. Coloque o token em  ao lado de  (uma linha), ou exporte .

Esse é o único passo de configuração. Todo o resto — a caixa de entrada por conta, o link de verificação,
o consentimento dos modelos gratuitos, a chave — é automático.

## O que você recebe

| campo | valor |
|---|---|
| Base da API | `https://tokenharbor.ai/v1` |
| Autenticação | `Authorization: Bearer YOUR_KEY` |
| Modelos gratuitos | `deepseek-v4.1-flash:free` · `deepseek-v4-flash:free` · `mimo-v2.5:free` · `mimo-v2.6-flash:free` |
| Modelos pagos | 70+ (Claude, Grok, GLM, MiMo Pro …) — precisam de créditos na conta |
| Formato da chave | `thk_live_` + 63 caracteres |
| Cartão / telefone | não exigidos para o nível gratuito |

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

| flag | significado |
|---|---|
| `--count <n>` | contas (e chaves) a criar, padrão 1 |
| `--pool <file>` | lista de proxies, uma saída por linha (`http://host:port`, `socks5://user:pass@host:port`, `host:port`) |
| `--headless` | executa o navegador de fallback em modo headless (padrão: janela fora da tela, que é o que o captcha espera) |
| `--verify` | verifica ao vivo o `keys.txt` e imprime vivo/morto por chave |

Saída: `keys.txt` (uma chave por linha, apenas chaves que passaram), `accounts.jsonl` (uma linha
por conta com os resultados das etapas, sem segredos além do e-mail da conta que é seu).

## Como a criação funciona

1. **Caixa de correio** — com um token do Mailtrap (nível gratuito, uma linha em `mailtrap.txt`) a CLI abre uma
   caixa de entrada nova por conta na sua própria conta do Mailtrap; sem ele, recorre aos
   serviços públicos mail.tm / mail.gw.
2. **Cadastro** — os ids das server actions do Next.js são lidos da página ao vivo a cada execução, então
   um redeploy do painel não quebra a CLI. A impressão digital do dispositivo e o fuso horário viajam
   com a requisição; o fuso horário é medido a partir da sua saída, não da sua máquina.
3. **Verificação humana** — um domínio de e-mail descartável faz o painel responder "complete the human check"
   (e ele nem renderiza o widget ali), então um host real de e-mail de entrada é o trilho que
   funciona. Quando um widget *é* renderizado, o cadastro é
   reproduzido em um Chrome real (`src/solver.js`, `puppeteer-core` + o Chrome já presente na sua
   máquina): o formulário é digitado com teclas reais, a caixa de seleção do Turnstile é clicada com o
   mouse, e os cookies de sessão são devolvidos à CLI.
4. **Verificação por e-mail** — o link da caixa de correio é aberto (o token é consumido
   no servidor e responde com um `307` para `?verify=success`).
5. **Consentimento dos modelos gratuitos** — a opção de compartilhamento de dados é habilitada com o texto de consentimento que o
   painel mostra (`src/consent-text.txt`). Sem isso, toda chamada `:free` responde
   `403 free_models_disabled`.
6. **Chave** — `POST /api/keys`, depois um **portão ao vivo**: dois prompts diferentes devem ambos responder
   `200` com texto não vazio e diferente. Uma chave que falha no portão nunca é gravada.

## Portões de qualidade

Toda chave em `keys.txt` passou, no momento da criação:

- um `chat-200` ao vivo em um modelo `:free`, e
- **dois prompts diferentes** respondendo 200 com conteúdo não vazio e **diferente**.

Uma chave que não consegue usar ferramentas, uma chave morta ou um provedor morto nunca é gravada na
saída deste repositório nem conectada a um combo. Verifique novamente a qualquer momento com `node src/cli.js --verify`.

## Limites (nível gratuito)

| limite | valor |
|---|---|
| cota | **percentual do preço de tabela** — sem contagem fixa de requisições |
| janela | **7 dias pessoais**, começa com sua primeira requisição gratuita (`x-th-free-resets`) |
| taxa da conta | 60 requisições/min, 1.800 requisições/hora |
| taxa de IP | 100 requisições/min, 3.000 requisições/hora |
| concorrência | sem limite; acima da taxa responde `429` |

Cabeçalhos de resposta que vale registrar: `x-th-plan`, `x-th-free-used-pct`, `x-th-free-resets`,
`x-th-upstream-model`, `x-th-route-decision`.

## Proxies — opcional

A CLI roda **direto** por padrão. Coloque uma saída por linha em `proxies.txt` (ou passe
`--pool`) e toda requisição — incluindo o navegador de fallback — sai por um proxy:

```text
http://127.0.0.1:8080
socks5://user:pass@10.0.0.5:1080
```

Opcional — recomendado em escala: o painel limita cadastros por rede, então uma saída nova
por conta mantém uma execução maior saudável.

## Conecte um roteador local

Ambos os conectores são idempotentes e leem `keys.txt`:

```bash
node src/connect-9router.js    --base http://localhost:8080 --password 123456
node src/connect-omniroute.js  --base http://localhost:20128 --password 123456
```

Cada um cria um nó de provedor `openai-compatible` (`tokenharbor`) com URL base
`https://tokenharbor.ai/v1` e uma conexão por chave, então o roteador faz balanceamento de carga entre
suas chaves. O menu do launcher expõe as mesmas duas ações.

## Notas

- Cada conta pertence ao endereço de e-mail com que foi criada — guarde `accounts.jsonl`
  se quiser fazer login novamente depois.
- O nível gratuito armazena o tráfego de rotas gratuitas sob o consentimento descrito em
  `src/consent-text.txt`; rotas pagas não são usadas para treinamento.
- O texto de consentimento é versionado pelo painel. Se ele mudar, a CLI avisa e você executa novamente
  uma vez após pressionar **Enable free models** no painel.
- Node.js 18+ é necessário. `puppeteer-core` só é usado quando o painel pede a verificação
  humana; a própria CLI usa apenas a biblioteca padrão.

## Licença

MIT — veja [LICENSE](LICENSE).