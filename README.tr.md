<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

# Token Harbor — toplu API anahtarları

Token Harbor (tokenharbor.ai) hesaplarını ve API anahtarlarını terminalinizden oluşturun.
Token Harbor, kalıcı olarak ücretsiz bir katmanla **OpenAI uyumlu** bir uç nokta sunar, böylece bir
anahtar herhangi bir OpenAI SDK, CLI veya yerel yönlendiricide çalışır.

```bash
git clone https://github.com/F0Rextasy/tokenharbor-bulk-apikey.git
cd tokenharbor-bulk-apikey
npm install
echo "YOUR_MAILTRAP_TOKEN" > mailtrap.txt   # free Mailtrap API token, one line (see Setup)
npm start            # menu → "Mint keys" → how many → done
```

`npm start` bir menü açar; **1) Mint keys** seçeneğini seçin, bir sayı yazın ve CLI her anahtar için
bir hesap oluşturur, her birini **canlı bir sohbet çağrısı** ile doğrular ve hayatta kalanları
`keys.txt` dosyasına yazar. Aşağıdaki tek seferlik Mailtrap token'ından sonra başka hiçbir şey sorulmaz: captcha token'ı yok, proxy yok, istem yok.

## Kurulum (bir dakika)

Token Harbor, gerçek bir gelen posta sunucusu gibi görünen bir posta alan adını kabul eder ve
herkese açık tek kullanımlık olanları reddeder, bu yüzden CLI'nin okuyabileceği bir posta kutusuna ihtiyacı vardır:

