# AGENTS.md

Este documento define las reglas operativas mínimas para cualquier agente que trabaje en este monorepo.

## 1) Lectura obligatoria del banco de memoria al inicio de cada sesión

Al iniciar cada sesión, el agente debe leer en este orden:

1. `memory-bank/projectbrief.md`
2. `memory-bank/techContext.md`
3. `memory-bank/progress.md`

Objetivo:
- Entender alcance y prioridades del proyecto.
- Conocer restricciones técnicas y stack vigente.
- Continuar el trabajo sin perder contexto ni duplicar esfuerzos.

## 2) Flujo obligatorio antes de cada commit

Antes de crear cualquier commit, el agente debe completar este flujo, en orden, sin saltarse pasos:

1. Sincronizar contexto:
- Revisar cambios actuales (incluyendo archivos modificados por terceros) y confirmar qué entra en el commit.

2. Validar calidad técnica:
- Ejecutar lint, tests y cualquier chequeo aplicable al alcance del cambio.

3. Verificar seguridad y alcance:
- Confirmar que no hay secretos, credenciales, datos sensibles, ni cambios fuera del objetivo definido.

4. Revisar impacto y compatibilidad:
- Comprobar que no se rompen contratos, APIs, tipos compartidos ni flujos críticos.

5. Preparar commit de forma trazable:
- Agrupar cambios coherentes, redactar mensaje claro y verificar diff final antes de confirmar.

## 3) Carpetas y archivos que no se deben modificar sin confirmación explícita del desarrollador

El agente no debe modificar estas rutas sin autorización explícita previa:

- `infra/`
- `internal/`
- `mcps/`
- `workflows/`
- `memory-bank/projectbrief.md`
- `memory-bank/techContext.md`
- `memory-bank/progress.md`
- `.gitignore`
- `README.md`
- `README.es.md`
- `CONTEXT.md`
- `CONTEXT.es.md`

Si una tarea requiere cambios en cualquiera de estas rutas, el agente debe detenerse y solicitar confirmación explícita antes de continuar.
