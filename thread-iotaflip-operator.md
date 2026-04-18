# Thread: IOTA Flip — operator identity

## Goal

Identify the humans / team behind the IOTA Flip gambling product
(coin flip, roulette, raffle on IOTA Rebased).

Product is already verified (see `handoff.md` §"IOTA Flip / Roulette
→ IOTA Flip [x] VERIFIED"): `iotaflip.netlify.app` exists, Move
module struct names embed `IotaFlipHouse` / `IotaFlipRouletteHouse`,
5 packages at deployer
`0xbe95685023788ea57c6633564eab3fb919847ecd1234448e38e8951fbd4b6654`.

What was unknown going in: the operator identity (team / company /
handle / contact email). Goal of this thread was to close that gap
or document it honestly.

## Pages / sources checked

**Front-end:**
- `https://iotaflip.netlify.app/` — HTML + all 10 SvelteKit bundle
  chunks downloaded and grepped.
- `https://iotaflip.netlify.app/{about, terms, privacy, contact,
  faq, roulette, raffle}` — all 404.
- `https://iotaflip.netlify.app/{robots.txt, sitemap.xml,
  humans.txt, .well-known/security.txt, LICENSE, README.md,
  readme.txt}` — all 404 (SvelteKit catch-all).

**Alt domains:**
- DNS-probed `iotaflip.{com, io, xyz, app, gg, net, org, fun,
  finance, games}` — only **`iotaflip.com`** resolves.
- `iotaflip.com` → Apache/2.4.56 on `213.249.67.10` (rDNS
  `mijndomeinhosting.nl`, Dutch budget shared hosting); HTTP 80
  issues a `302 Location: https://iotaflip.netlify.app/`. Port 443
  on that IP is firewalled (no HTTPS cert of its own) → the .com is
  a pure redirect shim to the Netlify front-end.
- Subdomain wildcard: `{www, api, app, dev, roulette, raffle,
  admin, mail, blog, docs, staging, test}.iotaflip.com` all resolve
  to the same IP and all 302 to the Netlify root — wildcard A
  record, **no per-subdomain content** (no separate `api.` backend,
  no admin panel, no staging, no marketing blog).

**Registration (RDAP, both Verisign + Metaregistrar):**
- Domain registered **2024-11-18**, expires 2026-11-18.
- Registrar: **Metaregistrar BV** (NL, IANA 2288).
- Reseller: **Mijndomein Hosting BV** (NL).
- Registrant contact: redacted, routed through
  `privacydomain.net/contact_domain/` (whois privacy proxy).
- Only non-redacted locale hint: **registrant country `cc: NL`**
  (Netherlands).

**TLS certificate transparency (crt.sh):** `None found` for
`iotaflip` — no certs anywhere naming the brand outside the
Netlify default, consistent with the only live HTTPS endpoint being
`*.netlify.app`.

**Social / search:**
- WebSearch for `"iotaflip.netlify.app" operator`, `"IOTA Flip"
  gambling operator`, `site:twitter.com "iotaflip"`, `"iotaflip"
  reddit`, `"iotaflip" IOTA Rebased launch May 2025`,
  `"0xbe95685023788ea5..."`, `"IotaFlipHouse" OR
  "IotaFlipRouletteHouse" github` — **zero hits** that name a
  team, handle, blog post, or announcement.
- No mention of the product on `iota-ecosystem.org` (the site was
  unreachable during the search), on the IOTA blog, in IOTA Q2
  2025 progress report excerpts, or in any Reddit/X thread the
  search surfaced.
- IOTA-ecosystem-adjacent GitHub orgs (`iotaledger`,
  `iota-community`, `iotahouse`) — no `iota_flip` / `roulette` /
  raffle Move source code published.

## What I found

### Front-end is fully identity-stripped

- `<title>IOTA Flip</title>`, no `meta` tags for author /
  description / og:* / theme-color / robots.
- No footer. No About/Contact/Terms/Privacy page. The entire UI is
  a single SvelteKit screen with "Connect wallet", "COINFLIP",
  "HEADS", "TAILS", "IOTA", "CONNECT YOUR WALLET TO BEGIN.",
  "Max bet: 1.000 IOTA. Powered by Move on IOTA Rebased." — full
  inventory of user-visible text.
- Only non-IOTA external link the bundle embeds is Google Fonts
  (`fonts.googleapis.com`, Karantina font) and the `createjs`
  animation library — no Twitter, Discord, Telegram, GitHub,
  mailto, LinkedIn, YouTube, support link, analytics, Plausible,
  Google Analytics, Sentry, anything.
- Only addresses in the JS bundle are on-chain:
  - `https://api.mainnet.iota.cafe` — IOTA Rebased RPC endpoint.
  - `0x0ead65461a4850d20dbb6c9c8be7536332b2f8b9e3ffef3c32268efe7e2ca89a`
    — one of the 5 known IOTA Flip packages (the current latest
    game-package upgrade we already catalog).
  - `0x8db630a32dd659eb5a3588c5dcd1f36f7cceb887ad7a82379348843931ce9339`
    — a second on-chain object, not part of the 5 packages. Most
    likely a shared-object / treasury / house-state reference the
    client reads bets against. Not an operator identifier.
- No text in the bundle matches "author", "copyright", "built by",
  "made by", "created by", "contact", "support", "admin",
  "info@", or any mailto.

### Alt domain `iotaflip.com`

- Exists, is the owner's. Same brand, same registration period as
  product launch.
- Registered **2024-11-18** — ~5½ months before IOTA Rebased
  mainnet went live (2025-05-05). Consistent with a solo / hobby
  dev who planned ahead for Rebased.
- Points at a **Dutch shared-hosting IP** (`mijndomeinhosting.nl`
  / Mijndomein Hosting BV). This strongly suggests the operator
  is NL-based and paying for €-level consumer hosting rather than
  running a cloud / company infra.
- No HTTPS cert of their own; the .com never terminates TLS,
  they just rely on Netlify's cert on the netlify.app subdomain.
  Classic hobbyist-budget pattern.
- Wildcard A record on all subdomains, but all redirect to the
  Netlify app → there is no separately-hosted admin, API, or
  staging service exposing an operator identity.

### Registrant privacy

- Registrant name / org / email / street / city / postal / phone
  all redacted (GDPR + Mijndomein's default privacy shield via
  `privacydomain.net`). Only field left unredacted is
  `country: NL`.
- To unmask the registrant, an ICANN RDDS Inaccuracy complaint
  (`https://icann.org/wicf`) or abuse request via
  `abuse@metaregistrar.com` would be required, and neither is
  appropriate for our attribution purposes.

### Zero public footprint

- **No X/Twitter handle.** No `@iotaflip`, no announcement
  tweets indexed. The known IOTA-adjacent accounts (`@iota`,
  `@iota_talk_`, `@iotatokennews`) have no posts referencing
  IOTA Flip that surfaced in search.
- **No Discord / Telegram.** Not linked from the front-end, not
  in search results, not mentioned in the IOTA Discord index
  (`github.com/iota-community/IOTA-Discord`).
- **No GitHub repo.** No `iotaflip` / `iota_flip` / `iota-flip`
  org or repo on GitHub. Move source for `iota_flip`, `roulette`,
  or `raffle` modules is not public anywhere indexed.
- **No press / blog coverage.** Not in IOTA blog, not on
  `iota-ecosystem.org` (site was down during check, but also
  nothing surfaces via search), not in any Reddit / crypto-news
  writeup. Product exists publicly but has zero publicity.
- **No audit.** MoveBit / QuillAudits / OtterSec public pages
  never mention IOTA Flip (contrast with Cyberperp and Virtue,
  which are both MoveBit-audited and fully attributable from
  that trail).

## Attribution status

**Product:** [x] verified (`handoff.md`).

**Operator identity:** 🟠 remains **anonymous**.

Strongest identifying facts recovered:

- Operator is **Netherlands-based** (registrant `cc: NL`, Dutch
  registrar + Dutch reseller + Dutch shared-hosting IP — all three
  pointing NL independently).
- Operator registered the brand domain on **2024-11-18**, ~5½
  months before Rebased mainnet — indicates planning ahead for
  the Move / Rebased launch rather than an impulse deploy.
- Operator runs on **consumer-grade shared hosting** (Mijndomein
  /Metaregistrar) and **Netlify free / hobby tier** — strong
  signal of a solo dev or very small team, not a funded studio
  or incorporated gambling operator.
- **Fully pseudonymous by design**: no About page, no footer, no
  social handles, no GitHub, no audit, no ToS, no contact email
  anywhere on the site, in the SvelteKit bundle, or in on-chain
  metadata. Nothing leaks a name or handle.

### Gap documentation

There is no publicly reachable signal that ties a real person,
pseudonym, company, or X/Discord handle to this product. Absent
one of the following, the operator stays anonymous:

1. The operator self-doxxes (adds a footer, announces on X, lists
   on `iota-ecosystem.org`, submits an IOTA grant application,
   etc.).
2. Someone on the IOTA Discord / Foundation names them publicly
   (worth asking in `#builders` or `#general` — "anyone know who
   runs iotaflip.netlify.app?").
3. An IOTA dApp directory or crypto-news outlet writes about it
   and interviews / credits the builder.
4. The deployer wallet
   (`0xbe95685023788ea57c6633564eab3fb919847ecd1234448e38e8951fbd4b6654`)
   sends funds to or from an identity-linked address (CEX deposit,
   named multisig, ENS-equivalent, a wallet that also published an
   attributable package) — would require on-chain flow analysis
   we haven't done here.
5. A formal abuse / ICANN RDDS Inaccuracy complaint forces
   Metaregistrar to reveal the registrant — not appropriate for
   us.

### Recommendation for the registry

Keep the attribution as documented in `handoff.md` — "IOTA Flip"
as the product/team name, brand-only, **"Anonymous operator (NL)"**
as the honest descriptor. The NL locality is the one new concrete
attribute worth adding to the team `description` or an
`anomalousDeployers`-style note; everything else stays as already
planned.

Low-priority to revisit unless the product either (a) grows
non-trivial volume and draws press coverage, or (b) the operator
eventually self-identifies (most obvious trigger: submitting an
entry to `iota-ecosystem.org` or posting an `@iotaflip`-style X
handle).