1. [mailtrap.io](https://mailtrap.io) adresinde ücretsiz bir hesap oluşturun → **Settings → API Tokens**.
2. Token'ı  yanındaki  dosyasına koyun (tek satır) veya  dışa aktarın.

Tek kurulum adımı budur. Geri kalan her şey — hesap başına gelen kutusu, doğrulama bağlantısı,
ücretsiz modeller onayı, anahtar — otomatiktir.

## Ne elde edersiniz

| alan | değer |
|---|---|
| API tabanı | `https://tokenharbor.ai/v1` |
| Kimlik doğrulama | `Authorization: Bearer YOUR_KEY` |
| Ücretsiz modeller | `deepseek-v4.1-flash:free` · `deepseek-v4-flash:free` · `mimo-v2.5:free` · `mimo-v2.6-flash:free` |
| Ücretli modeller | 70+ (Claude, Grok, GLM, MiMo Pro …) — hesapta kredi gerektirir |
| Anahtar biçimi | `thk_live_` + 63 karakter |
| Kart / telefon | ücretsiz katman için gerekli değil |

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

| bayrak | anlamı |
|---|---|
| `--count <n>` | oluşturulacak hesap (ve anahtar) sayısı, varsayılan 1 |
| `--pool <file>` | proxy listesi, satır başına bir çıkış (`http://host:port`, `socks5://user:pass@host:port`, `host:port`) |
| `--headless` | yedek tarayıcıyı başsız çalıştır (varsayılan: kapalı; captcha'nın beklediği ekran dışı pencere) |
| `--verify` | `keys.txt` dosyasını canlı doğrula ve her anahtar için canlı/ölü durumunu yazdır |

Çıktı: `keys.txt` (satır başına bir anahtar, yalnızca geçen anahtarlar), `accounts.jsonl` (hesap
başına bir satır, adım sonuçlarıyla birlikte; sahip olduğunuz hesap e-postası dışında sır yok).

## Anahtar üretimi nasıl çalışır

1. **Posta kutusu** — bir Mailtrap token'ı ile (ücretsiz katman, `mailtrap.txt` içinde tek satır) CLI,
   kendi Mailtrap hesabınızda her hesap için yeni bir gelen kutusu açar; olmadan,
   herkese açık mail.tm / mail.gw servislerine geri döner.
2. **Kayıt** — Next.js sunucu eylem kimlikleri her çalıştırmada canlı sayfadan okunur, böylece
   bir panel yeniden dağıtımı CLI'yi bozmaz. Cihaz parmak izi ve saat dilimi istekle birlikte
   taşınır; saat dilimi makinenizden değil, çıkışınızdan ölçülür.
3. **İnsan doğrulaması** — tek kullanımlık bir posta alan adı, panelin "insan doğrulamasını tamamla"
   yanıtı vermesine neden olur (ve widget'ı orada hiç oluşturmaz), bu yüzden gerçek bir gelen posta sunucusu
   işe yarayan yoldur. Bir widget *oluşturulduğunda*, kayıt
   gerçek bir Chrome'da yeniden oynatılır (`src/solver.js`, `puppeteer-core` + makinenizde zaten bulunan Chrome):
   form gerçek tuşlarla yazılır, Turnstile onay kutusuna fareyle tıklanır ve oturum çerezleri
   CLI'ye geri verilir.
4. **E-posta doğrulaması** — posta kutusundaki bağlantı açılır (token sunucu tarafında tüketilir ve
   `?verify=success` adresine `307` yanıtı verir).
5. **Ücretsiz modeller onayı** — veri paylaşımı anahtarı, kontrol panelinin gösterdiği onay metniyle
   etkinleştirilir (`src/consent-text.txt`). Bu olmadan her `:free` çağrısı
   `403 free_models_disabled` yanıtı verir.
6. **Anahtar** — `POST /api/keys`, ardından **canlı kapı**: iki farklı istemin her ikisi de
   boş olmayan, farklı metinle `200` yanıtı vermelidir. Kapıdan geçemeyen bir anahtar asla yazılmaz.

## Kalite kapıları

`keys.txt` içindeki her anahtar, üretim anında şunları geçti:

- bir `:free` modelde canlı `chat-200`, ve
- **iki farklı istem** 200 yanıtı verdi ve içerik boş değil ve **farklı**.

Araçları kullanamayan bir anahtar, ölü bir anahtar veya ölü bir sağlayıcı asla bu deponun
çıktısına yazılmaz veya bir kombinasyona bağlanmaz. İstediğiniz zaman `node src/cli.js --verify` ile yeniden kontrol edin.

## Sınırlar (ücretsiz katman)

| sınır | değer |
|---|---|
| kota | **liste fiyatının yüzdesi** — sabit istek sayısı yok |
| pencere | **kişisel 7 gün**, ilk ücretsiz isteğinizle başlar (`x-th-free-resets`) |
| hesap hızı | 60 istek/dakika, 1.800 istek/saat |
| IP hızı | 100 istek/dakika, 3.000 istek/saat |
| eşzamanlılık | sınırlanmaz; hız aşımı `429` yanıtı verir |

Günlüğe kaydetmeye değer yanıt başlıkları: `x-th-plan`, `x-th-free-used-pct`, `x-th-free-resets`,
`x-th-upstream-model`, `x-th-route-decision`.

## Proxy'ler — isteğe bağlı

CLI varsayılan olarak **doğrudan** çalışır. `proxies.txt` dosyasına satır başına bir çıkış koyun (veya
`--pool` geçin) ve her istek — yedek tarayıcı dahil — bir proxy üzerinden çıkar:

```text
http://127.0.0.1:8080
socks5://user:pass@10.0.0.5:1080
```

İsteğe bağlı — ölçekte önerilir: panel ağ başına kayıtları sınırlar, bu yüzden hesap başına bir yeni çıkış
daha büyük bir çalıştırmayı sağlıklı tutar.

## Yerel bir yönlendirici bağlayın

Her iki bağlayıcı da idempotenttir ve `keys.txt` dosyasını okur:

```bash
node src/connect-9router.js    --base http://localhost:8080 --password 123456
node src/connect-omniroute.js  --base http://localhost:20128 --password 123456
```

Her biri, `https://tokenharbor.ai/v1` taban URL'si ve anahtar başına bir bağlantı ile bir
`openai-compatible` sağlayıcı düğümü (`tokenharbor`) oluşturur, böylece yönlendirici
anahtarlarınız arasında yük dengelemesi yapar. Başlatıcı menüsü aynı iki eylemi sunar.

## Notlar

- Her hesap, oluşturulduğu e-posta adresine aittir — daha sonra tekrar giriş yapmak isterseniz
  `accounts.jsonl` dosyasını saklayın.
- Ücretsiz katman, ücretsiz rota trafiğini
  `src/consent-text.txt` içinde açıklanan onay kapsamında saklar; ücretli rotalar eğitim için kullanılmaz.
- Onay metni panel tarafından sürümlenir. Değişirse, CLI bunu söyler ve kontrol panelinde
  **Enable free models** düğmesine bastıktan sonra bir kez yeniden çalıştırırsınız.
- Node.js 18+ gereklidir. `puppeteer-core` yalnızca panel insan
  doğrulaması istediğinde kullanılır; CLI'nin kendisi yalnızca standart kütüphaneyi kullanır.

## Lisans

MIT — bkz. [LICENSE](LICENSE).