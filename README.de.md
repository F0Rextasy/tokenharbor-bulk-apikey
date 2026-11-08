<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

# Token Harbor — Massen-API-Schlüssel

Erstelle Token-Harbor-Konten (tokenharbor.ai) und API-Schlüssel über dein Terminal.
Token Harbor bietet einen **OpenAI-kompatiblen** Endpunkt mit einer dauerhaft kostenlosen Stufe, sodass ein
Schlüssel in jedem OpenAI-SDK, CLI oder lokalen Router funktioniert.

```bash
git clone https://github.com/F0Rextasy/tokenharbor-bulk-apikey.git
cd tokenharbor-bulk-apikey
npm install
echo "YOUR_MAILTRAP_TOKEN" > mailtrap.txt   # free Mailtrap API token, one line (see Setup)
npm start            # menu → "Mint keys" → how many → done
```

`npm start` öffnet ein Menü; wähle **1) Mint keys**, gib eine Zahl ein, und die CLI erstellt ein
Konto pro Schlüssel, verifiziert jedes mit einem **Live-Chat-Aufruf** und schreibt die überlebenden
in `keys.txt`. Nach dem einmaligen Mailtrap-Token unten wird nichts weiter abgefragt: keine Captcha-Token, kein Proxy, keine Eingabeaufforderungen.

## Einrichtung (eine Minute)

Token Harbor akzeptiert eine Mail-Domain, die wie ein echter Inbound-Mail-Host aussieht, und lehnt
öffentliche Wegwerf-Domains ab, daher benötigt die CLI ein Postfach, das sie lesen kann:

