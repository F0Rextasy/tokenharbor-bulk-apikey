<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

# Token Harbor — claves API en lote

Crea cuentas y claves API de Token Harbor (tokenharbor.ai) desde tu terminal.
Token Harbor ofrece un endpoint **compatible con OpenAI** con un nivel gratuito permanente, por lo que una
clave funciona en cualquier SDK de OpenAI, CLI o router local.

```bash
git clone https://github.com/F0Rextasy/tokenharbor-bulk-apikey.git
cd tokenharbor-bulk-apikey
npm install
echo "YOUR_MAILTRAP_TOKEN" > mailtrap.txt   # free Mailtrap API token, one line (see Setup)
npm start            # menu → "Mint keys" → how many → done
```

`npm start` abre un menú; elige **1) Mint keys**, escribe un número, y la CLI crea una
cuenta por clave, verifica cada una con una **llamada de chat en vivo**, y escribe las supervivientes en
`keys.txt`. Después del token de Mailtrap único que se indica abajo, no se pide nada más: ni tokens de captcha, ni proxy, ni prompts.

## Configuración (un minuto)

Token Harbor acepta un dominio de correo que parezca un host de correo entrante real y rechaza los
desechables públicos, así que la CLI necesita un buzón que pueda leer:

1. Crea una cuenta gratuita en [mailtrap.io](https://mailtrap.io) → **Settings → API Tokens**.
2. Coloca el token en  junto a  (una línea), o exporta .

Ese es el único paso de configuración. Todo lo demás — la bandeja de entrada por cuenta, el enlace de
verificación, el consentimiento de modelos gratuitos, la clave — es automático.

## Qué obtienes

| campo | valor |
|---|---|
| Base de la API | `https://tokenharbor.ai/v1` |
| Autenticación | `Authorization: Bearer YOUR_KEY` |
| Modelos gratuitos | `deepseek-v4.1-flash:free` · `deepseek-v4-flash:free` · `mimo-v2.5:free` · `mimo-v2.6-flash:free` |
| Modelos de pago | 70+ (Claude, Grok, GLM, MiMo Pro …) — requieren créditos en la cuenta |
| Formato de clave | `thk_live_` + 63 caracteres |
| Tarjeta / teléfono | no requeridos para el nivel gratuito |

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
| `--count <n>` | cuentas (y claves) a crear, por defecto 1 |
| `--pool <file>` | lista de proxies, una salida por línea (`http://host:port`, `socks5://user:pass@host:port`, `host:port`) |
| `--headless` | ejecutar el navegador de respaldo en modo headless (por defecto: ventana fuera de pantalla, que es lo que espera el captcha) |
| `--verify` | verificar en vivo `keys.txt` e imprimir viva/muerta por clave |

Salida: `keys.txt` (una clave por línea, solo las claves que pasaron), `accounts.jsonl` (una línea
por cuenta con los resultados de cada paso, sin secretos más allá del correo de la cuenta que te pertenece).

## Cómo funciona la creación

1. **Buzón** — con un token de Mailtrap (nivel gratuito, una línea en `mailtrap.txt`) la CLI abre una
   bandeja de entrada nueva por cuenta en tu propia cuenta de Mailtrap; sin él, recurre a los
   servicios públicos mail.tm / mail.gw.
2. **Registro** — los ids de las server actions de Next.js se leen de la página en vivo en cada ejecución, así que
   un redespliegue del panel no rompe la CLI. La huella del dispositivo y la zona horaria viajan
   con la solicitud; la zona horaria se mide desde tu salida, no desde tu máquina.
3. **Verificación humana** — un dominio de correo desechable hace que el panel responda "complete the human check"
   (y ni siquiera renderiza el widget allí), así que un host de correo entrante real es el riel que
   funciona. Cuando *sí* se renderiza un widget, el registro se
   reproduce en un Chrome real (`src/solver.js`, `puppeteer-core` + el Chrome que ya tienes en tu
   máquina): el formulario se escribe con teclas reales, la casilla de Turnstile se marca con el
   ratón, y las cookies de sesión se devuelven a la CLI.
4. **Verificación por correo** — se abre el enlace del buzón (el token se consume
   del lado del servidor y responde un `307` a `?verify=success`).
5. **Consentimiento de modelos gratuitos** — el interruptor de compartir datos se activa con el texto de consentimiento que
   muestra el panel (`src/consent-text.txt`). Sin él, cada llamada `:free` responde
   `403 free_models_disabled`.
6. **Clave** — `POST /api/keys`, luego una **puerta en vivo**: dos prompts diferentes deben responder ambos
   `200` con texto no vacío y diferente. Una clave que falla la puerta nunca se escribe.

## Controles de calidad

Cada clave en `keys.txt` pasó, en el momento de la creación:

- un `chat-200` en vivo en un modelo `:free`, y
- **dos prompts diferentes** respondiendo 200 con contenido no vacío y **diferente**.

Una clave que no puede usar herramientas, una clave muerta o un proveedor muerto nunca se escribe en la
salida de este repositorio ni se conecta a un combo. Vuelve a comprobar en cualquier momento con `node src/cli.js --verify`.

## Límites (nivel gratuito)

| límite | valor |
|---|---|
| asignación | **porcentaje del precio de lista** — sin un número fijo de solicitudes |
| ventana | **7 días personales**, comienza con tu primera solicitud gratuita (`x-th-free-resets`) |
| tasa por cuenta | 60 solicitudes/min, 1,800 solicitudes/hora |
| tasa por IP | 100 solicitudes/min, 3,000 solicitudes/hora |
| concurrencia | sin límite; por encima de la tasa responde `429` |

Cabeceras de respuesta que vale la pena registrar: `x-th-plan`, `x-th-free-used-pct`, `x-th-free-resets`,
`x-th-upstream-model`, `x-th-route-decision`.

## Proxies — opcional

La CLI se ejecuta **directamente** por defecto. Coloca una salida por línea en `proxies.txt` (o pasa
`--pool`) y cada solicitud — incluido el navegador de respaldo — sale a través de un proxy:

```text
http://127.0.0.1:8080
socks5://user:pass@10.0.0.5:1080
```

Opcional — recomendado a escala: el panel limita los registros por red, así que una salida nueva
por cuenta mantiene saludable una ejecución más grande.

## Conectar un router local

Ambos conectores son idempotentes y leen `keys.txt`:

```bash
node src/connect-9router.js    --base http://localhost:8080 --password 123456
node src/connect-omniroute.js  --base http://localhost:20128 --password 123456
```

Cada uno crea un nodo de proveedor `openai-compatible` (`tokenharbor`) con URL base
`https://tokenharbor.ai/v1` y una conexión por clave, así que el router balancea la carga entre
tus claves. El menú del lanzador expone las mismas dos acciones.

## Notas

- Cada cuenta pertenece a la dirección de correo con la que se creó — conserva `accounts.jsonl`
  si quieres volver a iniciar sesión más tarde.
- El nivel gratuito almacena el tráfico de rutas gratuitas bajo el consentimiento descrito en
  `src/consent-text.txt`; las rutas de pago no se usan para entrenamiento.
- El texto de consentimiento está versionado por el panel. Si cambia, la CLI lo indica y vuelves a ejecutar
  una vez después de pulsar **Enable free models** en el panel.
- Se requiere Node.js 18+. `puppeteer-core` solo se usa cuando el panel pide la verificación
  humana; la CLI en sí es solo stdlib.

## Licencia

MIT — consulta [LICENSE](LICENSE).