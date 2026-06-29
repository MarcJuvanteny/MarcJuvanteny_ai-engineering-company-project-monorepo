# backoffice

Aplicacion frontend interna para operaciones de TrackFlow.

## Alcance

- Ruta `/` con una vista de entrada basica para uso interno.
- Layout y estilo propios, separados de `uis/website`.
- Integracion de logica TypeScript del Hito 2 importada desde `packages/shared/hito2`.

## Ejecutar en local

```bash
npm install
npm run dev
```

## Comprobaciones de calidad

```bash
npm run lint
npm run build
```

## Detalles de integracion

- La UI importa la logica compartida usando el alias `@hito2/*`.
- El origen de la logica esta en `packages/shared/hito2` (sin copiarla dentro de backoffice).
- El dashboard muestra en pantalla el resultado calculado por esa logica.

> English version: [README.md](./README.md)
