## Progreso Actual

Los siguientes módulos han sido definidos y tienen contexto técnico completo en el repositorio. Representan el trabajo ya especificado o en construcción por el equipo TrackFlow Tech.

### Hito 01 — Sitio web público corporativo
**Responsable de negocio:** Miguel Torres (Director Comercial)
**Estado:** Especificado

Sitio web público responsive con landing page completa, presentación de los tres servicios (almacén, última milla, logística inversa), cobertura por país, y formulario estructurado de captación de leads B2B. Incluye validación completa de formulario, mensajes de error específicos, mensaje de éxito, y marcado Schema.org. Stack: HTML + Tailwind CSS.

---

### Hito 03 — Talent Pipeline Tracker (backoffice de RRHH)
**Responsable de negocio:** Ana Whitfield (Head of Warehouse Operations)
**Estado:** Especificado

Frontend de gestión del proceso de selección del Asistente Ejecutivo para la sede de Zaragoza. Permite ver candidatos, filtrar por estado y etapa, buscar sin recargar página, abrir detalle, actualizar estado/etapa, gestionar notas y registrar nuevos candidatos. Consume una API mock centralizada del curso.

---

### Hito 05 — API de inventario unificada (backend)
**Responsable de negocio:** Andrés Kim (CTO) — Ticket TRK-0341
**Estado:** Especificado y en construcción

API REST con FastAPI + SQLModel + Supabase. Entidades: `SKU`, `StockEntry` (recepciones) y `StockExit` (despachos/pérdidas). Stock calculado en tiempo real por almacén, nunca almacenado. Endpoints bajo `/inventory`. Reglas de negocio implementadas: validación de stock negativo (HTTP 400), `tracking_number` obligatorio en despachos, stock segregado por almacén (`LA` / `ZGZ`). Autenticación en TinyDB.

---

### Hito 07 — Análisis de incidencias (script Python)
**Responsable de negocio:** Valentina Cruz (CX Manager)
**Estado:** Especificado

Script CLI `analyze.py` que procesa un CSV de 1.000 incidencias exportado del helpdesk legacy. Valida registros, clasifica por categoría/estado/país, calcula puntuaciones de satisfacción y genera un reporte en consola. Reglas estrictas de privacidad: nunca imprimir `customer_email`. Salida exportable a CSV. Base para el futuro agente de soporte de primera línea.

---

### Hito 09 — Directorio de proveedores (API ligera + frontend)
**Responsable de negocio:** Carlos Vega (Head of Carrier Operations) + Ana Whitfield
**Estado:** Especificado

API con TinyDB (almacenamiento ligero) + frontend que centraliza el directorio de los 15 proveedores activos/suspendidos de ambos países (carriers, embalaje, logística inversa, software). Permite filtrar por país y categoría, registrar nuevos proveedores, actualizar tarifas y suspender/reactivar. Trazabilidad automática de `rate_updated_at`.

---

### Hito 10 — Gestión centralizada de incidencias (full-stack)
**Responsable de negocio:** Andrés Kim (CTO), Thomas Harry (CEO), Carlos Vega, Ana Whitfield, Valentina Cruz
**Estado:** Especificado

Sistema de tickets operativos con 9 categorías de incidencia (`lost_parcel`, `carrier_issue`, `inventory_discrepancy`, etc.), ciclo de vida con transiciones definidas (`open → in_progress → resolved/discarded`), 5 sedes (`la_warehouse`, `la_office`, `zaragoza_warehouse`, `zaragoza_office`, `central`) y carga idempotente desde CSV histórico. Soporte bilingüe (ES/EN). Formulario diseñado para uso táctil en terminales de almacén.

---

### Hito 11 — Telemetría Fase 1: Plan de telemetría
**Responsable de negocio:** Ana Whitfield + Thomas Harry
**Estado:** Especificado

Documento de diseño (`telemetry-plan.md`) que define los eventos a capturar, KPIs objetivo (tasa de cumplimiento, frecuencia de discrepancias, tiempo de ciclo recepción-despacho), decisión stream/batch por evento, y `event-schemas.json` con allowlists de propiedades. Nomenclatura `entidad_acción` (ej: `dispatch_order_created`).

---

### Hito 12 — Telemetría Fase 2: Captura desde el frontend
**Responsable de negocio:** Andrés Kim (CTO)
**Estado:** Especificado

Instrumentación del backoffice con llamadas a `track()` en los puntos críticos del flujo de inventario y autenticación. 8 tipos de evento definidos con allowlists estrictas. `userId` siempre UUID opaco. `warehouse` obligatorio en todos los eventos de inventario. Prohibido incluir PII del destinatario.

---

### Hito 13 — Telemetría Fase 3: Almacenamiento en el backend
**Responsable de negocio:** Andrés Kim (CTO)
**Estado:** Especificado

Endpoint real que reemplaza el stub de telemetría. Almacena eventos en tabla `telemetry_events` en Supabase con columna JSONB `tags`. Soporte de bulk insert con rechazo parcial (eventos inválidos se descartan sin bloquear el batch). Validación obligatoria de `warehouse` y `destination_country` en eventos críticos.

---

### Hito 14 — Telemetría Fase 4: Reporting desde los datos
**Responsable de negocio:** Ana Whitfield + Thomas Harry
**Estado:** Especificado

Script `analysis.py` con Pandas que consulta `telemetry_events` en Sup