# website

Sitio web publico migrado a Next.js + TypeScript (Hito 1).

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4

## Rutas

- `/` landing page de TrackFlow
- `/application` formulario de solicitud de presupuesto con validaciones en cliente

## Ejecutar en local

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Comprobaciones de calidad

```bash
npm run lint
npm run build
```

## Notas

- La validacion del formulario esta en `src/components/quote-form.tsx`.
- Las interacciones de la landing (scroll, reveal, contadores, carrusel) estan en `src/components/landing-interactions.tsx`.
- El diseno global y responsive esta en `src/app/globals.css`.

> English version: [README.md](./README.md)
