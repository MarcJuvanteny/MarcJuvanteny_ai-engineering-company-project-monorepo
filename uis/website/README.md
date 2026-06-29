# website

Public website migrated to Next.js + TypeScript (Hito 1).

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4

## Routes

- `/` landing page TrackFlow
- `/application` quote request form with client-side validations

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
npm run lint
npm run build
```

## Notes

- The form validation logic is implemented in `src/components/quote-form.tsx`.
- Landing interactions (scroll, reveal, counters, carousel) are in `src/components/landing-interactions.tsx`.
- Global design and responsive styles are in `src/app/globals.css`.

> Spanish version: [README.es.md](./README.es.md)
