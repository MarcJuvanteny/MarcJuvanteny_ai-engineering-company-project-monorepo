# Skill: Verificacion de Contratos Compartidos

## 1) Objetivo unico

Detectar y documentar el impacto de cambios en contratos compartidos antes de commit o PR para evitar regresiones en consumidores internos.

## 2) Alcance de aplicacion

- Tipo: Siempre activa
- Se ejecuta cuando haya cambios en rutas de contratos compartidos.

Rutas objetivo por defecto:
- `packages/shared/types/**`
- `packages/shared/**/types/**`

## 3) Inputs documentados

Inputs obligatorios:
1. `changed_files`: lista de archivos modificados en la rama.
2. `diff`: cambios de contenido por archivo (hunks o patch).

Inputs opcionales:
1. `contract_paths`: patrones glob de contratos a vigilar. Si no se informa, usar valores por defecto.
2. `compatibility_mode`: `backward-compatible` (por defecto) o `breaking-allowed`.
3. `consumers_map`: mapa conocido de consumidores por contrato (si existe en el repo).

## 4) Proceso de ejecucion

1. Filtrar `changed_files` por `contract_paths`.
2. Si no hay cambios en contratos, devolver estado `NO_CONTRACT_CHANGES` y finalizar.
3. Si hay cambios, identificar contratos afectados y consumidores potenciales.
4. Clasificar cada cambio como:
   - `compatible`
   - `breaking`
   - `unknown` (si no hay evidencia suficiente)
5. Generar reporte con acciones recomendadas por consumidor.
6. Aplicar regla de salida segun `compatibility_mode`.

## 5) Salida esperada

La skill debe devolver un bloque estructurado con:

1. `status`: `PASS`, `FAIL` o `NO_CONTRACT_CHANGES`
2. `affected_contracts`: lista de contratos modificados
3. `affected_consumers`: lista de consumidores potenciales
4. `classification`: resultado por contrato (`compatible`/`breaking`/`unknown`)
5. `required_actions`: checklist previo a commit/PR
6. `evidence`: referencias a archivos y/o pruebas ejecutadas

## 6) Criterios de aceptacion (explicitos y verificables)

La skill se considera correcta solo si cumple todos estos puntos:

1. Detecta de forma determinista si hubo o no cambios en contratos compartidos.
2. Lista al menos un contrato afectado cuando `status` no es `NO_CONTRACT_CHANGES`.
3. Entrega clasificacion por cada contrato afectado (`compatible`, `breaking` o `unknown`).
4. Si `compatibility_mode = backward-compatible` y existe al menos un `breaking`, el resultado final es `FAIL`.
5. Si no hay `breaking` y no hay `unknown`, el resultado final es `PASS`.
6. Incluye un checklist de acciones obligatorias con al menos 2 items cuando hay contratos afectados.
7. Incluye evidencia trazable (archivos y cambios analizados).

## 7) Definicion de terminado

La ejecucion termina cuando existe un resultado final (`PASS`, `FAIL` o `NO_CONTRACT_CHANGES`) y el reporte esta completo con contratos, consumidores, clasificacion, acciones y evidencia.