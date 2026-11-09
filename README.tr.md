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

**Otomatik oluşturulan API anahtarlarıyla toplu Token Harbor hesabı oluşturun — OpenAI uyumlu çıkarım (DeepSeek V4.1 Flash, DeepSeek V4 Flash, MiMo V2.5, MiMo V2.6 Flash) + 9Router / OmniRoute bağlayıcıları.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-1%20(browser%20only)-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/free%20models-4-412991?style=for-the-badge)](https://tokenharbor.ai/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)

[🛠 Hızlı başlangıç](#-quick-start) · [🎁 Ücretsiz katman](#-free-tier--how-much-you-get) · [🤖 Modeller](#-models--all-4-of-them) · [🧪 API'yi kullanın](#-how-to-use-the-api) · [✅ Doğrulandı](#-verified-working--every-key-is-tested) · [🧭 Nasıl çalışır](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Seçenekler](#️-cli-options) · [🛰️ Proxy'ler](#️-behind-a-proxy) · [🐞 Sorunlar](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Bu neden var

Token Harbor, ücretsiz katmanı **yüzde tabanlı** olan bir Next.js panelidir (Supabase kimlik doğrulaması): kişisel bir **7 günlük pencere** ilk ücretsiz isteğinizle başlar ve sabit bir istek sayısı yerine liste fiyatının bir payını tüketir. Kayıt, e-posta + şifre ile **Cloudflare Turnstile widget'ı** ve ağ başına bir sınırla yapılır — bir ağ bir hesap demektir — yani toplu bir çalıştırma aslında "hesap başına bir taze çıkış" demektir.

Kayıttan sonra iki kapı vardır ve ikisi de kolayca gözden kaçar: API, kayıt e-postasındaki bağlantı açılana kadar `403 email_verification_required` yanıtı verir ve her `:free` rotası, ücretsiz modeller onayı etkinleştirilene kadar `403 free_models_disabled` yanıtı verir — ve bu onay uç noktası **istemcinin gösterdiği metni doğrular** (`shown_text`), bu yüzden çıplak bir `{"free_models_enabled":true}` yanıtı `400 reload_and_retry` verir. Bu CLI hepsini yapar, Next.js action kimliklerini her çalıştırmada canlı sayfadan okur ve yalnızca canlı bir chat-200 geçen anahtarları yazar.

## 🎁 Ücretsiz katman — ne kadar alırsınız

| Ne | Değer |
| --- | --- |
| Ücretsiz modeller | **4** — DeepSeek V4.1 Flash, DeepSeek V4 Flash, MiMo V2.5, MiMo V2.6 Flash (`:free` soneki) |
| Kota | **liste fiyatının yüzdesi**, sabit istek sayısı yok (ölçüldü: ~25 çağrıdan sonra hâlâ `0%`) |
| Pencere | **kişisel 7 gün**, ilk ücretsiz isteğinizle başlar (`x-th-free-resets` başlığı) |
| Hesap hız sınırı | **60 istek/dk**, **1.800 istek/sa** |
| IP hız sınırı | **100 istek/dk**, **3.000 istek/sa** (aşırı hızda bekleme süresiyle `429` yanıtı) |
| Eşzamanlılık | sınırlanmamış |
| Ücretli modeller | 70+ (Claude, Grok, GLM, MiMo Pro …) — kredi gerektirir; sıfır bakiyeli bir hesap `402` yanıtı verir |
| Kart gerekli | **Hayır** |
| Telefon gerekli | **Hayır** |
| Captcha | Kayıtta **Cloudflare Turnstile** — `src/solver.js` aynı çıkış üzerinden ekran dışı bir Chrome'da gerçek bir token üretir |
| E-posta doğrulaması | **gerekli** — CLI bağlantıyı açar ve `?verify=success` adresine giden `307` yönlendirmesini takip eder |
| Ölçeklenen birim | **bir hesap = bir anahtar** → `--count N` aslında "N ağdan N hesap" demektir |

Kaydetmeye değer başlıklar: `x-th-plan`, `x-th-free-used-pct`, `x-th-free-resets`,
`x-th-upstream-model`, `x-th-route-decision`.

## 🤖 Modeller — dördü de

| Model kimliği | Notlar |
| --- | --- |
| `deepseek-v4.1-flash:free` | varsayılan; PONG yanıtını ~9-11 sn'de verir |
| `deepseek-v4-flash:free` | CLI'nin canlı kapıda da denediği yedek model |
| `mimo-v2.5:free` | MiMo ailesi |
| `mimo-v2.6-flash:free` | dördü arasında en hızlısı |

Uç nokta toplamda **78 model kimliği** sunar (geçerli herhangi bir anahtarla `GET /v1/models`); yukarıdaki dördü kredi olmadan çalışanlardır. Araçlar/fonksiyon çağırma ücretsiz rotalarda çalışır: bir `get_time` şeması gerçek bir `tool_calls` dizisi olarak döner.

## 🧪 API nasıl kullanılır

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

## 🚀 Tek komut

```bash
npm start            # menü → "Mint keys" → kaç tane → bitti
```

`npm start` başlatıcıyı açar, **1) Mint keys** yalnızca bir sayı sorar ve başka hiçbir şey sormaz, ardından CLI anahtar başına bir hesap oluşturur, her birini canlı bir sohbet çağrısıyla doğrular ve hayatta kalanları `keys.txt` dosyasına yazar.

## 🛠 Hızlı başlangıç

```bash
git clone https://github.com/F0Rextasy/tokenharbor-bulk-apikey.git
cd tokenharbor-bulk-apikey
npm install
npm start            # menü bir kez ücretsiz Mailtrap API token'ı ister, sonra hatırlar
```

**Mailtrap token'ı tek kurulum adımıdır ve başlatıcı bunu bir kez ister.** Token Harbor, gerçek bir gelen posta sunucusuna benzeyen bir posta alan adını kabul eder ve genel tek kullanımlık alan adlarına "insan doğrulamasını tamamlayın" yanıtı verir (onlar için widget'ı bile oluşturmaz), bu yüzden CLI'nin okuyabildiği bir posta kutusuna ihtiyacı vardır. Ücretsiz katman yeterlidir: [mailtrap.io](https://mailtrap.io) adresinde bir hesap oluşturun → **Settings → API Tokens**, ardından token'ı menü istemine yapıştırın — `mailtrap.txt` dosyasında saklanır ve bir daha sorulmaz (veya `MAILTRAP_TOKEN` değişkenini dışa aktarın ya da dosyayı kendiniz yazın).

