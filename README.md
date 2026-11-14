# Gonomadhyam Video Editor Association

গণমাধ্যম ভিডিও এডিটরস অ্যাসোসিয়েশন — the official web platform of the association of
television, broadcast and multimedia video editors of Bangladesh.

A production-shaped Next.js application with three surfaces:

1. **Public site** — ranked member directory, Behance-style CV profiles, workshops and
   resources, press coverage, ethics code, executive committee.
2. **Member portal** — Firebase-authenticated membership application, CV upload, showreel,
   application status tracking.
3. **Admin dashboard** — application review with membership-ID generation, ranking engine,
   press importer that scrapes OpenGraph data from any newspaper URL, hero-slider visibility,
   recruiter inquiries and a light CMS.

Everything is designed to run on **free tiers only**: Vercel (hosting), GitHub (source),
Firebase Spark (auth + Firestore) and Cloudinary (unsigned uploads).

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 14 (App Router) + React 18 + TypeScript (strict) |
| Styling | Tailwind CSS 3, hand-built shadcn-style primitives (cva + tailwind-merge) |
| Motion | Framer Motion (hero carousel, subtle page motion, reduced-motion aware) |
| Icons | Lucide React |
| Fonts | `next/font/google` — Hind Siliguri (Bangla) + Inter (Latin) |
| Backend | Firebase 10 (Auth, Firestore) — optional at runtime |
| Uploads | Cloudinary unsigned preset — optional at runtime |
| Metadata | `/api/fetch-og` route (cheerio) with SSRF guard |

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

No environment variables are required. The app starts in **demo mode**: seed content,
browser-local accounts, browser-local admin edits. Copy `.env.example` to `.env.local`
when you want the real services.

```bash
npm run build        # production build (prerenders every public route)
npm run start        # serve the production build
npm run typecheck    # tsc --noEmit
npm run lint         # next lint
```

### Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@gvea.org` | `Gvea@2026` |
| Member | `editor@gvea.org` | `Gvea@2026` |

The login screen has one-click buttons that fill these credentials.

**Demo mode behaviour**

- Accounts, applications, admin edits, shortlists and press imports live in `localStorage`
  of the current browser. They are not shared and are not visible to other visitors.
- Approved members come from `src/data/seed.ts`; approving an application in the demo
  dashboard assigns a membership ID but does not rewrite the seeded public directory.
- Every demo surface shows a banner saying so, so nothing is presented as durable data.
- Set the Firebase variables and the same UI talks to Firestore instead — no page code changes.

---

## Routes

| Route | Description |
| --- | --- |
| `/` | Hero carousel, six pillars, featured ranked members, press grid, latest programs, committee strip |
| `/members` | Searchable directory, ordered by committee rank, filters by media house / skill / experience |
| `/members/[slug]` | Digital CV: bio, career timeline, skills, tools, embedded showreel, recruiter actions |
| `/members/[slug]/cv` | Print-first CV (browser print → PDF); `?print=1` opens the dialog automatically |
| `/programs` | Workshops, market updates, software notes, ethics and storytelling resources with category tabs |
| `/programs/[slug]` | Resource detail with related items |
| `/media-coverage` | Press grid, every card opens the original publisher in a new tab |
| `/about` | Mission, six-point ethics code, member benefits, FAQ |
| `/committee` | Executive committee grid |
| `/login`, `/register` | Email/password auth, Google sign-in when Firebase is configured |
| `/dashboard` | Membership application form, status, membership ID, draft saving |
| `/admin` | Role-guarded control room (applications, ranking, press, inquiries, hero, programs) |
| `/api/fetch-og` | `POST { url }` → OpenGraph title, description, image, site name, publish date |
| `/api/recruiter-inquiries` | `POST` validated hiring inquiry (Firestore-ready payload) |

Both languages (বাংলা / English) and both themes (broadcast dark / editorial light) are
toggled from the header; the preference is stored per browser.

---

## Firebase setup (free Spark plan)

1. Create a project at <https://console.firebase.google.com> (Google Analytics not required).
2. **Add app → Web**, then copy the config values into `.env.local`
   (`NEXT_PUBLIC_FIREBASE_*`).
3. **Authentication → Sign-in method**: enable *Email/Password* and *Google*.
   Add your Vercel domain under *Authorized domains*.
