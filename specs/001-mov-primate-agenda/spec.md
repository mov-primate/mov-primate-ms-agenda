# Feature Specification: Microservicio de agenda y validación de reservas MovPrimate

**Feature Branch**: `001-mov-primate-agenda`

**Created**: 2026-11-03

**Status**: Draft

**Input**: User description: "Define el microservicio de agenda con slots, conflicto de horarios, validación administrativa y reservas de 1 hora hasta 4 alumnos por clase para MovPrimate. Debe considerar usuarios alumnos, administradores/profesores y un superadmin del gimnasio, con autorización explícita para validar, aprobar o rechazar reservas, evitar duplicados y solapamientos, y controlar cupos por horario."

## Clarifications

### Session 2026-11-05

- Q: Cuando una clase llegue al cupo de 4 alumnos, ¿la disponibilidad debe ocultar ese slot o mostrarlo como completo? → A: Mostrar slot con estado completo (`available=false`, `reason=capacity_full`).
- Q: ¿La operación de mover slot debe existir como acción directa para administrador/superadmin o debe prohibirse y obligar siempre cancelar + nueva reserva? → A: Permitir acción directa `move-slot` para admin/superadmin con validación completa de conflicto, cupo y permisos.
- Q: ¿Qué zona horaria debe usar la regla de cancelación de “al menos 1 hora antes”: la del gimnasio (servidor), la del alumno, o UTC? → A: Zona horaria oficial del gimnasio/servidor.
- Q: ¿Qué estrategia de concurrencia se debe usar cuando varias solicitudes compiten por el último cupo del mismo slot? → A: Transacción atómica con condición de cupo + índice único para duplicados.
- Q: Si BFF preconfirma una reserva pero agenda la rechaza por conflicto/cupo, ¿qué política de compensación debe aplicarse? → A: Agenda es la fuente de verdad; BFF revierte/niega confirmación y muestra error de negocio sin estado confirmado temporal.

## User Scenarios & Testing

### User Story 1 - Alumno reserva una clase de 1 hora con profesor seleccionado (Priority: P1)
Un alumno autenticado selecciona fecha y hora en calendario, elige profesor (usuario administrador) y solicita una reserva de 1 hora.

**Why this priority**: La operación de reserva es el núcleo del dominio y debe garantizar consistencia y conflicto cero.

**Independent Test**: Un alumno puede enviar una solicitud válida para un horario libre con profesor seleccionado y el sistema la registra como pendiente.

**Acceptance Scenarios**:
1. **Given** que un alumno elige fecha y hora disponible en el calendario y selecciona profesor, **When** realiza la solicitud, **Then** el sistema crea una reserva en estado pendiente.
2. **Given** que el mismo alumno intenta repetir la misma reserva o generar solapamiento, **When** confirma la operación, **Then** el servicio rechaza la solicitud por duplicado o conflicto.

---

### User Story 2 - Sistema valida cupo y conflictos de horario (Priority: P1)
El servicio valida cupo máximo por clase y que no existan solapamientos ni reservas duplicadas por usuario.

**Why this priority**: La integridad del calendario es esencial para mantener confianza y evitar errores operativos.

**Independent Test**: El servicio evalúa los slots, bloquea horarios completos (4 alumnos) y rechaza reservas inválidas por conflicto de usuario.

**Acceptance Scenarios**:
1. **Given** que una clase ya tiene 4 alumnos en una franja, **When** llega una nueva solicitud para esa misma franja y profesor, **Then** el sistema mantiene el horario visible como no disponible (`available=false`, `reason=capacity_full`).
2. **Given** que un alumno intenta reservar un horario que se solapa con otra reserva propia, **When** se procesa la solicitud, **Then** el sistema la rechaza como conflicto de usuario.
3. **Given** que existe un horario bloqueado o no disponible, **When** se solicita, **Then** el servicio responde con `available=false` o error de negocio.

---

### User Story 3 - Administrador revisa y valida reservas donde fue seleccionado (Priority: P1)
El administrador/profesor valida y modifica reservas solo en horarios donde fue seleccionado por el alumno.

**Why this priority**: La aprobación administrativa es una regla central del flujo operativo del gimnasio.

**Independent Test**: Un administrador con permisos puede aprobar o rechazar una reserva pendiente únicamente de sus propios horarios asignados.