Token olmadan da CLI çalışır, genel posta hizmetlerine geri döner ve panel bu adresi reddettiğinde bunu açıkça size söyler.

## ✅ Doğrulanmış çalışıyor — her anahtar test edilir

Bir anahtar `keys.txt` dosyasına ancak oluşturma anında şunlardan sonra yazılır:

- bir `:free` modelde canlı `chat-200`, ve
- **iki farklı istem** 200 yanıtı verip boş olmayan ve **farklı** içerik döndürdüğünde.

Uçtan uca ölçüm (`node src/cli.js --auto --count 1 --pool proxies.txt`):

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

İstediğiniz zaman `npm start` → **2) Verify keys** (`node src/cli.js --verify`) ile yeniden kontrol edin; ölü anahtarlar `keys-dead.txt` dosyasına taşınır, canlı kapısı tamamlanamayan bir anahtar (ör. ağ bir hız sınırına takıldı) `keys-unverified.txt` dosyasına düşer, böylece hesap asla kaybolmaz.

## 🧭 Nasıl çalışır

1. **Posta kutusu** — Mailtrap hesabınızda hesap başına taze bir gelen kutusu (`mailtrap.txt`); genel mail.tm / mail.gw yedek raylardır.
2. **Kayıt** — Next.js server-action kimlikleri (`next-action`, `$ACTION_KEY`, `x-deployment-id`) her çalıştırmada canlı sayfadan okunur, böylece bir panel yeniden dağıtımı CLI'yi bozmaz; cihaz parmak izi ve saat dilimi istekle birlikte gider ve saat dilimi makinenizden değil çıkıştan ölçülür.
3. **İnsan doğrulaması** — panel widget'ı oluşturduğunda, kayıt gerçek bir Chrome'da yeniden oynatılır (`src/solver.js`, `puppeteer-core` + zaten kurulu Chrome; `--enable-automation` bilerek bastırılır), onay kutusuna fareyle tıklanır ve o tarayıcının oturum çerezleri CLI'ye geri verilir.
4. **E-posta doğrulaması** — posta kutusundaki bağlantı açılır; token sunucu tarafında tüketilir ve `307 → /dashboard?verify=success` yanıtı verir.
5. **Ücretsiz modeller onayı** — panonun gösterdiği onay metniyle (`src/consent-text.txt`) `POST /api/me/privacy`, `screen: "consent_modal"`, `path: "/dashboard"`.
6. **Anahtar + canlı kapı** — `POST /api/keys`, ardından anahtar yazılmadan önce iki farklı istemin ikisi de farklı içerikle 200 yanıtı vermelidir.

## ⚙️ CLI seçenekleri

```bash
node src/cli.js --auto --count 5             # beş hesap → beş anahtar
node src/cli.js --auto --count 5 --pool proxies.txt
node src/cli.js --verify                     # keys.txt dosyasını canlı kontrol et, ölüler → keys-dead.txt
node src/cli.js --screen --pool proxies.txt  # hangi çıkışlar panele ulaşabiliyor
node src/cli.js --models                     # ücretsiz model listesi (bir anahtar gerektirir)
node src/cli.js --help
```

