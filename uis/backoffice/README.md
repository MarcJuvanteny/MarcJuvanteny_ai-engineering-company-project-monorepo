# backoffice

Internal frontend app for TrackFlow operations.

## Scope

- Route `/` provides a basic internal entry dashboard.
- Uses a dedicated layout and style system independent from `uis/website`.
- Integrates TypeScript business logic from Hito 2 imported from `packages/shared/hito2`.

## Run locally

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run lint
npm run build
```

## Integration details

- UI imports shared logic from `@hito2/*` path alias.
- Logic source is in `packages/shared/hito2` (not duplicated inside backoffice).
- Dashboard displays computed results directly in the interface.

> Spanish version: [README.es.md](./README.es.md)
