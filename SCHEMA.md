# Firestore Schema — FOUNDRY SERIES

## Collection: `events`

One document per chapter. **Document ID = slug** (e.g. `scrub-radius`),
which is what makes `/event/[slug]` a single `getDoc` lookup with no
extra query.

```ts
{
  id: string,                 // same as document id / slug
  title: string,               // "The Scrub Radius"
  chapter: string,              // "Chapter I"
  type: "online" | "offline",
  description: string,
  problemStatement: string,
  rules: string[],
  datasetUrl: string,           // Firebase Storage download URL, "" if none
  submissionUrl: string,        // external form / portal link
  startTime: Timestamp,
  endTime: Timestamp,
  announcements: [
    { text: string, postedAt: Timestamp }
  ],
  createdAt: Timestamp,
  updatedAt: Timestamp,
}
```

### The 8 documents (seeded by `scripts/seedEvents.mjs`)

| Doc ID              | Title              | Chapter     | Type    |
|----------------------|--------------------|------------|---------|
| data-blueprint       | The Data Blueprint | Chapter I   | online  |
| signal-architect     | Signal Architect   | Chapter II  | online  |
| the-synthesis        | The Synthesis      | Chapter III | online  |
| pareto-protocol      | Pareto Protocol    | Chapter IV  | online  |
| scrub-radius         | The Scrub Radius   | Chapter I   | offline |
| pixel-strike         | Pixel Strike       | Chapter II  | offline |
| kinetic-overload     | Kinetic Overload   | Chapter III | offline |
| omni-pareto          | Omni Pareto        | Chapter IV  | offline |

### Storage layout

```
datasets/{eventId}/{timestamp}_{filename}
```

### Security model

- **Read**: public (no auth) — required for the QR-code flow.
- **Write**: requires Firebase Auth (`request.auth != null`) — admin
  accounts are created manually in Firebase Console, there's no
  public sign-up.

See `firestore.rules` and `storage.rules` for the exact rule code.
