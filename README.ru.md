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

**Массовое создание аккаунтов Token Harbor с автоматически сгенерированными API-ключами — инференс, совместимый с OpenAI (DeepSeek V4.1 Flash, DeepSeek V4 Flash, MiMo V2.5, MiMo V2.6 Flash) + коннекторы 9Router / OmniRoute.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-1%20(browser%20only)-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/free%20models-4-412991?style=for-the-badge)](https://tokenharbor.ai/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)

[🛠 Быстрый старт](#-quick-start) · [🎁 Бесплатный тариф](#-free-tier--how-much-you-get) · [🤖 Модели](#-models--all-4-of-them) · [🧪 Использование API](#-how-to-use-the-api) · [✅ Проверено](#-verified-working--every-key-is-tested) · [🧭 Как это работает](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Опции](#️-cli-options) · [🛰️ Прокси](#️-behind-a-proxy) · [🐞 Проблемы](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Зачем это нужно

Token Harbor — это панель на Next.js (аутентификация через Supabase), бесплатный тариф которой
**основан на процентах**: личное **7-дневное окно** начинается с вашего первого бесплатного
запроса и расходует долю от прейскурантной цены, а не фиксированное количество запросов.
Регистрация — это e-mail + пароль с **виджетом Cloudflare Turnstile** и лимитом на сеть —
одна сеть означает один аккаунт — поэтому массовый запуск — это на самом деле «один свежий
выход на аккаунт».

После регистрации стоят два барьера, и оба легко пропустить: API отвечает
`403 email_verification_required`, пока не открыта ссылка из письма о регистрации, а каждый
маршрут `:free` отвечает `403 free_models_disabled`, пока не включено согласие на бесплатные
модели — и эта конечная точка согласия **проверяет текст, который показал клиент** (`shown_text`),
поэтому голый `{"free_models_enabled":true}` отвечает `400 reload_and_retry`. Этот CLI делает всё
это, читает идентификаторы действий Next.js с живой страницы при каждом запуске и записывает
только те ключи, которые проходят живой чат-200.

## 🎁 Бесплатный тариф — сколько вы получаете

| Что | Значение |
| --- | --- |
| Бесплатные модели | **4** — DeepSeek V4.1 Flash, DeepSeek V4 Flash, MiMo V2.5, MiMo V2.6 Flash (суффикс `:free`) |
| Лимит | **процент от прейскурантной цены**, без фиксированного количества запросов (измерено: всё ещё `0%` после ~25 вызовов) |
| Окно | **личное 7 дней**, начинается с вашего первого бесплатного запроса (заголовок `x-th-free-resets`) |
| Лимит на аккаунт | **60 запросов/мин**, **1 800 запросов/ч** |
| Лимит на IP | **100 запросов/мин**, **3 000 запросов/ч** (при превышении отвечает `429` с временем ожидания) |
| Параллелизм | не ограничен |
| Платные модели | 70+ (Claude, Grok, GLM, MiMo Pro …) — им нужны кредиты; аккаунт с нулевым балансом отвечает `402` |
| Требуется карта | **Нет** |
| Требуется телефон | **Нет** |
| Капча | **Cloudflare Turnstile** при регистрации — `src/solver.js` получает настоящий токен в закадровом Chrome через тот же выход |
| Подтверждение e-mail | **обязательно** — CLI открывает ссылку и следует за `307` к `?verify=success` |
| Единица масштабирования | **один аккаунт = один ключ** → `--count N` — это на самом деле «N аккаунтов из N сетей» |

Заголовки, которые стоит логировать: `x-th-plan`, `x-th-free-used-pct`, `x-th-free-resets`,
`x-th-upstream-model`, `x-th-route-decision`.

## 🤖 Модели — все 4

| ID модели | Примечания |
| --- | --- |
| `deepseek-v4.1-flash:free` | по умолчанию; отвечает PONG за ~9-11 с |
| `deepseek-v4-flash:free` | резервная модель, которую CLI также пробует в живом гейте |
| `mimo-v2.5:free` | семейство MiMo |
| `mimo-v2.6-flash:free` | самая быстрая из четырёх |

Конечная точка обслуживает **78 идентификаторов моделей** всего (`GET /v1/models` с любым
действительным ключом); четыре выше — те, что работают без кредитов. Инструменты/вызов функций
работают на бесплатных маршрутах: схема `get_time` возвращается как настоящий массив `tool_calls`.

## 🧪 Как использовать API

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

## 🚀 Одна команда

```bash
npm start            # menu → "Mint keys" → how many → done
```

`npm start` открывает лаунчер, **1) Mint keys** спрашивает количество и больше ничего, затем CLI
создаёт один аккаунт на ключ, проверяет каждый живым чат-вызовом и записывает выживших
в `keys.txt`.

## 🛠 Быстрый старт

```bash
git clone https://github.com/F0Rextasy/tokenharbor-bulk-apikey.git
cd tokenharbor-bulk-apikey
npm install
echo "YOUR_MAILTRAP_TOKEN" > mailtrap.txt   # free Mailtrap API token, one line
npm start
```

**Токен Mailtrap — единственный шаг настройки.** Token Harbor принимает почтовый домен, который
выглядит как настоящий хост для входящей почты, и отвечает «complete the human check» на публичные
одноразовые домены (для них он даже не отображает виджет), поэтому CLI нужен почтовый ящик, который
он может читать. Бесплатного тарифа достаточно: создайте аккаунт на [mailtrap.io](https://mailtrap.io) → **Settings
→ API Tokens** → вставьте токен в `mailtrap.txt` (или экспортируйте `MAILTRAP_TOKEN`).

Без токена CLI всё равно запускается, переключается на публичные почтовые сервисы и прямо
сообщает вам, когда панель отклоняет этот адрес.

## ✅ Проверено в работе — каждый ключ протестирован

Ключ записывается в `keys.txt` только после того, как в момент создания:

- живой `chat-200` на модели `:free`, и
- **два разных запроса** отвечают 200 с непустым и **разным** содержимым.

Измерено от начала до конца (`node src/cli.js --auto --count 1 --pool proxies.txt`):

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

Перепроверить можно в любой момент через `npm start` → **2) Verify keys** (`node src/cli.js --verify`); мёртвые
ключи перемещаются в `keys-dead.txt`, ключ, чей живой гейт не смог завершиться (например, сеть попала в
лимит запросов), попадает в `keys-unverified.txt`, чтобы аккаунт никогда не был потерян.

## 🧭 Как это работает

1. **Почтовый ящик** — свежий ящик на каждый аккаунт в вашем аккаунте Mailtrap (`mailtrap.txt`); публичные
   mail.tm / mail.gw — резервные варианты.
2. **Регистрация** — идентификаторы серверных действий Next.js (`next-action`, `$ACTION_KEY`,
   `x-deployment-id`) читаются с живой страницы при каждом запуске, поэтому повторное развёртывание панели не ломает
   CLI; отпечаток устройства и часовой пояс передаются с запросом, а часовой пояс
   измеряется по выходу, а не по вашей машине.
3. **Проверка человека** — когда панель отображает виджет, регистрация воспроизводится в настоящем Chrome
   (`src/solver.js`, `puppeteer-core` + уже установленный Chrome; `--enable-automation`
   намеренно подавлен), флажок нажимается мышью, и сессионные
   cookie этого браузера передаются обратно в CLI.
4. **Подтверждение e-mail** — открывается ссылка из почтового ящика; токен расходуется
   на сервере и отвечает `307 → /dashboard?verify=success`.
5. **Согласие на бесплатные модели** — `POST /api/me/privacy` с текстом согласия, который показывает панель
   (`src/consent-text.txt`), `screen: "consent_modal"`, `path: "/dashboard"`.
6. **Ключ + живой гейт** — `POST /api/keys`, затем два разных запроса должны оба ответить 200 с
   разным содержимым, прежде чем ключ будет записан.

## ⚙️ Опции CLI

```bash
node src/cli.js --auto --count 5             # five accounts → five keys
node src/cli.js --auto --count 5 --pool proxies.txt
node src/cli.js --verify                     # live-check keys.txt, dead ones → keys-dead.txt
node src/cli.js --screen --pool proxies.txt  # which exits reach the panel at all
node src/cli.js --models                     # the free model list (needs a key)
node src/cli.js --help
```

| флаг | значение |
| --- | --- |
| `--count <n>` | сколько аккаунтов (и ключей) создать, по умолчанию 1 |
| `--pool <file>` | список прокси, один выход на строку (`http://host:port`, `socks5://user:pass@host:port`, `host:port`); встроенные комментарии `#` допустимы |
| `--headless` | запускать резервный браузер в headless-режиме (по умолчанию: закадровое окно, чего и ожидает капча) |
| `--screen` | проверить пул против панели и вывести live/dead для каждого выхода |
| `--verify` | живая проверка `keys.txt`; мёртвые ключи записываются в `keys-dead.txt` |
| `--models` | вывести идентификаторы бесплатных моделей |

Умирающий выход никогда не стоит аккаунта: регистрация и живой гейт оба повторяются на других строках пула,
а `429` ждёт время, которое называет панель.

## 🛰️ За прокси

По умолчанию CLI работает **напрямую**. Поместите один выход на строку в `proxies.txt` (лаунчер подхватит
его автоматически) или передайте `--pool`:

```text
http://127.0.0.1:8080
socks5://user:pass@10.0.0.5:1080
10.0.0.5:8080
```

Необязательно — рекомендуется при масштабе: панель ограничивает регистрации **на сеть**, поэтому один свежий выход
на аккаунт поддерживает здоровье более крупного запуска. Почта читается напрямую из вашего аккаунта Mailtrap (почтовый
провайдер — это не панель), поэтому медленный выход не может сломать шаг с почтовым ящиком.

## 📄 Файлы

| Путь | Что |
| --- | --- |
| `keys.txt` | проверенные ключи, по одному на строку (записываются только после живого гейта) |
| `keys-dead.txt` | ключи, которые перестали отвечать (из `--verify`) |
| `keys-unverified.txt` | ключи, чей живой гейт не смог завершиться — аккаунт существует, ключ настоящий |
| `accounts.jsonl` | одна строка на аккаунт: e-mail + результаты шагов |
| `mailtrap.txt` | ваш API-токен Mailtrap (одна строка) |
| `proxies.txt` | необязательный список прокси |
| `src/cli.js` | CLI для создания / проверки / скрининга |
| `src/launcher.js` | меню (`npm start`) |
| `src/solver.js` | браузерная часть для виджета Turnstile |
| `src/consent-text.txt` | текст согласия, который проверяет панель |
| `src/connect-9router.js`, `src/connect-omniroute.js` | коннекторы роутеров |

## 🔌 Подключение к 9Router

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

Регистрирует один узел провайдера `openai-compatible` (`tokenharbor`, базовый URL
`https://tokenharbor.ai/v1`) и одно подключение на каждый ключ в `keys.txt`, так что 9Router балансирует нагрузку
между вашими ключами. Идемпотентно: существующий узел или подключение переиспользуется, а нумерация продолжается
с наибольшего уже имеющегося `tokenharbor-0NN`.

## 🔌 Подключение к OmniRoute

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
```

Та же схема для OmniRoute (узел провайдера + одно подключение на ключ). Лаунчер предоставляет оба как
пункты меню **6** и **7**, и `npm run 9router` / `npm run omniroute` делают то же самое.

## 🔑 Что даёт один ключ

- четыре модели `:free` выше, при 60 запросах/мин и 1 800 запросах/ч на аккаунт (100 запросов/мин на IP);
- лимит на основе процентов внутри личного 7-дневного окна (`x-th-free-resets` сообщает вам, когда
  он обновляется);
- совместимый с OpenAI `/v1/chat/completions` с вызовом инструментов, поэтому любой OpenAI SDK, CLI или роутер
  работает после смены `base_url` на `https://tokenharbor.ai/v1`;
- платные модели остаются заблокированными, пока на аккаунте нет кредитов (иначе `402`).

## 🐞 Проблемы

Откройте issue с командой, шагом, который не удался (CLI выводит `precheck / signup /
verify / consent / key / chat`), и сообщением самой панели. Никогда не вставляйте полный API-ключ —
достаточно последних четырёх символов.

## 📄 Лицензия

MIT — см. [LICENSE](LICENSE). Инструмент не связан с Token Harbor; используйте его для аккаунтов,
которыми вы владеете, и соблюдайте условия панели.