<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

# Token Harbor — clés API en masse

Créez des comptes et des clés API Token Harbor (tokenharbor.ai) depuis votre terminal.
Token Harbor expose un point de terminaison **compatible OpenAI** avec un niveau gratuit
permanent, donc une clé fonctionne dans n'importe quel SDK OpenAI, CLI ou routeur local.

```bash
git clone https://github.com/F0Rextasy/tokenharbor-bulk-apikey.git
cd tokenharbor-bulk-apikey
npm install
echo "YOUR_MAILTRAP_TOKEN" > mailtrap.txt   # free Mailtrap API token, one line (see Setup)
npm start            # menu → "Mint keys" → how many → done
```

`npm start` ouvre un menu ; choisissez **1) Mint keys**, saisissez un nombre, et le CLI crée un
compte par clé, vérifie chacun avec un **appel de chat en direct**, et écrit les survivants dans
`keys.txt`. Après le jeton Mailtrap à usage unique ci-dessous, rien d'autre n'est demandé : pas de jetons captcha, pas de proxy, pas d'invites.

## Configuration (une minute)

Token Harbor accepte un domaine de messagerie qui ressemble à un véritable hôte de courrier entrant et refuse
les domaines jetables publics, donc le CLI a besoin d'une boîte aux lettres qu'il peut lire :

