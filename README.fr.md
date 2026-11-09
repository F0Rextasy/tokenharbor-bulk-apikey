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

**Créez en masse des comptes Token Harbor avec des clés API générées automatiquement — inférence compatible OpenAI (DeepSeek V4.1 Flash, DeepSeek V4 Flash, MiMo V2.5, MiMo V2.6 Flash) + connecteurs 9Router / OmniRoute.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-1%20(browser%20only)-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/free%20models-4-412991?style=for-the-badge)](https://tokenharbor.ai/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)

[🛠 Démarrage rapide](#-quick-start) · [🎁 Offre gratuite](#-free-tier--how-much-you-get) · [🤖 Modèles](#-models--all-4-of-them) · [🧪 Utiliser l'API](#-how-to-use-the-api) · [✅ Vérifié](#-verified-working--every-key-is-tested) · [🧭 Fonctionnement](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Options](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Problèmes](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Pourquoi cet outil existe

Token Harbor est un panneau Next.js (authentification Supabase) dont l'offre gratuite est **basée sur un pourcentage** : une
**fenêtre personnelle de 7 jours** démarre à votre première requête gratuite et consomme une part du
prix catalogue, et non un nombre fixe de requêtes. L'inscription se fait par e-mail + mot de passe avec un **widget
Cloudflare Turnstile** et une limite par réseau — un réseau signifie un compte — donc une exécution en masse est
en réalité « une sortie fraîche par compte ».

Deux barrières se dressent après l'inscription et toutes deux sont faciles à manquer : l'API répond
`403 email_verification_required` tant que le lien de l'e-mail d'inscription n'est pas ouvert, et chaque
route `:free` répond `403 free_models_disabled` tant que le consentement aux modèles gratuits n'est pas activé —
et ce point de terminaison de consentement **valide le texte affiché par le client** (`shown_text`), donc un simple
`{"free_models_enabled":true}` répond `400 reload_and_retry`. Cette CLI fait tout cela,
lit les identifiants d'action Next.js depuis la page en direct à chaque exécution, et n'écrit que les clés qui passent
un chat-200 en direct.

## 🎁 Offre gratuite — ce que vous obtenez

| Quoi | Valeur |
| --- | --- |
| Modèles gratuits | **4** — DeepSeek V4.1 Flash, DeepSeek V4 Flash, MiMo V2.5, MiMo V2.6 Flash (suffixe `:free`) |
| Allocation | **pourcentage du prix catalogue**, pas de nombre fixe de requêtes (mesuré : toujours `0%` après ~25 appels) |
| Fenêtre | **7 jours personnels**, démarre à votre première requête gratuite (en-tête `x-th-free-resets`) |
| Limite de débit du compte | **60 req/min**, **1 800 req/h** |
| Limite de débit par IP | **100 req/min**, **3 000 req/h** (au-delà, réponse `429`, ou HTTP `200` avec un corps `error`, et indique le temps d'attente) |
| Concurrence | non plafonnée |
| Modèles payants | 70+ (Claude, Grok, GLM, MiMo Pro …) — ils nécessitent des crédits ; un compte à solde nul répond `402` |
| Carte requise | **Non** |
| Téléphone requis | **Non** |
| Captcha | **Cloudflare Turnstile** à l'inscription — `src/solver.js` génère un vrai jeton dans un Chrome hors écran via la même sortie |
| Vérification e-mail | **requise** — la CLI ouvre le lien et suit le `307` vers `?verify=success` |
| L'unité qui s'adapte | **un compte = une clé** → `--count N` signifie en réalité « N comptes depuis N réseaux » |

En-têtes à surveiller : `x-th-plan`, `x-th-free-used-pct`, `x-th-free-resets`,
`x-th-upstream-model`, `x-th-route-decision`.

## 🤖 Modèles — les 4

| Identifiant du modèle | Remarques |
| --- | --- |
| `deepseek-v4.1-flash:free` | celui par défaut ; répond PONG en ~9-11 s |
| `deepseek-v4-flash:free` | modèle de repli que la CLI essaie aussi dans le test en direct |
| `mimo-v2.5:free` | famille MiMo |
| `mimo-v2.6-flash:free` | le plus rapide des quatre |

Le point de terminaison sert **78 identifiants de modèles** au total (`GET /v1/models` avec n'importe quelle clé valide) ; les quatre
ci-dessus sont ceux qui fonctionnent sans crédits. Les outils/appels de fonction fonctionnent sur les routes gratuites :
un schéma `get_time` revient sous forme de véritable tableau `tool_calls`.

## 🧪 Comment utiliser l'API

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

## 🚀 Une seule commande

```bash
npm start            # menu → "Mint keys" → combien → terminé
```

`npm start` ouvre le lanceur, **1) Mint keys** demande un nombre et rien d'autre, puis la CLI
crée un compte par clé, vérifie chacun avec un appel de chat en direct et écrit les survivants
dans `keys.txt`.

## 🛠 Démarrage rapide

```bash
git clone https://github.com/F0Rextasy/tokenharbor-bulk-apikey.git
cd tokenharbor-bulk-apikey
npm install
echo "YOUR_MAILTRAP_TOKEN" > mailtrap.txt   # REQUIS — voir l'avertissement ci-dessous
npm start            # menu → 1) Mint keys → combien → terminé
```

> **Sans `mailtrap.txt`, la génération ne peut pas fonctionner du tout.** Token Harbor refuse tous les domaines de
> boîte aux lettres publics, donc rien ne peut lire le lien de vérification et chaque compte resterait bloqué à
> `403 email_verification_required`. Il n'y a pas de solution de repli : obtenez d'abord un jeton gratuit.

**Le jeton Mailtrap est la seule étape de configuration.** Token Harbor
accepte un domaine de messagerie qui ressemble à un véritable hôte de courrier entrant et répond « complete the human
check » aux domaines jetables publics (pour ceux-ci, il ne rend même pas le widget), donc la CLI
a besoin d'une boîte aux lettres qu'elle peut lire. L'offre gratuite suffit : créez un compte sur
[mailtrap.io](https://mailtrap.io) → **Settings → API Tokens**, puis écrivez cette valeur dans
`mailtrap.txt` à côté de `package.json` (une ligne), ou exportez `MAILTRAP_TOKEN`. Le lanceur
vérifie sa présence et vous prévient s'il manque — il ne demande jamais la valeur elle-même.

Sans le jeton, la CLI essaie quand même d'abord les services de messagerie publics, et chaque compte s'arrête au
mur de vérification humaine du panneau — c'est pourquoi le fichier est requis, et non facultatif.

## ✅ Vérifié fonctionnel — chaque clé est testée

Une clé n'est écrite dans `keys.txt` qu'après, au moment de la génération :

- un `chat-200` en direct sur un modèle `:free`, et
- **deux invites différentes** répondant 200 avec un contenu non vide et **différent**.

Mesuré de bout en bout (`node src/cli.js --auto --count 1 --pool proxies.txt`) :

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

Revérifiez à tout moment avec `npm start` → **2) Verify keys** (`node src/cli.js --verify`) ; les clés mortes
passent dans `keys-dead.txt`, une clé dont le test en direct n'a pas pu aboutir (par ex. le réseau a atteint une
limite de débit) atterrit dans `keys-unverified.txt` afin que le compte ne soit jamais perdu.

## 🧭 Fonctionnement

1. **Boîte aux lettres** — une boîte de réception fraîche par compte sur votre compte Mailtrap (`mailtrap.txt`) ; mail.tm / mail.gw publics
   sont les services de repli.
2. **Inscription** — les identifiants d'action serveur Next.js (`next-action`, `$ACTION_KEY`,
   `x-deployment-id`) sont lus depuis la page en direct à chaque exécution, donc un redéploiement du panneau ne casse pas
   la CLI ; l'empreinte de l'appareil et le fuseau horaire accompagnent la requête, et le fuseau horaire est
   mesuré depuis la sortie, pas depuis votre machine.
3. **Vérification humaine** — lorsque le panneau rend le widget, l'inscription est rejouée dans un vrai Chrome
   (`src/solver.js`, `puppeteer-core` + le Chrome déjà installé ; `--enable-automation` est
   supprimé volontairement), la case est cochée à la souris, et les cookies de session de ce navigateur sont
   renvoyés à la CLI.
4. **Vérification e-mail** — le lien de la boîte aux lettres est ouvert ; le jeton est consommé
   côté serveur et répond `307 → /dashboard?verify=success`.
5. **Consentement aux modèles gratuits** — `POST /api/me/privacy` avec le texte de consentement affiché par le tableau de bord
   (`src/consent-text.txt`), `screen: "consent_modal"`, `path: "/dashboard"`.
6. **Clé + test en direct** — `POST /api/keys`, puis deux invites différentes doivent toutes deux répondre 200 avec
   un contenu différent avant que la clé ne soit écrite.

## ⚙️ Options de la CLI

```bash
node src/cli.js --auto --count 5             # cinq comptes → cinq clés
node src/cli.js --auto --count 5 --pool proxies.txt
node src/cli.js --verify                     # vérifie en direct keys.txt, les mortes → keys-dead.txt
node src/cli.js --screen --pool proxies.txt  # quelles sorties atteignent le panneau
node src/cli.js --models                     # la liste des modèles gratuits (nécessite une clé)
node src/cli.js --help
```

| option | signification |
| --- | --- |
| `--count <n>` | comptes (et clés) à créer, 1 par défaut |
| `--pool <file>` | liste de proxys, une sortie par ligne (`http://host:port`, `socks5://user:pass@host:port`, `host:port`) ; les commentaires `#` en ligne sont acceptés |
| `--headless` | exécute le navigateur de repli en mode headless (par défaut : fenêtre hors écran, ce qu'attend le captcha) |
| `--screen` | teste le pool contre le panneau et affiche vivant/mort par sortie |
| `--verify` | vérifie en direct `keys.txt` ; les clés mortes sont écrites dans `keys-dead.txt` |
| `--models` | affiche les identifiants des modèles gratuits |
| `--strict-proxy` | n'envoie jamais de requête directe : le test en direct doit aussi passer par le pool (la variable d'env `TOKENHARBOR_STRICT=1` fait de même) |

Une sortie défaillante ne coûte jamais un compte : l'inscription et le test en direct réessaient tous deux sur d'autres lignes du pool,
et une limite de débit (un `429`, ou un `200` dont le corps contient `rate_limit_exceeded`) attend le temps indiqué par le panneau.

## 🛰️ Derrière un proxy

La CLI s'exécute **en direct** par défaut. Placez une sortie par ligne dans `proxies.txt` (le lanceur la
prend automatiquement) ou passez `--pool` :

