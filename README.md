# FOUNDRY SERIES — Event Management & Competition Portal

A production-ready Next.js 15 (App Router) portal for running an 8-chapter
competition series (4 online + 4 offline), with QR-code-driven event pages,
live Firestore data, automatic start/end handling, real-time announcements,
and a secured admin dashboard. Visual style: dark "Data Operations Center"
console — glassmorphism, neon green glow, drifting fog, digital countdowns.

---

## 1. Project Structure

```
foundry-series/
├── src/
│   ├── app/
│   │   ├── layout.js              Root layout: fonts, atmosphere background
│   │   ├── globals.css            Theme, glass panels, fog/particles/scanlines
│   │   ├── page.js                 "/" — homepage, lists all 8 chapters
│   │   ├── admin/page.js           "/admin" — login-gated dashboard
│   │   ├── event/[slug]/page.js    "/event/[slug]" — dynamic event console
│   │   └── event-ended/page.js     "/event-ended" — post-competition screen
│   ├── components/
│   │   ├── AtmosphereBackground.jsx  Fog + particles + scanlines (global)
│   │   ├── GlassCard.jsx             Reusable glassmorphism panel
│   │   ├── NeonButton.jsx            Reusable button (solid/ghost/danger)
│   │   ├── StatusBadge.jsx           LIVE / STANDBY / ENDED pill
│   │   ├── CountdownDisplay.jsx      Digital countdown numerals
│   │   ├── TimerPanel.jsx            Sticky right-side timer panel
│   │   ├── Buzzer.jsx                Web Audio buzzer + red flash at Time's Up
│   │   ├── AnnouncementFeed.jsx      Live announcement list
│   │   ├── EventQRCode.jsx           QR code generator per event
│   │   ├── AdminLoginForm.jsx        Email/password login form
│   │   └── AdminEventEditor.jsx      Full event edit modal (admin)
│   ├── hooks/
│   │   ├── useAuth.js                Firebase auth state hook
│   │   └── useCountdown.js           Pre-start/live/final-five/ended state machine
│   └── lib/
│       ├── firebase.js               Firebase client SDK init
│       ├── auth.js                    login/logout/watchAuthState
│       ├── events.js                  Firestore CRUD for `events` collection
│       ├── storage.js                 Firebase Storage dataset upload/delete
│       └── eventManifest.js           Canonical list of the 8 chapter slugs
├── scripts/seedEvents.mjs             One-time Firestore seed script (Admin SDK)
├── firestore.rules                    Public read / admin-only write
├── storage.rules                      Public read / admin-only upload (200MB cap)
├── firebase.json                      Firebase CLI config (rules deploy)
├── vercel.json                        Vercel deployment config
├── tailwind.config.mjs                Neon command-center design tokens
├── postcss.config.mjs
├── jsconfig.json                      "@/..." import alias
├── next.config.mjs
├── package.json
├── .env.local.example
├── .gitignore
└── SCHEMA.md                          Firestore schema reference
```

### What each file does (quick reference)

- **`src/lib/firebase.js`** — initializes the Firebase app once (guards
  against re-init during hot reload) and exports `db`, `storage`, `auth`.
- **`src/lib/events.js`** — every Firestore read/write for events lives
  here: `getAllEvents`, `getEventBySlug`, `subscribeToEvent` (real-time),
  `subscribeToAllEvents`, `upsertEvent`, `updateEventFields`, `deleteEvent`,
  `postAnnouncement` (atomic `arrayUnion`), `setSubmissionUrl`, `setDatasetUrl`.
- **`src/lib/storage.js`** — `uploadDataset(slug, file, onProgress)` uploads
  to `datasets/{slug}/...` and returns a download URL; `deleteDatasetByUrl`.
- **`src/lib/auth.js`** + **`src/hooks/useAuth.js`** — admin login gate.
  No public sign-up: create admin users manually in Firebase Console →
  Authentication → Users.
- **`src/hooks/useCountdown.js`** — the single source of truth for timing.
  Given `startTime`/`endTime` (Firestore Timestamp, Date, or millis), it
  returns `{ mode, time }` where `mode` is one of `pre-start`, `live`,
  `final-five` (last 5 minutes), or `ended`. Ticks every second.
- **`src/app/event/[slug]/page.js`** — subscribes live to the event doc,
  drives the 70/30 layout, locks/unlocks Problem Statement / Dataset /
  Submission based on `mode`, and auto-redirects to `/event-ended` 10
  seconds after `mode` becomes `ended`.
- **`src/components/Buzzer.jsx`** — synthesizes a buzzer tone via the Web
  Audio API (no audio file to host) and flashes a red overlay once, the
  moment `mode` becomes `ended`.
