# Contexto del Agente — TrackFlow

## Descripción del negocio

TrackFlow es una empresa de **logística de última milla y gestión de almacenes** fundada en 2009 en Los Ángeles, Estados Unidos. Opera en dos mercados — Estados Unidos y España — con almacenes en Los Ángeles y Zaragoza. Cuenta con aproximadamente 130 empleados y factura alrededor de 9 millones de euros anuales.

Su propuesta de valor es clara: las marcas de e-commerce son buenas haciendo y vendiendo productos, pero no en hacerlos llegar al cliente. TrackFlow se encarga de eso por ellas — almacena el inventario, prepara y empaqueta los pedidos, los envía a través de una red de 8 transportistas (UPS, FedEx, DHL, MRW, SEUR, entre otros) y gestiona las devoluciones. Toda la operación logística, desde que se realiza un pedido hasta que se entrega o devuelve, es responsabilidad de TrackFlow.

---

## Objetivo del proyecto

El objetivo del proyecto es construir los sistemas, integraciones y automatizaciones inteligentes que permitan a TrackFlow operar como una empresa logística moderna. Esto incluye:

- Una **API de inventario unificada** con visibilidad en tiempo real de ambos almacenes.
- Un **motor de selección de transportista** que recomiende la opción óptima por destino, peso y urgencia.
- Un **motor de aprobación automática de devoluciones** con reglas configurables por cliente.
- Un **agente de atención al cliente (CX)** capaz de resolver automáticamente las consultas más frecuentes (seguimiento de pedidos, estado de devoluciones) en español e inglés.
- **Dashboards operativos y ejecutivos** con KPIs en tiempo real para todos los departamentos.
- Un **informe semanal generado automáticamente** para la dirección ejecutiva.
- Telemetría y logging centralizado para el equipo técnico.

---

## El problema que resuelve este proyecto

TrackFlow tiene buenos clientes y un equipo operativo competente, pero carece de la infraestructura tecnológica para gestionar una operación logística de dos países a escala. Los problemas concretos son:

- **Los dos almacenes no se ven entre sí**: operan con sistemas distintos y sin visibilidad de inventario compartida.
- **El seguimiento de envíos es manual**: los coordinadores deben consultar uno a uno los portales de 8 transportistas distintos.
- **Las devoluciones se revisan una a una**: sin criterios automáticos, cada devolución pasa por revisión humana, representando entre el 18% y el 25% del volumen total.
- **El 80% de las consultas de clientes las responde un agente humano**: sin base de conocimiento ni cobertura fuera del horario de oficina.
- **No existe CRM**: los account managers gestionan sus cuentas en hojas de cálculo personales.
- **La dirección toma decisiones con datos de 1 o 2 días de antigüedad**: el informe ejecutivo semanal se ensambla manualmente cada domingo por los directores.

El resultado es una empresa más lenta, más propensa a errores y menos rentable de lo que podría ser, mientras los competidores invierten en automatización.