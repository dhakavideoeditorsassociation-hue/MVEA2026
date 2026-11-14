# Media Video Editors Association (MVEA)

গণমাধ্যম ভিডিও এডিটরস অ্যাসোসিয়েশন — the national platform for media video editors and
visualizers in Bangladesh: television, national dailies and digital newsrooms.

Three surfaces in one Next.js application:

1. **Public site** — editorial hero, six profession pillars, 31-member Convener Committee,
   members directory and CV profiles, real newspaper coverage, Facebook press releases,
   articles & features, ethics code.
2. **Member portal** — Firebase-authenticated membership application, CV upload, showreel,
   application status tracking.
3. **Admin dashboard** — application review with MVEA membership IDs, committee order,
   newspaper link importer, **Facebook press-release importer with manual override**,
   recruiter inquiries, hero-slider visibility and the articles CMS.

Designed for free tiers only: Vercel (hosting), GitHub (source), Firebase Spark
(auth + Firestore) and Cloudinary (unsigned uploads).

---

## Data in this build

The seed dataset is official association data, not placeholder copy:

- **31-member Convener Committee**, formed 13 March 2026 — convener, seven joint conveners,
  member secretary and 22 members, each with their media house.
- **Three real national press reports**, fetched live and linked to the publishers:
  Daily Samakal (`samakal.com/bangladesh/article/342736`), Banglanews24
  (`banglanews24.com/national/news/bd/1642621.details`) and Daily Jugantor
  (`jugantor.com/capital/1054033`). Titles, excerpts, thumbnails and publish dates were read
  from each article's OpenGraph metadata.
- **Facebook press releases** pointing at
  `facebook.com/MediaVideoEditorsAssociation`.
- **Four editorial articles** (feature, guide, workshop, ethics) written for the craft.
- Contact: `dhakavideoeditorsassociation@gmail.com`, `+8801957-452277`, `+8801763-234375`,
  Dhaka, Bangladesh.

Career histories, showreels and skill lists are **not invented**. Individual members have no
portrait on file yet, so profiles render initials and display a "career details are being
verified" notice until the editor completes their dashboard profile.

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 14 (App Router) + React 18 + TypeScript (strict) |
| Styling | Tailwind CSS 3, hand-built shadcn-style primitives (cva + tailwind-merge) |
| Motion | Framer Motion (hero backdrop rotation, reduced-motion aware) |
| Icons | Lucide React |
| Fonts | `next/font/google` — Hind Siliguri (Bangla) + Inter (Latin) |
| Backend | Firebase 10 (Auth, Firestore) — optional at runtime |
| Uploads | Cloudinary unsigned preset — optional at runtime |
| Link previews | `/api/fetch-og` and `/api/link-preview` (cheerio, SSRF guarded) |

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

No environment variables are required. The app starts in **demo mode**: seed content,
browser-local accounts, browser-local admin edits. Copy `.env.example` to `.env.local` when
you want real services.

```bash
npm run build        # production build (prerenders 31 member + 31 CV + 4 article pages)
npm run start
npm run typecheck    # tsc --noEmit
npm run lint
```

### Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@mvea.org` | `Mvea@2026` |
| Member | `editor@mvea.org` | `Mvea@2026` |

The login screen has one-click buttons for both.

**Demo mode behaviour:** accounts, applications, admin edits and imports live in this
browser's `localStorage`. Nothing is shared, and every affected screen shows a banner saying
so. Set the Firebase variables and the same UI persists to Firestore instead.

---

## Routes

| Route | Description |
| --- | --- |
| `/` | Editorial hero + rotating programme backdrop, six pillars, featured committee members, press grid, Facebook press releases, articles, committee strip, join CTA |
| `/members` | Directory of the 31 committee members with search and media-house / skill / experience filters |
| `/members/[slug]` | Profile: role, media house, factual bio, showreel, timeline, skills, recruiter actions, CV download |
| `/members/[slug]/cv` | Print-first CV with the association emblem; `?print=1` opens the print dialog |
| `/programs` | Articles & features with category tabs (feature, interview, guide, workshop, ethics) |
| `/programs/[slug]` | Article detail with related items |
| `/media-coverage` | Real press coverage + Facebook press releases (`#press-releases`) |
| `/about` | Mission, six-point ethics code, member benefits, FAQ |
| `/committee` | Convener panel and the 22 members |
| `/login`, `/register` | Email/password + Google (Google needs Firebase) |
| `/dashboard` | Membership form, draft save, submit, status and MVEA membership ID |
| `/admin` | Role-guarded control room: applications, committee order, media coverage, press releases, inquiries, hero, articles |
| `/api/fetch-og` | `POST { url }` → OpenGraph preview for newspaper links |
| `/api/link-preview` | Same extractor tuned for Facebook posts: returns `code: "blocked"` when Facebook walls the request so the admin can override manually |
| `/api/recruiter-inquiries` | Validated hiring inquiry |

Bangla / English and dark / light are toggled from the header; the preference is per browser.

---

## Logo and favicon

The official emblem (`MVEA Red LOGO.png`, 1250x1250, transparent background) is installed as:

| Asset | Path | Used by |
| --- | --- | --- |
| Emblem | `public/logo.png` | navbar, footer, login/register, CV header, press-release fallback, OG metadata |
| Favicon | `public/favicon.ico` and `src/app/favicon.ico` | multi-size ICO (16/32/48/64/128/256) generated from the PNG |
| App icon | `src/app/icon.png` | Next.js icon route and Apple touch icon |

