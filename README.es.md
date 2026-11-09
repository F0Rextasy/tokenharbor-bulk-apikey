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

**Crea cuentas de Token Harbor en masa con claves API generadas automáticamente — inferencia compatible con OpenAI (DeepSeek V4.1 Flash, DeepSeek V4 Flash, MiMo V2.5, MiMo V2.6 Flash) + conectores 9Router / OmniRoute.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-1%20(browser%20only)-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/free%20models-4-412991?style=for-the-badge)](https://tokenharbor.ai/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)

[🛠 Inicio rápido](#-quick-start) · [🎁 Nivel gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-4-of-them) · [🧪 Usar la API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Cómo funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Opciones](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Por qué existe esto

Token Harbor es un panel de Next.js (autenticación con Supabase) cuyo nivel gratuito se basa en **porcentajes**: una
**ventana personal de 7 días** comienza con tu primera solicitud gratuita y consume una parte del
precio de lista, no un número fijo de solicitudes. El registro es con correo electrónico + contraseña con un **widget de Cloudflare
Turnstile** y un límite por red — una red significa una cuenta — así que una ejecución en masa es
en realidad "una salida nueva por cuenta".

Hay dos puertas después del registro y ambas son fáciles de pasar por alto: la API responde
`403 email_verification_required` hasta que se abre el enlace del correo de registro, y cada
ruta `:free` responde `403 free_models_disabled` hasta que se habilita el consentimiento de modelos gratuitos —
y ese endpoint de consentimiento **valida el texto que mostró el cliente** (`shown_text`), así que un simple
`{"free_models_enabled":true}` responde `400 reload_and_retry`. Esta CLI hace todo eso,
lee los ids de acción de Next.js de la página en vivo en cada ejecución, y solo escribe claves que pasan
un chat-200 en vivo.

## 🎁 Nivel gratuito — cuánto obtienes

| Qué | Valor |
| --- | --- |
| Modelos gratuitos | **4** — DeepSeek V4.1 Flash, DeepSeek V4 Flash, MiMo V2.5, MiMo V2.6 Flash (sufijo `:free`) |
| Asignación | **porcentaje del precio de lista**, sin número fijo de solicitudes (medido: aún `0%` tras ~25 llamadas) |
| Ventana | **7 días personales**, comienza con tu primera solicitud gratuita (cabecera `x-th-free-resets`) |
| Límite de tasa por cuenta | **60 req/min**, **1,800 req/h** |
| Límite de tasa por IP | **100 req/min**, **3,000 req/h** (al superar la tasa responde `429` con el tiempo de espera) |
| Concurrencia | sin límite |
| Modelos de pago | 70+ (Claude, Grok, GLM, MiMo Pro …) — requieren créditos; una cuenta con saldo cero responde `402` |
| Tarjeta requerida | **No** |
| Teléfono requerido | **No** |
| Captcha | **Cloudflare Turnstile** en el registro — `src/solver.js` genera un token real en un Chrome fuera de pantalla a través de la misma salida |
| Verificación por correo | **requerida** — la CLI abre el enlace y sigue el `307` a `?verify=success` |
| La unidad que escala | **una cuenta = una clave** → `--count N` es en realidad "N cuentas desde N redes" |

Cabeceras que vale la pena registrar: `x-th-plan`, `x-th-free-used-pct`, `x-th-free-resets`,
`x-th-upstream-model`, `x-th-route-decision`.

## 🤖 Modelos — los 4

| Id de modelo | Notas |
| --- | --- |
| `deepseek-v4.1-flash:free` | el predeterminado; responde PONG en ~9-11 s |
| `deepseek-v4-flash:free` | modelo de respaldo que la CLI también prueba en la puerta en vivo |
| `mimo-v2.5:free` | familia MiMo |
| `mimo-v2.6-flash:free` | el más rápido de los cuatro |

El endpoint sirve **78 ids de modelo** en total (`GET /v1/models` con cualquier clave válida); los cuatro
de arriba son los que funcionan sin créditos. Las herramientas/llamadas a funciones funcionan en las rutas gratuitas:
un esquema `get_time` vuelve como un array `tool_calls` real.

## 🧪 Cómo usar la API

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

## 🚀 Un solo comando

```bash
npm start            # menu → "Mint keys" → how many → done
```

`npm start` abre el lanzador, **1) Mint keys** pregunta una cantidad y nada más, luego la CLI
crea una cuenta por clave, verifica cada una con una llamada de chat en vivo y escribe las supervivientes
en `keys.txt`.

## 🛠 Inicio rápido

```bash
git clone https://github.com/F0Rextasy/tokenharbor-bulk-apikey.git
cd tokenharbor-bulk-apikey
npm install
echo "YOUR_MAILTRAP_TOKEN" > mailtrap.txt   # REQUIRED — see the warning below
npm start            # menu → 1) Mint keys → how many → done
```

> **Sin `mailtrap.txt` la creación no puede funcionar en absoluto.** Token Harbor rechaza todos los dominios de
> buzón públicos, así que nada puede leer el enlace de verificación y cada cuenta se quedaría atascada en
> `403 email_verification_required`. No hay alternativa: obtén primero un token gratuito.

**El token de Mailtrap es el único paso de configuración.** Token Harbor
acepta un dominio de correo que parezca un host de correo entrante real y responde "complete the human
check" a los dominios desechables públicos (para esos ni siquiera renderiza el widget), así que la CLI
necesita un buzón que pueda leer. El nivel gratuito es suficiente: crea una cuenta en
[mailtrap.io](https://mailtrap.io) → **Settings → API Tokens**, luego escribe ese valor en
`mailtrap.txt` junto a `package.json` (una línea), o exporta `MAILTRAP_TOKEN`. El lanzador
lo comprueba y te avisa si falta — nunca pide el valor en sí.

Sin el token la CLI aún intenta primero los raíles de correo públicos, y cada cuenta se detiene en
el muro de verificación humana del panel — por eso el archivo es obligatorio, no opcional.

## ✅ Verificado funcionando — cada clave se prueba

Una clave se escribe en `keys.txt` solo después de, en el momento de la creación:

- un `chat-200` en vivo en un modelo `:free`, y
- **dos prompts diferentes** que responden 200 con contenido no vacío y **diferente**.

Medido de extremo a extremo (`node src/cli.js --auto --count 1 --pool proxies.txt`):

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

Vuelve a comprobar en cualquier momento con `npm start` → **2) Verify keys** (`node src/cli.js --verify`); las claves
muertas pasan a `keys-dead.txt`, una clave cuya puerta en vivo no pudo completarse (p. ej. la red alcanzó un
límite de tasa) termina en `keys-unverified.txt` para que la cuenta nunca se pierda.

## 🧭 Cómo funciona

1. **Buzón** — una bandeja de entrada nueva por cuenta en tu cuenta de Mailtrap (`mailtrap.txt`); los
   mail.tm / mail.gw públicos son los raíles de respaldo.
2. **Registro** — los ids de acción del servidor de Next.js (`next-action`, `$ACTION_KEY`,
   `x-deployment-id`) se leen de la página en vivo en cada ejecución, así que un redespliegue del panel no rompe
   la CLI; la huella del dispositivo y la zona horaria viajan con la solicitud, y la zona horaria se
   mide desde la salida, no desde tu máquina.
3. **Verificación humana** — cuando el panel renderiza el widget, el registro se reproduce en un Chrome real
   (`src/solver.js`, `puppeteer-core` + el Chrome ya instalado; `--enable-automation` se
   suprime a propósito), se hace clic en la casilla con el ratón, y las cookies de sesión de ese navegador se devuelven
   a la CLI.
4. **Verificación por correo** — se abre el enlace del buzón; el token se consume
   en el servidor y responde `307 → /dashboard?verify=success`.
5. **Consentimiento de modelos gratuitos** — `POST /api/me/privacy` con el texto de consentimiento que muestra el panel
   (`src/consent-text.txt`), `screen: "consent_modal"`, `path: "/dashboard"`.
6. **Clave + puerta en vivo** — `POST /api/keys`, luego dos prompts diferentes deben responder ambos 200 con
   contenido diferente antes de que se escriba la clave.

## ⚙️ Opciones de la CLI

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
| `--count <n>` | cuentas (y claves) a crear, por defecto 1 |
| `--pool <file>` | lista de proxies, una salida por línea (`http://host:port`, `socks5://user:pass@host:port`, `host:port`); los comentarios en línea con `#` están bien |
| `--headless` | ejecutar el navegador de respaldo en modo headless (por defecto: ventana fuera de pantalla, que es lo que espera el captcha) |
| `--screen` | probar el pool contra el panel e imprimir vivo/muerto por salida |
| `--verify` | verificar en vivo `keys.txt`; las claves muertas se escriben en `keys-dead.txt` |
| `--models` | imprimir los ids de modelos gratuitos |
| `--strict-proxy` | nunca enviar una solicitud directa: la puerta en vivo también debe pasar por el pool (la variable de entorno `TOKENHARBOR_STRICT=1` hace lo mismo) |

Una salida que falla nunca cuesta una cuenta: el registro y la puerta en vivo reintentan en otras líneas del pool,
y un `429` espera el tiempo que indica el panel.

## 🛰️ Detrás de un proxy

La CLI se ejecuta **directamente** por defecto. Pon una salida por línea en `proxies.txt` (el lanzador la toma
automáticamente) o pasa `--pool`:

```text
http://127.0.0.1:8080
socks5://user:pass@10.0.0.5:1080
10.0.0.5:8080
```

Opcional — recomendado a escala: el panel limita los registros **por red**, así que una salida nueva
por cuenta mantiene saludable una ejecución más grande. El correo se lee directamente de tu cuenta de Mailtrap (un
proveedor de correo no es el panel), así que una salida lenta no puede romper el paso del buzón.

## 📄 Archivos

| Ruta | Qué |
| --- | --- |
| `keys.txt` | claves verificadas, una por línea (escritas solo después de la puerta en vivo) |
| `keys-dead.txt` | claves que dejaron de responder (de `--verify`) |
| `keys-unverified.txt` | claves cuya puerta en vivo no pudo terminar — la cuenta existe, la clave es real |
| `accounts.jsonl` | una línea por cuenta: correo electrónico + resultados de los pasos |
| `mailtrap.txt` | tu token de API de Mailtrap (una línea) |
| `proxies.txt` | lista de proxies opcional |
| `src/cli.js` | la CLI de creación / verificación / sondeo |
| `src/launcher.js` | el menú (`npm start`) |
| `src/solver.js` | la mitad del navegador para el widget de Turnstile |
| `src/consent-text.txt` | el texto de consentimiento que valida el panel |
| `src/connect-9router.js`, `src/connect-omniroute.js` | conectores de router |

## 🔌 Conectar con 9Router

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

Registra un nodo de proveedor `openai-compatible` (`tokenharbor`, URL base
`https://tokenharbor.ai/v1`) y una conexión por clave en `keys.txt`, así que 9Router equilibra la carga
entre tus claves. Idempotente: un nodo o conexión existente se reutiliza, y la numeración continúa
desde el `tokenharbor-0NN` más alto que ya esté allí.

## 🔌 Conectar con OmniRoute

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
```

Misma forma para OmniRoute (nodo de proveedor + una conexión por clave). El lanzador expone ambos como
elementos del menú **6** y **7**, y `npm run 9router` / `npm run omniroute` hacen lo mismo.

## 🔑 Qué te da una clave

- los cuatro modelos `:free` de arriba, a 60 req/min y 1,800 req/h por cuenta (100 req/min por IP);
- una asignación basada en porcentaje dentro de una ventana personal de 7 días (`x-th-free-resets` te dice cuándo
  se renueva);
- `/v1/chat/completions` compatible con OpenAI con llamadas a funciones, así que cualquier SDK, CLI o router de OpenAI
  funciona cambiando `base_url` a `https://tokenharbor.ai/v1`;
- los modelos de pago permanecen bloqueados hasta que la cuenta tenga créditos (`402` en caso contrario).

## 🐞 Problemas

Abre un issue con el comando, el paso que falló (la CLI imprime `precheck / signup /
verify / consent / key / chat`) y el mensaje propio del panel. Nunca pegues una clave API completa — los
últimos cuatro caracteres son suficientes.

## 📄 Licencia

MIT — ver [LICENSE](LICENSE). La herramienta no está afiliada con Token Harbor; úsala para cuentas
que poseas y respeta los términos del panel.