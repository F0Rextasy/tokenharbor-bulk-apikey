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

**Token-Harbor-Konten im Massenverfahren erstellen mit automatisch generierten API-Schlüsseln — OpenAI-kompatible Inferenz (DeepSeek V4.1 Flash, DeepSeek V4 Flash, MiMo V2.5, MiMo V2.6 Flash) + 9Router-/OmniRoute-Konnektoren.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-1%20(browser%20only)-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/free%20models-4-412991?style=for-the-badge)](https://tokenharbor.ai/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)

[🛠 Schnellstart](#-quick-start) · [🎁 Kostenloser Tarif](#-free-tier--how-much-you-get) · [🤖 Modelle](#-models--all-4-of-them) · [🧪 API verwenden](#-how-to-use-the-api) · [✅ Verifiziert](#-verified-working--every-key-is-tested) · [🧭 Funktionsweise](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Optionen](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Probleme](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Warum es das gibt

Token Harbor ist ein Next.js-Panel (Supabase-Auth), dessen kostenloser Tarif **prozentbasiert** ist: Ein
persönliches **7-Tage-Fenster** beginnt mit deiner ersten kostenlosen Anfrage und verbraucht einen Anteil des
Listenpreises, keine feste Anzahl an Anfragen. Die Registrierung erfolgt per E-Mail + Passwort mit einem **Cloudflare-
Turnstile-Widget** und einem Limit pro Netzwerk — ein Netzwerk bedeutet ein Konto —, sodass ein Massenlauf
eigentlich „ein frischer Exit pro Konto" ist.

Nach der Registrierung gibt es zwei Hürden, und beide sind leicht zu übersehen: Die API antwortet
`403 email_verification_required`, bis der Link aus der Registrierungs-E-Mail geöffnet wird, und jede
`:free`-Route antwortet `403 free_models_disabled`, bis die Einwilligung zu den kostenlosen Modellen aktiviert ist —
und dieser Einwilligungs-Endpunkt **validiert den Text, den der Client angezeigt hat** (`shown_text`), sodass ein bloßes
`{"free_models_enabled":true}` mit `400 reload_and_retry` antwortet. Diese CLI erledigt all das,
liest die Next.js-Action-IDs bei jedem Lauf aus der Live-Seite und schreibt nur Schlüssel, die einen
Live-Chat-200 bestehen.

## 🎁 Kostenloser Tarif — wie viel du bekommst

| Was | Wert |
| --- | --- |
| Kostenlose Modelle | **4** — DeepSeek V4.1 Flash, DeepSeek V4 Flash, MiMo V2.5, MiMo V2.6 Flash (Suffix `:free`) |
| Kontingent | **Prozentsatz des Listenpreises**, keine feste Anzahl an Anfragen (gemessen: nach ~25 Aufrufen noch `0%`) |
| Fenster | **persönliche 7 Tage**, beginnt mit deiner ersten kostenlosen Anfrage (Header `x-th-free-resets`) |
| Ratenlimit pro Konto | **60 Anf./min**, **1.800 Anf./h** |
| Ratenlimit pro IP | **100 Anf./min**, **3.000 Anf./h** (bei Überschreitung antwortet es mit `429` oder HTTP `200` mit einem `error`-Body und nennt die Wartezeit) |
| Parallelität | nicht begrenzt |
| Kostenpflichtige Modelle | 70+ (Claude, Grok, GLM, MiMo Pro …) — sie benötigen Guthaben; ein Konto mit Nullguthaben antwortet mit `402` |
| Karte erforderlich | **Nein** |
| Telefon erforderlich | **Nein** |
| Captcha | **Cloudflare Turnstile** bei der Registrierung — `src/solver.js` erzeugt ein echtes Token in einem unsichtbaren Chrome über denselben Exit |
| E-Mail-Verifizierung | **erforderlich** — die CLI öffnet den Link und folgt dem `307` zu `?verify=success` |
| Die Einheit, die skaliert | **ein Konto = ein Schlüssel** → `--count N` bedeutet eigentlich „N Konten aus N Netzwerken" |

Protokollierenswerte Header: `x-th-plan`, `x-th-free-used-pct`, `x-th-free-resets`,
`x-th-upstream-model`, `x-th-route-decision`.

## 🤖 Modelle — alle 4

| Modell-ID | Hinweise |
| --- | --- |
| `deepseek-v4.1-flash:free` | der Standard; antwortet mit PONG in ~9-11 s |
| `deepseek-v4-flash:free` | Fallback-Modell, das die CLI im Live-Gate ebenfalls versucht |
| `mimo-v2.5:free` | MiMo-Familie |
| `mimo-v2.6-flash:free` | das schnellste der vier |

Der Endpunkt liefert insgesamt **78 Modell-IDs** (`GET /v1/models` mit einem beliebigen gültigen Schlüssel); die vier
oben sind diejenigen, die ohne Guthaben funktionieren. Tools/Function Calling funktionieren auf den kostenlosen Routen:
Ein `get_time`-Schema kommt als echtes `tool_calls`-Array zurück.

## 🧪 So verwendest du die API

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

## 🚀 Ein Befehl

```bash
npm start            # Menü → "Mint keys" → wie viele → fertig
```

`npm start` öffnet den Launcher, **1) Mint keys** fragt nach einer Anzahl und sonst nichts, dann
erstellt die CLI ein Konto pro Schlüssel, verifiziert jedes mit einem Live-Chat-Aufruf und schreibt die überlebenden
in `keys.txt`.

## 🛠 Schnellstart

```bash
git clone https://github.com/F0Rextasy/tokenharbor-bulk-apikey.git
cd tokenharbor-bulk-apikey
npm install
echo "YOUR_MAILTRAP_TOKEN" > mailtrap.txt   # ERFORDERLICH — siehe die Warnung unten
npm start            # Menü → 1) Mint keys → wie viele → fertig
```

> **Ohne `mailtrap.txt` kann das Minting überhaupt nicht funktionieren.** Token Harbor lehnt jede öffentliche
> Mailbox-Domain ab, sodass nichts den Verifizierungslink lesen kann und jedes Konto bei
> `403 email_verification_required` hängen bliebe. Es gibt keinen Fallback: Hole dir zuerst ein kostenloses Token.

**Das Mailtrap-Token ist der einzige Einrichtungsschritt.** Token Harbor
akzeptiert eine Mail-Domain, die wie ein echter Inbound-Mail-Host aussieht, und antwortet öffentlichen Wegwerf-Domains mit „complete the human
check" (für diese rendert es nicht einmal das Widget), daher
braucht die CLI eine Mailbox, die sie lesen kann. Der kostenlose Tarif reicht: Erstelle ein Konto bei
[mailtrap.io](https://mailtrap.io) → **Settings → API Tokens**, schreibe diesen Wert dann in
`mailtrap.txt` neben `package.json` (eine Zeile) oder exportiere `MAILTRAP_TOKEN`. Der Launcher
prüft es und sagt dir, wenn es fehlt — er fragt nie nach dem Wert selbst.

Ohne das Token versucht die CLI trotzdem zuerst die öffentlichen Mail-Schienen, und jedes Konto bleibt an
der Human-Check-Mauer des Panels hängen — deshalb ist die Datei erforderlich, nicht optional.

## ✅ Verifiziert funktionierend — jeder Schlüssel wird getestet

Ein Schlüssel wird nur dann in `keys.txt` geschrieben, wenn zum Zeitpunkt des Mintings:

- ein Live-`chat-200` auf einem `:free`-Modell erfolgt ist und
- **zwei verschiedene Prompts** mit 200 und nicht-leerem sowie **unterschiedlichem** Inhalt antworten.

Ende-zu-Ende gemessen (`node src/cli.js --auto --count 1 --pool proxies.txt`):

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

Jederzeit erneut prüfen mit `npm start` → **2) Verify keys** (`node src/cli.js --verify`); tote
Schlüssel wandern nach `keys-dead.txt`, ein Schlüssel, dessen Live-Gate nicht abgeschlossen werden konnte (z. B. weil das Netzwerk ein
Ratenlimit erreicht hat), landet in `keys-unverified.txt`, sodass das Konto nie verloren geht.

## 🧭 Funktionsweise

1. **Mailbox** — ein frisches Postfach pro Konto in deinem Mailtrap-Konto (`mailtrap.txt`); öffentliche
   mail.tm / mail.gw sind die Fallback-Schienen.
2. **Registrierung** — die Next.js-Server-Action-IDs (`next-action`, `$ACTION_KEY`,
   `x-deployment-id`) werden bei jedem Lauf aus der Live-Seite gelesen, sodass ein Redeploy des Panels die
   CLI nicht bricht; der Geräte-Fingerprint und die Zeitzone gehen mit der Anfrage mit, und die Zeitzone wird
   vom Exit aus gemessen, nicht von deinem Rechner.
3. **Human Check** — wenn das Panel das Widget rendert, wird die Registrierung in einem echten Chrome
   erneut abgespielt (`src/solver.js`, `puppeteer-core` + das bereits installierte Chrome; `--enable-automation` wird
   absichtlich unterdrückt), das Kontrollkästchen wird mit der Maus angeklickt, und die Session-
   Cookies dieses Browsers werden an die CLI zurückgegeben.
4. **E-Mail-Verifizierung** — der Link aus der Mailbox wird geöffnet; das Token wird serverseitig
   verbraucht und antwortet mit `307 → /dashboard?verify=success`.
5. **Einwilligung zu kostenlosen Modellen** — `POST /api/me/privacy` mit dem Einwilligungstext, den das Dashboard anzeigt
   (`src/consent-text.txt`), `screen: "consent_modal"`, `path: "/dashboard"`.
6. **Schlüssel + Live-Gate** — `POST /api/keys`, dann müssen zwei verschiedene Prompts beide mit 200 und
   unterschiedlichem Inhalt antworten, bevor der Schlüssel geschrieben wird.

## ⚙️ CLI-Optionen

```bash
node src/cli.js --auto --count 5             # fünf Konten → fünf Schlüssel
node src/cli.js --auto --count 5 --pool proxies.txt
node src/cli.js --verify                     # keys.txt live prüfen, tote → keys-dead.txt
node src/cli.js --screen --pool proxies.txt  # welche Exits das Panel überhaupt erreichen
node src/cli.js --models                     # die Liste der kostenlosen Modelle (benötigt einen Schlüssel)
node src/cli.js --help
```

| Flag | Bedeutung |
| --- | --- |
| `--count <n>` | zu erstellende Konten (und Schlüssel), Standard 1 |
| `--pool <file>` | Proxy-Liste, ein Exit pro Zeile (`http://host:port`, `socks5://user:pass@host:port`, `host:port`); Inline-`#`-Kommentare sind in Ordnung |
| `--headless` | den Fallback-Browser headless ausführen (Standard: aus, Off-Screen-Fenster, was das Captcha erwartet) |
| `--screen` | den Pool gegen das Panel testen und pro Exit live/tot ausgeben |
| `--verify` | `keys.txt` live verifizieren; tote Schlüssel werden nach `keys-dead.txt` geschrieben |
| `--models` | die IDs der kostenlosen Modelle ausgeben |
| `--strict-proxy` | niemals eine direkte Anfrage senden: Auch das Live-Gate muss über den Pool laufen (Env `TOKENHARBOR_STRICT=1` bewirkt dasselbe) |

Ein sterbender Exit kostet nie ein Konto: Registrierung und Live-Gate versuchen es beide erneut über andere Pool-Zeilen,
und bei einem Ratenlimit (ein `429` oder ein `200`, dessen Body `rate_limit_exceeded` enthält) wird die vom Panel genannte Zeit abgewartet.

## 🛰️ Hinter einem Proxy

Die CLI läuft standardmäßig **direkt**. Lege einen Exit pro Zeile in `proxies.txt` ab (der Launcher nimmt
sie automatisch auf) oder übergib `--pool`:

```text
http://127.0.0.1:8080
socks5://user:pass@10.0.0.5:1080
10.0.0.5:8080
```

Optional — bei größerem Umfang empfohlen: Das Panel begrenzt Registrierungen **pro Netzwerk**, daher hält ein frischer Exit
pro Konto einen größeren Lauf gesund. E-Mails werden direkt aus deinem Mailtrap-Konto gelesen (ein
Mail-Anbieter ist nicht das Panel), sodass ein langsamer Exit den Mailbox-Schritt nicht brechen kann.

## 📄 Dateien

| Pfad | Was |
| --- | --- |
| `keys.txt` | verifizierte Schlüssel, einer pro Zeile (wird erst nach dem Live-Gate geschrieben) |
| `keys-dead.txt` | Schlüssel, die nicht mehr antworten (aus `--verify`) |
| `keys-unverified.txt` | Schlüssel, deren Live-Gate nicht abgeschlossen werden konnte — das Konto existiert, der Schlüssel ist echt |
| `accounts.jsonl` | eine Zeile pro Konto: E-Mail + Schrittergebnisse |
| `mailtrap.txt` | dein Mailtrap-API-Token (eine Zeile) |
| `proxies.txt` | optionale Proxy-Liste |
| `src/cli.js` | die CLI für Mint / Verify / Screen |
| `src/launcher.js` | das Menü (`npm start`) |
| `src/solver.js` | die Browser-Hälfte für das Turnstile-Widget |
| `src/consent-text.txt` | der Einwilligungstext, den das Panel validiert |
| `src/connect-9router.js`, `src/connect-omniroute.js` | Router-Konnektoren |

## 🔌 Mit 9Router verbinden

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

Registriert einen `openai-compatible`-Provider-Knoten (`tokenharbor`, Basis-URL
`https://tokenharbor.ai/v1`) und eine Verbindung pro Schlüssel in `keys.txt`, sodass 9Router das Load-Balancing
über deine Schlüssel durchführt. Idempotent: Ein vorhandener Knoten oder eine vorhandene Verbindung wird wiederverwendet, und die Nummerierung wird
ab der höchsten bereits vorhandenen `tokenharbor-0NN` fortgesetzt.

## 🔌 Mit OmniRoute verbinden

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
```

Gleiche Form für OmniRoute (Provider-Knoten + eine Verbindung pro Schlüssel). Der Launcher bietet beides als
Menüpunkte **6** und **7** an, und `npm run 9router` / `npm run omniroute` tun dasselbe.

## 🔑 Was ein Schlüssel dir bringt

- die vier oben genannten `:free`-Modelle, mit 60 Anf./min und 1.800 Anf./h pro Konto (100 Anf./min pro IP);
- ein prozentbasiertes Kontingent innerhalb eines persönlichen 7-Tage-Fensters (`x-th-free-resets` sagt dir, wann
  es zurückgesetzt wird);
- OpenAI-kompatibles `/v1/chat/completions` mit Tool Calling, sodass jedes OpenAI-SDK, jede CLI oder jeder Router
  funktioniert, indem du `base_url` auf `https://tokenharbor.ai/v1` änderst;
- kostenpflichtige Modelle bleiben gesperrt, bis das Konto Guthaben hat (andernfalls `402`).

## 🐞 Probleme

Öffne ein Issue mit dem Befehl, dem fehlgeschlagenen Schritt (die CLI gibt `precheck / signup /
verify / consent / key / chat` aus) und der Meldung des Panels selbst. Füge niemals einen vollständigen API-Schlüssel ein — die
letzten vier Zeichen reichen aus.

## 📄 Lizenz

MIT — siehe [LICENSE](LICENSE). Das Tool ist nicht mit Token Harbor verbunden; verwende es für Konten,
die dir gehören, und respektiere die Bedingungen des Panels.