1. Créez un compte gratuit sur [mailtrap.io](https://mailtrap.io) → **Settings → API Tokens**.
2. Placez le jeton dans  à côté de  (une ligne), ou exportez .

C'est la seule étape de configuration. Tout le reste — la boîte de réception par compte, le lien de vérification,
le consentement aux modèles gratuits, la clé — est automatique.

## Ce que vous obtenez

| champ | valeur |
|---|---|
| Base de l'API | `https://tokenharbor.ai/v1` |
| Authentification | `Authorization: Bearer YOUR_KEY` |
| Modèles gratuits | `deepseek-v4.1-flash:free` · `deepseek-v4-flash:free` · `mimo-v2.5:free` · `mimo-v2.6-flash:free` |
| Modèles payants | 70+ (Claude, Grok, GLM, MiMo Pro …) — ils nécessitent des crédits sur le compte |
| Format de clé | `thk_live_` + 63 caractères |
| Carte / téléphone | non requis pour le niveau gratuit |

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

| option | signification |
|---|---|
| `--count <n>` | comptes (et clés) à créer, par défaut 1 |
| `--pool <file>` | liste de proxies, une sortie par ligne (`http://host:port`, `socks5://user:pass@host:port`, `host:port`) |
| `--headless` | exécuter le navigateur de secours en mode headless (par défaut : fenêtre hors écran, ce que le captcha attend) |
| `--verify` | vérifier en direct `keys.txt` et afficher live/dead par clé |

Sortie : `keys.txt` (une clé par ligne, uniquement les clés qui ont réussi), `accounts.jsonl` (une ligne
par compte avec les résultats des étapes, aucun secret au-delà de l'e-mail du compte qui vous appartient).

## Comment fonctionne la création

1. **Boîte aux lettres** — avec un jeton Mailtrap (niveau gratuit, une ligne dans `mailtrap.txt`) le CLI ouvre une
   boîte de réception fraîche par compte sur votre propre compte Mailtrap ; sans lui, il se rabat sur les
   services publics mail.tm / mail.gw.
2. **Inscription** — les identifiants d'action du serveur Next.js sont lus depuis la page en direct à chaque exécution, donc
   un redéploiement du panneau ne casse pas le CLI. L'empreinte de l'appareil et le fuseau horaire voyagent
   avec la requête ; le fuseau horaire est mesuré depuis votre sortie, pas depuis votre machine.
3. **Vérification humaine** — un domaine de messagerie jetable fait répondre au panneau « complete the human check »
   (et il n'affiche même pas le widget là-bas), donc un véritable hôte de courrier entrant est le rail qui
   fonctionne. Lorsqu'un widget *est* affiché, l'inscription est
   rejouée dans un vrai Chrome (`src/solver.js`, `puppeteer-core` + le Chrome déjà présent sur votre
   machine) : le formulaire est saisi avec de vraies frappes, la case Turnstile est cliquée avec la
   souris, et les cookies de session sont renvoyés au CLI.
4. **Vérification par e-mail** — le lien de la boîte aux lettres est ouvert (le jeton est consommé
   côté serveur et répond par un `307` vers `?verify=success`).
5. **Consentement aux modèles gratuits** — l'interrupteur de partage de données est activé avec le texte de consentement que
   le tableau de bord affiche (`src/consent-text.txt`). Sans lui, chaque appel `:free` répond
   `403 free_models_disabled`.
6. **Clé** — `POST /api/keys`, puis un **contrôle en direct** : deux invites différentes doivent toutes deux répondre
   `200` avec un texte non vide et différent. Une clé qui échoue au contrôle n'est jamais écrite.

## Contrôles de qualité

Chaque clé dans `keys.txt` a réussi, au moment de la création :

- un `chat-200` en direct sur un modèle `:free`, et
- **deux invites différentes** répondant 200 avec un contenu non vide et **différent**.

Une clé qui ne peut pas utiliser d'outils, une clé morte ou un fournisseur mort n'est jamais écrit dans la sortie
de ce dépôt ni câblé dans un combo. Revérifiez à tout moment avec `node src/cli.js --verify`.

## Limites (niveau gratuit)

| limite | valeur |
|---|---|
| allocation | **pourcentage du prix catalogue** — pas de nombre fixe de requêtes |
| fenêtre | **7 jours personnels**, commence à votre première requête gratuite (`x-th-free-resets`) |
| débit par compte | 60 requêtes/min, 1 800 requêtes/heure |
| débit par IP | 100 requêtes/min, 3 000 requêtes/heure |
| concurrence | non plafonnée ; au-delà du débit, réponse `429` |

En-têtes de réponse à journaliser : `x-th-plan`, `x-th-free-used-pct`, `x-th-free-resets`,
`x-th-upstream-model`, `x-th-route-decision`.

## Proxies — facultatif

Le CLI fonctionne **directement** par défaut. Placez une sortie par ligne dans `proxies.txt` (ou passez
`--pool`) et chaque requête — y compris le navigateur de secours — sort via un proxy :

```text
http://127.0.0.1:8080
socks5://user:pass@10.0.0.5:1080
```

Facultatif — recommandé à grande échelle : le panneau limite les inscriptions par réseau, donc une sortie fraîche
par compte maintient une exécution plus importante en bonne santé.

## Connecter un routeur local

Les deux connecteurs sont idempotents et lisent `keys.txt` :

```bash
node src/connect-9router.js    --base http://localhost:8080 --password 123456
node src/connect-omniroute.js  --base http://localhost:20128 --password 123456
```

Chacun crée un nœud de fournisseur `openai-compatible` (`tokenharbor`) avec l'URL de base
`https://tokenharbor.ai/v1` et une connexion par clé, de sorte que le routeur répartit la charge entre
vos clés. Le menu du lanceur expose les deux mêmes actions.

## Remarques

- Chaque compte appartient à l'adresse e-mail avec laquelle il a été créé — conservez `accounts.jsonl`
  si vous voulez vous reconnecter plus tard.
- Le niveau gratuit stocke le trafic de la route gratuite sous le consentement décrit dans
  `src/consent-text.txt` ; les routes payantes ne sont pas utilisées pour l'entraînement.
- Le texte de consentement est versionné par le panneau. S'il change, le CLI le signale et vous relancez
  une fois après avoir appuyé sur **Enable free models** dans le tableau de bord.
- Node.js 18+ est requis. `puppeteer-core` n'est utilisé que lorsque le panneau demande la vérification
  humaine ; le CLI lui-même n'utilise que la bibliothèque standard.

## Licence

MIT — voir [LICENSE](LICENSE).