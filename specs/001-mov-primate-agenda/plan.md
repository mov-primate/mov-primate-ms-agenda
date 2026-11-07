# Implementation Plan: Microservicio de agenda y validación de reservas MovPrimate

**Branch**: `001-mov-primate-agenda` | **Date**: 2026-11-04 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-mov-primate-agenda/spec.md`

## Summary

El microservicio de agenda es el responsable de la disponibilidad, conflictos y validación de reservas. Debe garantizar que cada sesión sea de 1 hora, que cada clase tenga un máximo de 4 alumnos por horario/profesor, que el alumno seleccione profesor al reservar, que no existan duplicados ni solapamientos por usuario, y que las decisiones de aprobación o rechazo queden trazadas. El administrador solo puede modificar reservas de horarios donde fue seleccionado por el alumno, mientras que el superadmin puede modificar toda la agenda.

## Technical Context

**Language/Version**: TypeScript, NestJS 12 (microservice pattern)

**Primary Dependencies**: NestJS microservice, MongoDB, message/event bus, domain validation logic

**Storage**: MongoDB for slots, bookings, status transitions, and audit events

**Testing**: Unit tests for slot conflict logic, integration tests for booking lifecycle, concurrency validation

**Target Platform**: Backend microservice for scheduling domain, deployed locally with Docker Compose and target AWS architecture

**Project Type**: Microservice

**Performance Goals**: Validate booking conflicts quickly and consistently under pressure; keep reads and writes for slots highly reliable

**Constraints**:
- Only the agenda service owns scheduling rules
- No duplicate or overlapping reservations for the same student
- Class capacity is limited to 4 students per slot/professor
- A student must select a professor when booking
- Full-capacity slots are returned as unavailable (`available=false`, `reason=capacity_full`)
- Approval/rejection must only happen with authorized admin role
- Admin can only modify bookings where they were selected
- Superadmin can modify any booking or slot but does not bypass conflict/capacity rules
- Action-level RBAC must be explicit for move, cancel, approve and reject operations
- Cancellation window is limited to 1 hour before class start using gimnasio/server timezone
- Concurrency for last-capacity booking uses atomic transaction + unique index strategy
- Agenda is source of truth for booking acceptance; BFF must compensate on conflict/capacity rejection

**Scale/Scope**:
- Slot generation and date availability
- Reservation lifecycle from pendiente to confirmado/rechazado/cancelado
- Per-slot capacity tracking (max 4 students)
- Professor assignment per booking
- Action matrix by role (allowed/forbidden for move, cancel, approve, reject)
- Conflict detection and historical audit
- Event publication for notifications and downstream systems
- Attendance tracking and superadmin attendance aggregates

## Constitution Check

*GATE: Must pass before implementation.*

- Scheduling integrity remains within agenda service: PASS
- Student role defaults to new users, but superadmin may reassign roles: PASS
- User role exists as initial identity state before student/admin assignment: PASS
- Conflict and duplicate prevention is mandatory: PASS
- Capacity limit (4) and full-slot blocking is mandatory: PASS
- Admin scope is restricted to selected-professor bookings: PASS
- Admin validation is explicit and permissioned: PASS
- Business rules remain separate from frontend and BFF concerns: PASS

## Project Structure

### Documentation (this feature)

```text
specs/001-mov-primate-agenda/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── booking/
├── domain/
├── events/
├── slots/
├── validation/
├── audit/
└── shared/

tests/
├── unit/
├── integration/
└── contract/
```

**Structure Decision**: The service will center on slot and reservation domain logic, with explicit validation and audit modules to keep the business rules deterministic and testable.

## Complexity Tracking

No constitutional violations were identified, so no complexity exceptions are required.