The path is read from a single constant, `LOGO_SRC` in `src/lib/brand.ts`. Because the artwork
has a transparent background, it is placed on a white circular chip with a thin border so the
red ring and black film strip stay legible in both the dark and light themes, and the ribbon
tips are never clipped. Replacing the artwork later means overwriting `public/logo.png` (and
regenerating the ICO) — no component changes are needed.

---

## Press releases (Facebook)

`/api/link-preview` accepts `facebook.com` post/photo/reel/share URLs (normalising
`m.`/`web.`/`mbasic.` hosts), fetches the page server-side and extracts `og:title`,
`og:description`, `og:image` and publish time.

Facebook normally answers server requests with HTTP 400/403/429 or a login wall. The route
detects this and returns:

```json
{ "ok": false, "status": 422, "code": "blocked",
  "error": "Facebook returned HTTP 400.", "hint": "Use the manual fields in the admin form." }
```

The admin **Press releases** tab then keeps the same form open so the secretariat can type the
headline/excerpt and upload the thumbnail (Cloudinary in production, object URL in demo mode)
before publishing to the `press_releases` collection. Cards show the thumbnail, an
"Official statement on Facebook" badge, and link to the statement in a new tab; without an
image the emblem is used.

---

## Firebase setup (free Spark plan)

1. Create a project at <https://console.firebase.google.com>.
2. **Add app → Web**, copy the config into `.env.local` (`NEXT_PUBLIC_FIREBASE_*`).
3. **Authentication → Sign-in method**: enable Email/Password and Google; add your Vercel
   domain to authorised domains.
4. **Firestore → Create database** (production mode).
5. Deploy the rules in this repository:

   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init firestore      # existing project, keep firestore.rules
   firebase deploy --only firestore:rules
   ```

   `storage.rules` is included if you prefer Firebase Storage over Cloudinary.
6. **First admin**: register on `/register`, then set `users/{uid}.role = "admin"` in Firestore.

Collections: `users`, `applications`, `members`, `hero_slides`, `press_articles`,
`press_releases`, `cms_posts`, `committee`, `association`, `recruiter_inquiries`.

Rules enforce that members can only edit their own application/profile, can never set
`membershipId` or `rankOrder`, and cannot promote themselves; only admins publish members,
press, releases, posts or read inquiries.

### Cloudinary setup

*Settings → Upload → Add upload preset*: signing mode **Unsigned**, folder `gvea`, allow
`auto`. Then set `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and
`NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`. Without it, uploads fall back to session-only object
URLs and the form says so.

---

## Deploy to Vercel via GitHub

```bash
git init && git add . && git commit -m "feat: MVEA platform"
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Import the repository at <https://vercel.com/new>, add the same environment variables, deploy.
Add the production domain to Firebase Auth authorised domains.

---

## Project structure

```text
src/
  app/
    api/{fetch-og,link-preview,recruiter-inquiries}/route.ts
    about/ admin/ committee/ dashboard/ login/ register/
    members/ members/[slug]/ members/[slug]/cv/
    programs/ programs/[slug]/ media-coverage/
    icon.svg layout.tsx globals.css page.tsx not-found.tsx error.tsx loading.tsx
  components/
    admin/ auth/ common/ committee/ dashboard/ home/ layout/ members/ press/ programs/ ui/
  data/seed.ts                    # official committee, press, releases, articles, hero slides
  lib/
    auth/auth-provider.tsx        # Firebase + demo auth behind one context
    brand.ts                      # LOGO_SRC and the Facebook page URL
    data/{repository,seed-repository,index}.ts
    i18n/{dictionaries,provider}.tsx
    server/link-preview.ts        # shared OpenGraph extractor + SSRF guard
    store/admin-store.ts          # Firestore or browser-local persistence
    categories.ts firebase.ts format.ts media.ts types.ts upload.ts utils.ts
public/logo.svg  firestore.rules  storage.rules  .env.example
```

### Design notes

- **Typed bilingual dictionary.** A missing Bangla string fails `tsc`; content records carry
  `{ bn, en }` fields.
- **Repository seam.** Pages only call `repo`, so a Firestore repository can replace the seed
  one without touching pages.
- **Initials avatars.** No portraits are invented: `Avatar` renders initials until a member
  uploads a photo.
- **CV without binaries.** "Download official CV" opens the print-optimised page; the browser
  produces the PDF. An uploaded PDF takes priority when present.
- **SSRF guard.** Both preview routes reject non-http(s) schemes, credentials in URLs,
  non-standard ports, private/loopback/link-local/CGNAT hosts, and re-check the final URL
  after redirects; responses are capped at 1.5 MB with a 9 s timeout.

---

## Known limitations

- Demo-mode approvals and edits do not rewrite the seeded public pages (no server database
  yet). Configure Firebase and the same actions persist for everyone.
- Individual member photos, showreels and career histories are pending — the committee has not
  supplied them, and they are deliberately not fabricated.
- Two early vector drafts remain in `public/` (`logo.svg`, `logo-emblem.svg`) and are no longer
  referenced; they can be deleted.
- Unknown `/members/<slug>` and `/programs/<slug>` values render the branded not-found page,
  but Next caches that render so the status stays 200 (soft 404); genuinely missing top-level
  routes return 404.
- Facebook scraping is best-effort by design; the manual override in the admin form is the
  supported path when Meta blocks the request.
- No automated test suite; verification is `npm run build`, `npm run typecheck`,
  `npm run lint` and route smoke checks.

## License

© Media Video Editors Association / গণমাধ্যম ভিডিও এডিটরস অ্যাসোসিয়েশন.
