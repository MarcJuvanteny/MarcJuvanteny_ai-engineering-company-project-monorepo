## Stack Tecnológico

TrackFlow Tech utiliza el siguiente stack en su plataforma interna:

**Backend**
- **Python** como lenguaje principal del backend.
- **FastAPI** como framework de API REST.
- **SQLModel** para la definición de modelos de base de datos y schemas Pydantic.
- **Supabase** (PostgreSQL gestionado) como base de datos relacional principal.
- **TinyDB** para la gestión de usuarios y autenticación (capa separada, sin tabla de usuarios en Supabase).

**Frontend / Backoffice**
- Aplicación web (backoffice) usada a diario por operarios de almacén y coordinadores logísticos.
- Instrumentada con un sistema de telemetría propio basado en eventos.

**Telemetría**
- Modelo de evento `TelemetryEvent` con envelope estándar: `eventId`, `timestamp`, `sessionId`, `userId`, `event_type`, `schemaVersion`, `service`, `properties`.
- Formato de `event_type`: `entidad_acción` (ej: `dispatch_order_created`).
- Esquema de propiedades validado contra un `event-schemas.json` con allowlists por evento.

**Infraestructura**
- Dos entornos cloud separados (Los Ángeles y Zaragoza), actualmente sin telemetría centralizada.
- El equipo en Zaragoza se entera de fallos en producción por mensajes de WhatsApp — sin monitorización activa.
- Desplegar una nueva funcionalidad tarda entre 1 y 2 semanas.

---

## Decisiones de Arquitectura Tomadas

- **API unificada bajo `/inventory`**: todos los endpoints de inventario están agrupados bajo ese prefijo en `services/routers/inventory.py`. El router se registra desde `main.py`.
- **Stock calculado, nunca almacenado**: `current_stock` se deriva siempre en tiempo de consulta como `SUM(StockEntry.quantity) − SUM(StockExit.quantity)`. No existe un campo de stock mutable en base de datos.
- **Stock por almacén, no agregado globalmente**: un mismo SKU puede existir en Los Ángeles (`LA`) y Zaragoza (`ZGZ`) con cifras independientes. Los movimientos siempre llevan el campo `warehouse`.
- **Sin modelo `User` en Supabase**: la gestión de identidad recae exclusivamente en TinyDB. Los campos `user_uuid` en los modelos referencian ese sistema sin FK formal.
- **Separación de entrada y salida de stock en tablas distintas**: `StockEntry` (recepciones) y `StockExit` (despachos y pérdidas) son entidades separadas, con sus propios campos y reglas de negocio.
- **Idempotencia en la carga de datos históricos**: al sembrar incidencias desde CSV, se usa el campo `incident_id` como identificador de idempotencia para evitar duplicados.
- **Gestión de incidencias con ciclo de vida estricto**: los estados (`open`, `in_progress`, `resolved`, `discarded`) tienen transiciones válidas definidas; `resolved` y `discarded` son estados finales.
- **Telemetría con allowlist de propiedades por evento**: cada llamada al sistema de tracking solo puede incluir los campos explícitamente permitidos para ese tipo de evento. Cualquier propiedad fuera de la lista es rechazada.
- **`userId` siempre es UUID opaco**: nunca se registra nombre ni email de usuario en eventos de telemetría.

---

## Restricciones Técnicas

- **El campo `warehouse` es obligatorio en todos los eventos de inventario** (`los_angeles` / `zaragoza`). Un evento sin este campo es inútil para el dashboard ejecutivo y para la segmentación por país.
- **Sin datos personales del cliente final en telemetría**: los eventos de despacho registran la acción del operario, nunca nombre, dirección ni teléfono del destinatario.
- **`client_id` debe ser un identificador opaco**, nunca el nombre de la marca. Los eventos de telemetría no pueden exponer datos de un cliente en un contexto visible para otro.
- **No se puede registrar un `StockExit` que lleve el stock por debajo de cero**: la validación ocurre antes de escribir en base de datos y devuelve HTTP 400 con mensaje descriptivo.
- **`tracking_number` es obligatorio en despachos (`dispatch`) y debe ser `null` en pérdidas (`loss`)**: validación a nivel de schema o lógica de ruta.
- **Los dos almacenes conviven en las mismas tablas**: no hay bases de datos separadas por país. El campo `warehouse` actúa como discriminador lógico.
- **Los estados y categorías de incidencias son listas cerradas (enums)**: registros con valores fuera de la lista se descartan y se reportan a consola durante la carga.
- **La arquitectura tecnológica actual es un patchwork**: dos WMS distintos, un ERP de principios de los 2010, scripts Python punto a punto sin documentar y bases de datos en dos proveedores cloud. Cualquier nueva integración debe asumir esta realidad y no depender de consistencia entre sistemas legacy.
- **Soporte multiidioma**: la plataforma opera en inglés (Los Ángeles) y español (Zaragoza). Los mensajes de error, labels de formularios y notificaciones deben respetar el idioma del usuario.
- **Disponibilidad 24/7**: el agente de CX, el portal de seguimiento y el dashboard operativo deben estar siempre disponibles — los clientes no dejan de esperar sus paquetes fuera del horario de oficina.