# Tasks: Microservicio de agenda y validación de reservas

**Input**: Design documents from `/specs/001-mov-primate-agenda/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Phase 1: Setup

- [x] T001 Initialize NestJS microservice and base project structure
- [x] T002 Configure MongoDB connection and repository patterns
- [x] T003 [P] Define slot, booking, professor-assignment, and class-capacity domain models
- [x] T004 [P] Configure validation and business error types

## Phase 2: Foundational

- [x] T005 Implement slot availability query logic by date/time/professor returning full slots as `available=false` with reason `capacity_full`
- [x] T006 Implement role recognition and RBAC base (usuario/alumno/admin/superadmin) and reservation creation workflow with required professor selection
- [x] T007 Implement per-class capacity rule (max 4 students per slot/professor)
- [x] T008 Implement duplicate and overlap detection rules per student using atomic transaction + unique index strategy
- [x] T009 Implement status transition validation (pendiente, confirmado, rechazado, cancelado)
- [x] T009.5 [FR-021] Implement available_classes validation: before confirming reservation, query alumno service; if available_classes = 0, reject with ERR_NO_CLASSES_AVAILABLE

## Phase 3: User Story 1 - Student booking request (Priority: P1)

- [x] T010 [P] [US1] Implement reservation request handling for authenticated students
- [x] T011 [US1] Require student to select professor (admin user) during booking
- [x] T012 [US1] Create pending reservation in the agenda store
- [x] T013 [US1] Reject duplicate or overlapping requests for the same student

## Phase 4: User Story 2 - Conflict detection (Priority: P1)

- [x] T014 [P] [US2] Implement slot conflict evaluation for 1-hour sessions
- [x] T015 [US2] Mark slots with full capacity (4 students) as unavailable (`available=false`, `reason=capacity_full`)
- [x] T016 [US2] Validate blocked or unavailable slots
- [x] T017 [US2] Return business-conflict and capacity errors with clear messages and compensation-friendly error codes for BFF

## Phase 5: User Story 3 - Admin validation (Priority: P1)

- [x] T018 [P] [US3] Implement pending reservation list for authorized admin
- [x] T019 [US3] Scope admin view and updates only to bookings where admin was selected by the student
- [x] T020 [US3] Implement approve/reject state transitions
- [x] T021 [US3] Implement cancel and direct move-slot operations for admin-scoped bookings with conflict/capacity/permission validation
- [x] T022 [US3] Enforce permission and scope checks on approve/reject/cancel/move requests
- [x] T023 [US3] Emit audit events for every decision
- [x] T024 [US3] Implement attendance status update for admin/superadmin: asistió/no asistió/justificó ausencia

## Phase 6: User Story 4 - Superadmin oversight (Priority: P1)

- [x] T025 [P] [US4] Implement global operational view for superadmin
- [x] T026 [US4] Expose exception, conflict, and full-capacity summaries
- [x] T027 [US4] Expose aggregate totals of attended classes per student
- [x] T028 [US4] Allow superadmin to move/cancel/approve/reject any booking or slot with full audit trail

## Phase 7: Final validation

- [x] T029 [P] Unit tests for slot conflict, capacity, and cancellation-window logic using gimnasio/server timezone
- [x] T030 Integration tests for booking lifecycle, attendance, and admin-scope validation
- [x] T031 Concurrency tests for simultaneous booking requests up to and beyond capacity validating atomic transaction behavior
- [x] T032 Security tests for:
  - admin cross-professor modification denial,
  - alumno approve/reject/move denial,
  - superadmin full access to move/cancel/approve/reject
- [x] T033 Quickstart and operational validation