- **`src/app/admin/page.js`** + **`AdminEventEditor.jsx`** — dashboard
  listing all 8 events with live status; "Edit" opens a modal to update
  every field, upload a dataset, post an announcement instantly, and see
  that event's QR code for printing.
- **`scripts/seedEvents.mjs`** — run once to create the 8 Firestore
  documents with placeholder content using the Firebase Admin SDK.

---

## 2. Firebase Setup

1. Go to https://console.firebase.google.com → **Add project** → name it
   `foundry-series` (or anything).
2. **Build → Firestore Database → Create database** → start in
   **production mode** → pick a region.
3. **Build → Storage → Get started** → same region as Firestore.
4. **Build → Authentication → Get started → Sign-in method → Email/Password
   → Enable.**
5. **Authentication → Users → Add user** — create your admin login
   (email + password). This is the only account that can use `/admin`.
6. **Project settings (gear icon) → General → Your apps → Add app → Web
   (</> icon)** → register the app → copy the `firebaseConfig` values.
7. **Project settings → Service accounts → Generate new private key** —
   download the JSON. You'll need this only for the one-time seed script
   (step 4 below), never deployed to Vercel.

---

## 3. Beginner Installation Guide (Step-by-Step)

> Assumes you have Node.js 18+ installed. Check with `node -v`.

### Step 1 — Get the code running locally
```bash
cd foundry-series
npm install
cp .env.local.example .env.local
```

### Step 2 — Fill in `.env.local`
Open `.env.local` and paste in the values from Firebase step 6 above:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=foundry-series.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=foundry-series
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=foundry-series.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### Step 3 — Deploy security rules
```bash
npm install -g firebase-tools
firebase login
firebase use --add        # pick your project
firebase deploy --only firestore:rules,storage
```

### Step 4 — Seed the 8 events into Firestore
Place the service account JSON you downloaded earlier at
`./serviceAccountKey.json` in the project root (it's gitignored — never
commit it), then:
```bash
node scripts/seedEvents.mjs
```
You should see 8 lines like `✓ Seeded scrub-radius`.

### Step 5 — Run the app
```bash
npm run dev
```
Open http://localhost:3000 — you should see the homepage with 8 chapter
cards. Visit http://localhost:3000/admin and log in with the admin user
you created in Firebase step 5. Edit any event's title, description,
problem statement, rules, start/end time, upload a dataset, and post an
announcement — then open `/event/<that-slug>` in another tab and watch
it update live.

### Step 6 — Generate QR codes
Each event's QR code (linking to its public `/event/[slug]` URL) is shown
right inside the admin edit modal — screenshot or right-click → "Save
image" to print it for table signage.

---

## 4. Deploying to Vercel

1. Push this repo to GitHub.
2. Go to https://vercel.com/new → import the repo.
3. In **Environment Variables**, add the same 6 `NEXT_PUBLIC_FIREBASE_*`
   values from your `.env.local` (the service-account var is NOT needed
   on Vercel — it's only for the local seed script).
4. Click **Deploy**.
5. Once live, your event URLs are:
   `https://your-domain.vercel.app/event/scrub-radius`, etc. — generate
   final QR codes against the production domain from `/admin`.

### Optional: custom domain
Vercel → Project → Settings → Domains → add your domain and follow the
DNS instructions shown.

---

## 5. How the automatic start/end behavior works

- Every event document has `startTime` and `endTime` (Firestore
  Timestamps).
- `useCountdown` compares `Date.now()` against those every second and
  returns one of four `mode`s — there is no manual "start the event"
  button; it's fully automatic because it's comparing server-stored
  timestamps against the client's clock every tick.
- **`pre-start`**: Problem Statement, Dataset, and Submission sections
  render as locked placeholders.
- **`live`**: all three unlock with a fade-in.
- **`final-five`** (last 5 minutes before `endTime`): the timer panel and
  countdown numerals switch to a pulsing red glow.
- **`ended`**: countdown shows "TIME'S UP", the buzzer fires once,
  submissions lock again, and after 10 seconds the page auto-navigates to
  `/event-ended`.

## 6. Live announcements

`postAnnouncement()` uses Firestore's `arrayUnion`, and the event page
holds a live `onSnapshot` listener (`subscribeToEvent`) — so the instant
an admin clicks "Post" in `/admin`, every open participant tab updates
with zero refresh and zero polling.

## 7. Customizing colors / theme

All theme tokens live in `tailwind.config.mjs` (`neon`, `neon-bright`,
`void`, `charcoal`, `danger`) and `src/app/globals.css` (glass panel
blur/opacity, fog/particle intensity). Change them in one place and the
whole app updates.