4. **Firestore Database → Create database** (production mode, nearest region).
5. Deploy the rules in this repository:

   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init firestore   # choose the existing project, keep firestore.rules
   firebase deploy --only firestore:rules
   ```

   `storage.rules` is included if you prefer Firebase Storage over Cloudinary
   (`firebase deploy --only storage`).
6. **Create the first admin**: register through `/register`, then open
   *Firestore → users → your uid* and add `role: "admin"` to the document.
   Reload the site — the admin link appears in the header and `/admin` becomes accessible.

Collections used: `users`, `applications`, `members`, `hero_slides`, `press_articles`,
`cms_posts`, `committee`, `association`, `recruiter_inquiries`.

### Roles

`users/{uid}.role` is `member` or `admin`. Rules enforce that a member can only edit their
own profile and application, can never set `membershipId` or `rankOrder`, and cannot promote
themselves; only admins can publish members, hero slides, press links, posts or read inquiries.

---

## Cloudinary setup (free tier)

1. Create an account, note the **cloud name**.
2. *Settings → Upload → Add upload preset*: signing mode **Unsigned**,
   folder `gvea`, and allow `auto` format so PDFs are accepted.
3. Add to `.env.local`:

   ```bash
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=gvea_unsigned
   ```

Without Cloudinary, uploads fall back to browser object URLs (session-only) and the form
states this explicitly.

---

## Deploy to Vercel via GitHub

```bash
git init
git add .
git commit -m "feat: GVEA platform"
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

1. <https://vercel.com/new> → import the repository (framework auto-detected as Next.js).
2. Add the same environment variables under *Settings → Environment Variables*.
3. Deploy. Add the Vercel domain to Firebase Auth authorised domains, and to
   `NEXT_PUBLIC_` allowed origins if you restrict the API key.

No custom server, no paid services, no background workers.

---

## Project structure

```text
src/
  app/
    api/fetch-og/route.ts           # OpenGraph importer (SSRF guarded)
    api/recruiter-inquiries/route.ts
    about/ committee/ dashboard/ login/ register/ admin/
    members/ members/[slug]/ members/[slug]/cv/
    programs/ programs/[slug]/ media-coverage/
    layout.tsx globals.css page.tsx not-found.tsx error.tsx loading.tsx
  components/
    admin/ auth/ common/ dashboard/ home/ layout/ members/ press/ programs/ ui/
  data/seed.ts                      # demo editorial content (members, posts, press, committee)
  lib/
    auth/auth-provider.tsx          # Firebase + demo auth behind one context
    data/{repository,seed-repository,index}.ts
    i18n/{dictionaries,provider}.tsx
    store/admin-store.ts            # Firestore or browser-local persistence
    categories.ts firebase.ts format.ts media.ts types.ts upload.ts utils.ts
firestore.rules storage.rules .env.example
```

### Design notes

- **Localized content, typed keys.** Content records carry `{ bn, en }` fields; chrome uses
  a flat typed dictionary (`TranslationKey`), so a missing Bangla string fails `tsc`.
- **Repository seam.** Pages only call `repo` (`src/lib/data`). Swapping the seed repository
  for a Firestore one requires no page changes.
- **No binary assets.** Photographs and covers use remote URLs declared in
  `next.config.mjs` (`remotePatterns` allows any host) so scraped newspaper thumbnails work.
- **CV without files.** The "Download official CV (PDF)" action opens a print-optimised page;
  the browser produces the PDF. Member-uploaded PDFs take priority when present.
- **SSRF guard.** `/api/fetch-og` rejects non-http(s) schemes, credentials in URLs,
  non-standard ports, private/loopback/link-local/CGNAT hosts, and re-checks the final URL
  after redirects. It caps response size at 1.5 MB and times out after 8 s.
- **Reduced motion.** Autoplay and drag are disabled when `prefers-reduced-motion` is set.

---

## Known limitations / next steps

- Demo-mode approvals and edits do not mutate the seeded public pages (no server database yet).
  Configure Firebase and the same actions persist for everyone.
- Recruiter inquiries are validated and acknowledged; email delivery (Resend/SendGrid) is a
  documented next step, and the payload is already Firestore-shaped.
- Hero slides and programs can be reordered/edited through the API layer; inline drag-and-drop
  editors are the next UI increment.
- Unknown `/members/<slug>` and `/programs/<slug>` values render the branded not-found page, but Next
  caches that render, so the HTTP status stays 200 rather than 404 (soft 404). Add middleware or ISR
  if a hard 404 matters for crawlers. Genuinely missing top-level routes do return 404.
- Automated tests are not included; verification is `npm run build`, `npm run typecheck`,
  `npm run lint` plus route smoke checks.

## License

© Gonomadhyam Video Editor Association. Demo editorial content is illustrative; replace it
with committee-approved material before going live.