```text
http://127.0.0.1:8080
socks5://user:pass@10.0.0.5:1080
10.0.0.5:8080
```

Facultatif — recommandé à grande échelle : le panneau limite les inscriptions **par réseau**, donc une sortie fraîche
par compte maintient une exécution plus importante en bonne santé. Le courrier est lu directement depuis votre compte Mailtrap (un
fournisseur de messagerie n'est pas le panneau), donc une sortie lente ne peut pas casser l'étape de la boîte aux lettres.

## 📄 Fichiers

| Chemin | Quoi |
| --- | --- |
| `keys.txt` | clés vérifiées, une par ligne (écrites uniquement après le test en direct) |
| `keys-dead.txt` | clés qui ont cessé de répondre (depuis `--verify`) |
| `keys-unverified.txt` | clés dont le test en direct n'a pas pu aboutir — le compte existe, la clé est réelle |
| `accounts.jsonl` | une ligne par compte : e-mail + résultats des étapes |
| `mailtrap.txt` | votre jeton API Mailtrap (une ligne) |
| `proxies.txt` | liste de proxys facultative |
| `src/cli.js` | la CLI de génération / vérification / test |
| `src/launcher.js` | le menu (`npm start`) |
| `src/solver.js` | la partie navigateur pour le widget Turnstile |
| `src/consent-text.txt` | le texte de consentement validé par le panneau |
| `src/connect-9router.js`, `src/connect-omniroute.js` | connecteurs de routeur |

## 🔌 Connexion à 9Router

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
```

Enregistre un nœud fournisseur `openai-compatible` (`tokenharbor`, URL de base
`https://tokenharbor.ai/v1`) et une connexion par clé dans `keys.txt`, afin que 9Router équilibre la charge
entre vos clés. Idempotent : un nœud ou une connexion existant est réutilisé, et la numérotation continue
à partir du plus haut `tokenharbor-0NN` déjà présent.

## 🔌 Connexion à OmniRoute

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
```

Même forme pour OmniRoute (nœud fournisseur + une connexion par clé). Le lanceur expose les deux comme
éléments de menu **6** et **7**, et `npm run 9router` / `npm run omniroute` font de même.

## 🔑 Ce qu'une clé vous donne

- les quatre modèles `:free` ci-dessus, à 60 req/min et 1 800 req/h par compte (100 req/min par IP) ;
- une allocation basée sur un pourcentage dans une fenêtre personnelle de 7 jours (`x-th-free-resets` vous indique quand
  elle se réinitialise) ;
- `/v1/chat/completions` compatible OpenAI avec appels d'outils, donc n'importe quel SDK, CLI ou routeur OpenAI
  fonctionne en changeant `base_url` en `https://tokenharbor.ai/v1` ;
- les modèles payants restent verrouillés tant que le compte n'a pas de crédits (`402` sinon).

## 🐞 Problèmes

Ouvrez un ticket avec la commande, l'étape qui a échoué (la CLI affiche `precheck / signup /
verify / consent / key / chat`) et le message du panneau lui-même. Ne collez jamais une clé API complète — les
quatre derniers caractères suffisent.

## 📄 Licence

MIT — voir [LICENSE](LICENSE). L'outil n'est pas affilié à Token Harbor ; utilisez-le pour des comptes
qui vous appartiennent et respectez les conditions du panneau.