1. Erstelle ein kostenloses Konto bei [mailtrap.io](https://mailtrap.io) → **Settings → API Tokens**.
2. Lege das Token in  neben  ab (eine Zeile), oder exportiere .

Das ist der einzige Einrichtungsschritt. Alles andere — das Postfach pro Konto, der Verifizierungslink,
die Zustimmung zu den kostenlosen Modellen, der Schlüssel — erfolgt automatisch.

## Was du bekommst

| Feld | Wert |
|---|---|
| API-Basis | `https://tokenharbor.ai/v1` |
| Authentifizierung | `Authorization: Bearer YOUR_KEY` |
| Kostenlose Modelle | `deepseek-v4.1-flash:free` · `deepseek-v4-flash:free` · `mimo-v2.5:free` · `mimo-v2.6-flash:free` |
| Kostenpflichtige Modelle | 70+ (Claude, Grok, GLM, MiMo Pro …) — sie benötigen Guthaben auf dem Konto |
| Schlüsselformat | `thk_live_` + 63 Zeichen |
| Karte / Telefon | für die kostenlose Stufe nicht erforderlich |

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

| Flag | Bedeutung |
|---|---|
| `--count <n>` | Anzahl der zu erstellenden Konten (und Schlüssel), Standard 1 |
| `--pool <file>` | Proxy-Liste, ein Exit pro Zeile (`http://host:port`, `socks5://user:pass@host:port`, `host:port`) |
| `--headless` | Fallback-Browser headless ausführen (Standard: Off-Screen-Fenster, was das Captcha erwartet) |
| `--verify` | `keys.txt` live verifizieren und live/dead pro Schlüssel ausgeben |

Ausgabe: `keys.txt` (ein Schlüssel pro Zeile, nur Schlüssel, die bestanden haben), `accounts.jsonl` (eine Zeile
pro Konto mit den Schrittergebnissen, keine Geheimnisse außer der Konto-E-Mail, die dir gehört).

## Wie das Minting funktioniert

1. **Postfach** — mit einem Mailtrap-Token (kostenlose Stufe, eine Zeile in `mailtrap.txt`) öffnet die CLI ein
   frisches Postfach pro Konto in deinem eigenen Mailtrap-Konto; ohne es fällt sie auf die
   öffentlichen Dienste mail.tm / mail.gw zurück.
2. **Registrierung** — die Next.js-Server-Action-IDs werden bei jedem Lauf von der Live-Seite gelesen, sodass
   ein Panel-Redeploy die CLI nicht bricht. Der Geräte-Fingerabdruck und die Zeitzone werden
   mit der Anfrage übertragen; die Zeitzone wird von deinem Exit gemessen, nicht von deinem Rechner.
3. **Menschliche Prüfung** — eine Wegwerf-Mail-Domain lässt das Panel mit „complete the human check“ antworten
   (und es rendert das Widget dort nicht einmal), daher ist ein echter Inbound-Mail-Host die Schiene, die
   funktioniert. Wenn ein Widget *gerendert wird*, wird die Registrierung
   in einem echten Chrome wiederholt (`src/solver.js`, `puppeteer-core` + das bereits auf deinem
   Rechner vorhandene Chrome): Das Formular wird mit echten Tastenanschlägen ausgefüllt, das Turnstile-Kontrollkästchen wird mit der
   Maus angeklickt, und die Sitzungs-Cookies werden an die CLI zurückgegeben.
4. **E-Mail-Verifizierung** — der Link aus dem Postfach wird geöffnet (das Token wird serverseitig verbraucht und antwortet mit einem `307` auf `?verify=success`).
5. **Zustimmung zu kostenlosen Modellen** — der Datenfreigabe-Schalter wird mit dem Zustimmungstext aktiviert, den
   das Dashboard anzeigt (`src/consent-text.txt`). Ohne ihn antwortet jeder `:free`-Aufruf mit
   `403 free_models_disabled`.
6. **Schlüssel** — `POST /api/keys`, dann ein **Live-Gate**: zwei verschiedene Prompts müssen beide mit
   `200` und nicht-leerem, unterschiedlichem Text antworten. Ein Schlüssel, der das Gate nicht besteht, wird nie geschrieben.

## Qualitätsgates

Jeder Schlüssel in `keys.txt` hat zum Zeitpunkt des Mintings bestanden:

- einen Live-`chat-200` auf einem `:free`-Modell, und
- **zwei verschiedene Prompts**, die mit 200 und nicht-leerem und **unterschiedlichem** Inhalt antworten.

Ein Schlüssel, der keine Tools nutzen kann, ein toter Schlüssel oder ein toter Anbieter wird niemals in die
Ausgabe dieses Repos geschrieben oder in eine Combo eingebunden. Jederzeit erneut prüfen mit `node src/cli.js --verify`.

## Limits (kostenlose Stufe)

| Limit | Wert |
|---|---|
| Kontingent | **Prozentsatz des Listenpreises** — keine feste Anfragenanzahl |
| Fenster | **persönliche 7 Tage**, beginnt mit deiner ersten kostenlosen Anfrage (`x-th-free-resets`) |
| Konto-Rate | 60 Anfragen/Minute, 1.800 Anfragen/Stunde |
| IP-Rate | 100 Anfragen/Minute, 3.000 Anfragen/Stunde |
| Parallelität | nicht begrenzt; bei Überschreitung der Rate antwortet `429` |

Response-Header, die es sich zu protokollieren lohnt: `x-th-plan`, `x-th-free-used-pct`, `x-th-free-resets`,
`x-th-upstream-model`, `x-th-route-decision`.

## Proxies — optional

Die CLI läuft standardmäßig **direkt**. Lege einen Exit pro Zeile in `proxies.txt` ab (oder übergib
`--pool`), und jede Anfrage — einschließlich des Fallback-Browsers — verlässt das System über einen Proxy:

```text
http://127.0.0.1:8080
socks5://user:pass@10.0.0.5:1080
```

Optional — bei Skalierung empfohlen: Das Panel begrenzt Registrierungen pro Netzwerk, daher hält ein frischer Exit
pro Konto einen größeren Lauf gesund.

## Einen lokalen Router verbinden

Beide Konnektoren sind idempotent und lesen `keys.txt`:

```bash
node src/connect-9router.js    --base http://localhost:8080 --password 123456
node src/connect-omniroute.js  --base http://localhost:20128 --password 123456
```

Jeder erstellt einen `openai-compatible`-Provider-Knoten (`tokenharbor`) mit Basis-URL
`https://tokenharbor.ai/v1` und einer Verbindung pro Schlüssel, sodass der Router über
deine Schlüssel lastverteilt. Das Launcher-Menü bietet dieselben beiden Aktionen.

## Hinweise

- Jedes Konto gehört zu der E-Mail-Adresse, mit der es erstellt wurde — bewahre `accounts.jsonl`
  auf, wenn du dich später wieder anmelden möchtest.
- Die kostenlose Stufe speichert Free-Route-Traffic unter der in
  `src/consent-text.txt` beschriebenen Zustimmung; kostenpflichtige Routen werden nicht zum Training verwendet.
- Der Zustimmungstext wird vom Panel versioniert. Wenn er sich ändert, sagt die CLI es dir, und du führst sie
  einmal erneut aus, nachdem du im Dashboard auf **Enable free models** geklickt hast.
- Node.js 18+ ist erforderlich. `puppeteer-core` wird nur verwendet, wenn das Panel die menschliche
  Prüfung verlangt; die CLI selbst nutzt nur die Standardbibliothek.

## Lizenz

MIT — siehe [LICENSE](LICENSE).