**Acceptance Scenarios**:
1. **Given** que existe una reserva pendiente asociada al profesor autenticado, **When** el administrador la aprueba, **Then** el servicio cambia el estado a confirmado.
2. **Given** que existe una reserva pendiente, **When** el administrador la rechaza, **Then** el servicio cambia el estado a rechazada y registra la decisión.
3. **Given** que el administrador intenta modificar una reserva de otro profesor, **When** ejecuta la acción, **Then** el servicio la rechaza por alcance no autorizado.
4. **Given** que un usuario sin permisos intenta validar la reserva, **When** ejecuta la acción, **Then** el servicio la rechaza por autorización.
5. **Given** que el administrador intenta mover o cancelar una reserva de su propio horario asignado, **When** ejecuta la acción, **Then** el servicio la permite y registra auditoría.

---

### User Story 4 - Superadmin supervisa excepciones y decisiones críticas (Priority: P1)
El dueño del gimnasio puede revisar y monitorear el estado general del calendario, reservas y excepciones.

**Why this priority**: La supervisión global es necesaria para controlar excepciones y mantener trazabilidad del sistema.

**Independent Test**: Un superadmin puede consultar y modificar cualquier reserva u horario, incluyendo casos fuera del alcance de administradores.

**Acceptance Scenarios**:
1. **Given** que hay reservas con conflicto o casos excepcionales, **When** el superadmin consulta, **Then** puede ver la información relevante y decidir la siguiente acción.
2. **Given** que una operación requiere cambiar reservas/horarios fuera del alcance de un administrador, **When** el superadmin la ejecuta, **Then** la acción queda autorizada y auditada.
3. **Given** que el superadmin requiere mover, cancelar, aprobar o rechazar cualquier reserva, **When** ejecuta la acción, **Then** el sistema la permite con trazabilidad completa.

---

### User Story 5 - Consulta de historial y estados por alumno (Priority: P2)
El servicio expone consultas de disponibilidad e historial para que el alumno pueda revisar sus reservas y entender el estado actual.

**Why this priority**: El historial mejora la transparencia y reduce consultas manuales o fuera de plataforma.

**Independent Test**: El servicio consulta el historial y los estados asociados a un alumno autenticado.

**Acceptance Scenarios**:
1. **Given** que un alumno tiene reservas, **When** consulta su historial, **Then** recibe su lista con estados y fechas.
2. **Given** que una reserva cambia de estado, **When** ocurre la transición, **Then** el historial refleja la nueva situación.

### Edge Cases

- ¿Qué pasa si solicitan reserva más de 4 alumnos en la misma clase exactamente al mismo tiempo?
- ¿Cómo se maneja una reserva con solapamiento parcial de 30 minutos?
- ¿Qué sucede si un administrador aprueba una reserva que ya fue rechazada por otra operación?
- ¿Cómo responde el sistema si el horario es bloqueado manualmente por el superadmin?
- ¿Qué ocurre si la validación llega con el mismo usuario pero sin permisos de administrador?
- ¿Qué ocurre si el administrador intenta modificar una reserva donde no fue seleccionado por el alumno?
- ¿Qué ocurre si un alumno intenta mover slot o aprobar/rechazar una reserva directamente?

## Requirements

### Functional Requirements

- **FR-001**: El servicio DEBE exponer un contrato para consultar disponibilidad de slots de 1 hora por fecha, hora y profesor.
- **FR-002**: El servicio DEBE reconocer los roles usuario, alumno, administrador/profesor y superadmin.
- **FR-003**: El alumno DEBE seleccionar profesor (usuario administrador) al momento de reservar.
- **FR-004**: Cada clase DEBE permitir un cupo máximo de 4 alumnos por franja de 1 hora.
- **FR-005**: El servicio DEBE mostrar los horarios con cupo (4) completo con estado no disponible (`available=false`, `reason=capacity_full`).
- **FR-006**: El servicio DEBE prevenir duplicados y solapamientos para una misma cuenta de alumno usando transacción atómica con condición de cupo e índice único para duplicados.
- **FR-007**: El servicio DEBE registrar reservas con estados claros: pendiente, confirmado, rechazado y cancelado.
- **FR-008**: El servicio DEBE permitir la aprobación o rechazo de reservas por parte de un administrador autorizado, siempre sujeto al alcance definido en FR-009.
- **FR-009**: El administrador solo DEBE poder modificar reservas/horarios donde fue seleccionado por el alumno.
- **FR-010**: El superadmin DEBE poder modificar cualquier reserva u horario del sistema.
- **FR-011**: El servicio DEBE impedir que usuarios sin permisos validen o modifiquen reservas ajenas.
- **FR-012**: El servicio DEBE soportar consultas de historial y de estado por alumno o por reserva.
- **FR-013**: El servicio DEBE registrar cambios de estado y decisiones de validación con trazabilidad.
- **FR-014**: El servicio DEBE mantener contratos consistentes con BFF, API y frontend para disponibilidad, reserva y estados. Ante rechazo por conflicto/cupo, agenda es fuente de verdad y BFF debe revertir/denegar la confirmación mostrando el error de negocio.
- **FR-015**: El servicio DEBE validar reglas de negocio antes de confirmar una reserva y responder con errores claros cuando se incumplan.
- **FR-016**: El servicio DEBE aplicar una matriz explícita de acciones permitidas/prohibidas por rol para mover slot, cancelar, aprobar y rechazar. `move-slot` es una acción directa permitida para administrador/superadmin y siempre valida conflicto, cupo y permisos.
- **FR-017**: Toda acción prohibida por rol o alcance DEBE responder con error de autorización/alcance y quedar auditada.
- **FR-018**: La cancelación de reserva DEBE permitirse solo hasta 1 hora antes del inicio de la clase, usando la zona horaria oficial del gimnasio/servidor.
- **FR-019**: El servicio DEBE permitir al administrador y al superadmin registrar asistencia: asistió, no asistió, justificó ausencia.
- **FR-020**: El servicio DEBE exponer al superadmin agregados para revisar reservas y total de asistencias por alumno.
- **FR-021**: El servicio DEBE validar que el alumno tenga `available_classes` > 0 (cuota disponible) antes de confirmar una reserva, consultando al microservicio de alumnos; si la cuota es 0, rechazar con error ERR_NO_CLASSES_AVAILABLE.