| bayrak | anlamı |
| --- | --- |
| `--count <n>` | oluşturulacak hesap (ve anahtar) sayısı, varsayılan 1 |
| `--pool <file>` | proxy listesi, satır başına bir çıkış (`http://host:port`, `socks5://user:pass@host:port`, `host:port`); satır içi `#` yorumları sorun değil |
| `--headless` | yedek tarayıcıyı başsız çalıştır (varsayılan: captcha'nın beklediği ekran dışı pencere) |
| `--screen` | havuzu panele karşı test et ve her çıkış için canlı/ölü yazdır |
| `--verify` | `keys.txt` dosyasını canlı doğrula; ölü anahtarlar `keys-dead.txt` dosyasına yazılır |
| `--models` | ücretsiz model kimliklerini yazdır |

Ölen bir çıkış asla bir hesaba mal olmaz: kayıt ve canlı kapı ikisi de diğer havuz satırlarında yeniden dener ve bir `429`, panelin belirttiği süre kadar bekler.

## 🛰️ Proxy arkasında

CLI varsayılan olarak **doğrudan** çalışır. `proxies.txt` dosyasına satır başına bir çıkış koyun (başlatıcı bunu otomatik olarak alır) veya `--pool` ile geçin:

```text
http://127.0.0.1:8080
socks5://user:pass@10.0.0.5:1080
10.0.0.5:8080
```

İsteğe bağlı — ölçekte önerilir: panel kayıtları **ağ başına** sınırlar, bu yüzden hesap başına bir taze çıkış daha büyük bir çalıştırmayı sağlıklı tutar. Posta doğrudan Mailtrap hesabınızdan okunur (bir posta sağlayıcısı panel değildir), bu yüzden yavaş bir çıkış posta kutusu adımını bozamaz.

## 📄 Dosyalar

| Yol | Ne |
| --- | --- |
| `keys.txt` | doğrulanmış anahtarlar, satır başına bir tane (yalnızca canlı kapıdan sonra yazılır) |
| `keys-dead.txt` | yanıt vermeyi bırakan anahtarlar (`--verify` tarafından) |
| `keys-unverified.txt` | canlı kapısı tamamlanamayan anahtarlar — hesap var, anahtar gerçek |
| `accounts.jsonl` | hesap başına bir satır: e-posta + adım sonuçları |
| `mailtrap.txt` | Mailtrap API token'ınız (tek satır) |
| `proxies.txt` | isteğe bağlı proxy listesi |
| `src/cli.js` | oluşturma / doğrulama / tarama CLI'si |
| `src/launcher.js` | menü (`npm start`) |
| `src/solver.js` | Turnstile widget'ı için tarayıcı yarısı |
| `src/consent-text.txt` | panelin doğruladığı onay metni |
| `src/connect-9router.js`, `src/connect-omniroute.js` | yönlendirici bağlayıcıları |

## 🔌 9Router'a bağlan

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

Bir `openai-compatible` sağlayıcı düğümü (`tokenharbor`, temel URL
`https://tokenharbor.ai/v1`) ve `keys.txt` içindeki her anahtar için bir bağlantı kaydeder, böylece 9Router anahtarlarınız arasında yük dengelemesi yapar. Idempotent: mevcut bir düğüm veya bağlantı yeniden kullanılır ve numaralandırma orada zaten bulunan en yüksek `tokenharbor-0NN` değerinden devam eder.

## 🔌 OmniRoute'a bağlan

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
```

OmniRoute için aynı yapı (sağlayıcı düğümü + anahtar başına bir bağlantı). Başlatıcı ikisini de **6** ve **7** menü öğeleri olarak sunar ve `npm run 9router` / `npm run omniroute` aynısını yapar.

## 🔑 Bir anahtar size ne kazandırır

- yukarıdaki dört `:free` model, hesap başına 60 istek/dk ve 1.800 istek/sa hızında (IP başına 100 istek/dk);
- kişisel 7 günlük bir pencere içinde yüzde tabanlı bir kota (`x-th-free-resets` ne zaman yenileneceğini söyler);
- araç çağırmalı OpenAI uyumlu `/v1/chat/completions`, böylece herhangi bir OpenAI SDK, CLI veya yönlendirici `base_url` değerini `https://tokenharbor.ai/v1` olarak değiştirerek çalışır;
- ücretli modeller hesabın kredisi olana kadar kilitli kalır (aksi halde `402`).

## 🐞 Sorunlar

Komut, başarısız olan adım (CLI `precheck / signup / verify / consent / key / chat` yazdırır) ve panelin kendi mesajıyla bir sorun açın. Tam bir API anahtarını asla yapıştırmayın — son dört karakter yeterlidir.

## 📄 Lisans

MIT — bkz. [LICENSE](LICENSE). Araç Token Harbor ile bağlantılı değildir; sahip olduğunuz hesaplar için kullanın ve panelin şartlarına uyun.