### Matriz de acciones autorizadas

| Acción | Alumno | Administrador/Profesor | Superadmin |
|---|---|---|---|
| Crear reserva (1h, con profesor) | Permitido (solo propia) | No aplica | Permitido |
| Mover slot de una reserva | No permitido | Permitido solo si fue seleccionado y el nuevo slot pertenece a su disponibilidad | Permitido en cualquier reserva |
| Cancelar reserva | Permitido solo si la reserva es propia, vigente y faltan al menos 1 hora | Permitido solo en reservas donde fue seleccionado y faltan al menos 1 hora | Permitido en cualquier reserva según política operativa |
| Aprobar reserva | No permitido | Permitido solo en reservas donde fue seleccionado | Permitido en cualquier reserva |
| Rechazar reserva | No permitido | Permitido solo en reservas donde fue seleccionado | Permitido en cualquier reserva |
| Registrar asistencia | No permitido | Permitido solo en reservas donde fue seleccionado | Permitido en cualquier reserva |

Nota: Para alumnos, el cambio de horario se realiza mediante cancelar + nueva reserva propia; no existe acción directa `move-slot` para este rol.

### Key Entities

- **Alumno**: persona que solicita reservas y consulta su historial.
- **Administrador/Profesor**: usuario autorizado para revisar y decidir sobre reservas.
- **Superadmin**: dueño del gimnasio con supervisión global y capacidad de gestión excepcional.
- **Reserva**: entidad central con horario, alumno, profesor seleccionado, estado y validación.
- **Slot**: franja horaria disponible o bloqueada en el calendario.
- **Cupo de clase**: contador de alumnos por slot/profesor con máximo de 4.
- **Estado de reserva**: conjunto de estados para el flujo de negocio.
- **Evento de decisión**: marca de aprobación, rechazo, cancelación o movimiento con auditoría.

## Success Criteria

### Measurable Outcomes

- **SC-001**: El servicio rechaza 100% de las reservas duplicadas o solapadas detectadas por la regla de negocio por alumno.
- **SC-002**: El servicio no permite más de 4 alumnos por clase/horario/profesor y bloquea el slot al completar cupo.
- **SC-003**: El 99% de las reservas pendientes se resuelven con una decisión válida dentro de 24 horas desde su creación.
- **SC-004**: Un administrador autorizado puede aprobar o rechazar una reserva en menos de 1 minuto desde la operación del sistema, solo en clases donde fue seleccionado.
- **SC-005**: El superadmin puede consultar, modificar y auditar decisiones del dominio sin mezclar responsabilidades con el frontend ni con la capa de presentación.
- **SC-006**: El dominio de agenda mantiene integridad del calendario con cero conflictos de horario en las pruebas del flujo principal.

## Assumptions

- El servicio recibe la identidad del usuario autenticado desde capas superiores.
- El horario base del gimnasio se define por rango y disponibilidad del día y profesor.
- Las reglas de conflicto, duplicado y cupo se evalúan antes de confirmar la reserva.
- El administrador y el superadmin tienen permisos diferenciales y explícitos.
- El sistema usa MongoDB como almacenamiento persistente para slots, reservas y eventos.
- La capa de notificaciones se integra con el servicio de agenda mediante eventos o triggers de negocio.
- La validación de ventana de cancelación usa la zona horaria oficial del gimnasio/servidor.
