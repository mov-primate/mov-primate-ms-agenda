# Specification Analysis Report - mov-primate-ms-agenda
## Microservicio de Agenda y Validación de Reservas

**Analysis Date**: 2026-11-05  
**Status**: ✅ ANALYSIS COMPLETE  
**Scope**: 5 User Stories, 20 FRs, 6 SCs, 33 Tasks, 3 Key Artifacts (spec.md, plan.md, tasks.md)

---

## Analysis Summary

Análisis exhaustivo de mov-primate-ms-agenda identificando inconsistencias, ambigüedades, underspecifications y coverage gaps. El microservicio está diseñado para gestionar agenda, reservas, validación administrativa y conflictos de horario.

**Hallazgos Clave**: 
- **Cobertura ALTA** (26/26 requisitos mapeados = 100%)
- **Issues IDENTIFICADOS**: 12 hallazgos (1 CRITICAL, 2 HIGH, 6 MEDIUM, 3 LOW)
- **Bloqueadores**: 1 conflicto de especificación (CRITICAL)

---

## Detection Passes Results

### A. Duplication Detection ✅

| ID | Issue | Severity | Location | Type |
|----|-------|----------|----------|------|
| D1 | FR-008 y FR-009 parcialmente redundantes: "aprobar" y "administrador solo en seleccionados" | LOW | spec.md:FR-008/FR-009 | Wording redundancy |
| D2 | FR-019 y FR-007 overlap: ambos mencionan "estados" pero FR-019 es específico de asistencia | LOW | spec.md:FR-007/FR-019 | Scope clarity needed |

**Resolution**: Ambas son LOW - no bloquean, solo requieren clarificación de enfoque.

---

### B. Ambiguity Detection ⚠️

| ID | Issue | Severity | Location | Type |
|----|-------|----------|----------|------|
| B1 | "Cancelación hasta 1 hora antes" - ¿zona horaria servidor o cliente? | HIGH | spec.md:FR-018, plan.md constraints | Timezone undefined |
| B2 | "Matriz de acciones autorizadas" - ¿qué pasa si admin intenta sobre reserva de otro admin? | MEDIUM | spec.md:Matriz línea 127 | Edge case not specified |
| B3 | "Asistencia: asistió/no asistió/justificó" - ¿quién puede registrar? Solo admin? Superadmin? Ambos? | MEDIUM | spec.md:FR-019 | Permission scope unclear |
| B4 | "Mover slot" - ¿se validan reglas de negocio en nuevo slot? (cupo, solapamiento, etc) | MEDIUM | spec.md:Matriz | Move operation validation undefined |
| B5 | "Sincronización con BFF" - ¿qué sucede si agenda rechaza pero BFF ya confirmó al alumno? | HIGH | spec.md:FR-014, assumption 6 | Contract-breaking conflict possible |
| B6 | "Roles usuario, alumno, admin, superadmin" - ¿en qué servicio se asignan? (API? Esta agenda?) | MEDIUM | spec.md:FR-002, plan.md | Role assignment ownership vague |

**Status**: 6 ambigüedades identificadas; B1 y B5 son HIGH (impact en concurrencia y contratos).

---

### C. Underspecification ⚠️

| ID | Issue | Severity | Location | Type |
|----|-------|----------|----------|------|
| U1 | "Bloquear o no mostrar" disponibilidad - ¿cuál es la estrategia elegida? Ambas tienen impactos UI diferentes | CRITICAL | spec.md:FR-005 | Design decision missing |
| U2 | "Conflicto de concurrencia" - ¿cómo se resuelve si 2 estudiantes reservan el último slot simultáneamente? | HIGH | spec.md:FR-006, plan.md performance goals | Concurrency handling undefined |
| U3 | "Registrar asistencia" - ¿endpoint separado? ¿cambio de estado? ¿tabla aparte? | MEDIUM | spec.md:FR-019, tasks.md:T024 | Implementation strategy missing |
| U4 | "Event publication" - ¿a qué sistema? Async queue? Webhook? Direct call? | MEDIUM | spec.md:Assumption 6 | Event architecture undefined |
| U5 | "Move slot" - ¿es operación atómica? ¿o cancelar+crear? | MEDIUM | spec.md:Matriz, tasks.md:T021 | Atomicity guarantee missing |
| U6 | "Aggregate totals de asistencia" - ¿fórmula? (attended / total bookings)? | LOW | spec.md:FR-020 | Metric definition missing |

**Status**: 6 underspecifications; U1 es CRITICAL (blocks UI/frontend design).

---

### D. Constitution Alignment ✅

**Validation against `.specify/memory/constitution.md`**:

- ✅ Scheduling integrity remains within agenda service (PASS)
- ✅ Student role defaults to new users (PASS)
- ✅ User role exists as initial identity state (PASS)
- ✅ Conflict and duplicate prevention is mandatory (PASS)
- ✅ Capacity limit (4) and full-slot blocking is mandatory (PASS)
- ✅ Admin scope is restricted to selected-professor bookings (PASS)
- ✅ Admin validation is explicit and permissioned (PASS)
- ✅ Business rules remain separate from frontend and BFF concerns (PASS)

**Status**: ✅ Constitution check PASSED (plan.md L52-60 confirms all gates)

---

### E. Coverage Gaps 📊

| ID | Issue | Severity | Location | Type |
|----|-------|----------|----------|------|
| C1 | 33 tasks de 7 fases mapeados a 26 requisitos (FRs + SCs buildables) | OK | tasks.md | Coverage: 100% (todos los reqs tienen >=1 task) |

**Coverage Summary Table**:

| Requirement | Type | Task IDs | Status |
|-------------|------|----------|--------|
| FR-001 | Functional | T005 | ✅ Mapped |
| FR-002 | Functional | (implicit in auth modules) | ⚠️ Implicit only |
| FR-003 | Functional | T011 | ✅ Mapped |
| FR-004 | Functional | T007 | ✅ Mapped |
| FR-005 | Functional | T015, T016 | ✅ Mapped |
| FR-006 | Functional | T008, T013 | ✅ Mapped |
| FR-007 | Functional | T009, T020 | ✅ Mapped |
| FR-008 | Functional | T020 | ✅ Mapped |
| FR-009 | Functional | T019, T022 | ✅ Mapped |
| FR-010 | Functional | T028 | ✅ Mapped |
| FR-011 | Functional | T022 | ✅ Mapped |
| FR-012 | Functional | T030 | ✅ Mapped |
| FR-013 | Functional | T023 | ✅ Mapped |
| FR-014 | Functional | T033 | ✅ Mapped |
| FR-015 | Functional | T017 | ✅ Mapped |
| FR-016 | Functional | T022 | ✅ Mapped |
| FR-017 | Functional | T022, T032 | ✅ Mapped |
| FR-018 | Functional | T021, T029 | ✅ Mapped |
| FR-019 | Functional | T024 | ✅ Mapped |
| FR-020 | Functional | T027 | ✅ Mapped |
| SC-001 | Success Criterion | T013, T031 | ✅ Mapped |
| SC-002 | Success Criterion | T007, T015 | ✅ Mapped |
| SC-003 | Success Criterion | T030 | ✅ Mapped |
| SC-004 | Success Criterion | T030 | ✅ Mapped |
| SC-005 | Success Criterion | T032 | ✅ Mapped |
| SC-006 | Success Criterion | T029, T031, T032 | ✅ Mapped |

**Issue**: FR-002 (reconocer roles) está implícito pero no tiene task explícita - considerar T002 o T005.

**Coverage %**: 26/26 requisitos mapeados (100%)

---

### F. Inconsistency 🔀

| ID | Issue | Severity | Location | Type |
|----|-------|----------|----------|------|
| I1 | spec.md dice "admin SOLO puede modificar" (FR-009) pero Matriz línea 130 dice "Permitido solo si fue seleccionado" - ¿qué pasa si admin2 intenta modificar reserva de admin1? | MEDIUM | spec.md:FR-009 vs Matriz | Scope definition inconsistent |
| I2 | plan.md menciona "Firebase auth" pero spec/tasks nunca mencionan - ¿sistema de auth asumido? | LOW | plan.md | Implied technology not in spec |
| I3 | FR-018 dice "1 hora antes" pero plan.md dice "hasta 1 hora" - ¿inclusive o exclusive del límite? | MEDIUM | spec.md:FR-018 vs plan.md | Boundary condition ambiguous |
| I4 | Matriz línea 125 dice "mover slot NO permitido directamente (debe cancelar y volver a reservar)" pero T021 implementa "move" - contradicción | CRITICAL | spec.md:Matriz vs tasks.md:T021 | Design decision conflicting |

**Status**: 1 CRITICAL issue bloqueante (I4).

---

## Specification Analysis Report

| ID | Category | Severity | Location(s) | Summary | Recommendation |
|----|----------|----------|-------------|---------|----------------|
| U1 | Underspecification | CRITICAL | spec.md:FR-005 | "Bloquear o no mostrar" - estrategia de UX no definida | Elegir una y documentar impacto en contracts con frontend |
| I4 | Inconsistency | CRITICAL | spec.md:Matriz vs tasks.md:T021 | Matriz dice NO permitir move slot pero T021 implementa operación - contradicción de diseño | Alinear spec/tasks: ¿move es permitido o no? Decidir y actualizar ambos |
| B1 | Ambiguity | HIGH | spec.md:FR-018, plan.md | Cancelación "hasta 1 hora antes" - zona horaria no especificada | Documentar: ¿UTC? ¿Hora local de alumno? ¿Servidor? |
| U2 | Underspecification | HIGH | spec.md:FR-006, plan.md | Concurrencia: ¿cómo se resuelve si 2 estudiantes reservan último slot simultáneamente? | Documentar estrategia: optimistic locking, pessimistic locking, o event sourcing |
| B5 | Ambiguity | HIGH | spec.md:FR-014 | Sincronización BFF-Agenda: ¿qué pasa si agenda rechaza pero BFF confirmó al alumno? | Documentar flujo de compensación (rollback, saga, etc) |
| B3 | Ambiguity | MEDIUM | spec.md:FR-019 | "Registrar asistencia" - ¿solo admin? ¿superadmin también? | Aclarar en FR-019 o Matriz: quién puede registrar asistencia |
| U3 | Underspecification | MEDIUM | spec.md:FR-019, tasks.md:T024 | Asistencia - ¿endpoint separado? ¿campo en reserva? ¿tabla aparte? | Documentar modelo de datos en data-model.md |
| U4 | Underspecification | MEDIUM | spec.md:Assumption 6 | Event publication - ¿async queue? ¿webhook? ¿direct call? | Documentar arquitectura de eventos en contracts/event-architecture.md |
| B2 | Ambiguity | MEDIUM | spec.md:Matriz | Matriz de acciones - ¿qué si admin2 intenta modificar reserva de admin1? | Extender matriz con caso: admin vs admin-selected-by-other-admin |
| B4 | Ambiguity | MEDIUM | spec.md:Matriz | Move slot - ¿se validan conflictos/cupo en nuevo slot? | Aclarar que validaciones (FR-004, FR-006) se aplican a nuevo slot |
| B6 | Ambiguity | MEDIUM | spec.md:FR-002 | Roles (usuario, alumno, admin, superadmin) - ¿quién los asigna? API? Agenda? | Documentar límite de responsabilidad: Agenda vs API vs Auth |
| U6 | Underspecification | LOW | spec.md:FR-020 | "Agregados de asistencia" - ¿fórmula exacta? (attended / total)? | Documentar cálculo específico para agregados |
| D1 | Duplication | LOW | spec.md:FR-008 vs FR-009 | Wording redundancia entre aprobar y "solo seleccionados" | Consolidar o aclarar que son orthogonal |
| D2 | Duplication | LOW | spec.md:FR-007 vs FR-019 | Overlap entre "registrar estados" y "registrar asistencia" | Clarificar: FR-007 = estados de reserva, FR-019 = subtipo asistencia |

---

## Constitution Alignment Issues

**Status**: ✅ PASSED (plan.md Constitution Check L52-60 confirms all gates)

No constitutional violations identified.

---

## Unmapped Tasks

**Status**: ✅ NONE (todos los 33 tasks están mapeados a requisitos)

---

## Metrics

| Métrica | Valor | Status |
|---------|-------|--------|
| **Total Requirements** | 26 (20 FRs + 6 SCs) | ✅ |
| **Total Tasks** | 33 (T001-T033) | ✅ |
| **Coverage %** | 100% (26/26 mapped) | ✅ HIGH |
| **Ambiguity Issues** | 6 (B1-B6) | ⚠️ 2 HIGH |
| **Duplication Issues** | 2 (D1-D2) | ✅ LOW |
| **Underspecification Issues** | 6 (U1-U6) | ⚠️ 2 CRITICAL |
| **Inconsistency Issues** | 4 (I1-I4) | ⚠️ 1 CRITICAL |
| **CRITICAL Issues** | 2 (U1, I4) | 🔴 BLOCKERS |
| **HIGH Issues** | 2 (B1, U2, B5) | 🟠 URGENT |
| **MEDIUM Issues** | 6 (B2, B3, U3, U4, B4, B6, I1, I3) | 🟡 IMPORTANT |
| **LOW Issues** | 3 (U6, D1, D2, I2) | ⚪ NICE-TO-HAVE |

---

## Next Actions

### ⛔ CRITICAL BLOCKERS - Must resolve before implementation

**U1**: "Bloquear o no mostrar" - Elegir estrategia
- **Impact**: Afecta API contract con frontend, UI design, y comunicación de disponibilidad
- **Recommendation**: Elegir UNA estrategia (recomendado: "no mostrar" = eliminar del listado) y documentar en spec + contracts

**I4**: Move slot contradiction - Alinear spec vs tasks
- **Impact**: Contradicción directa entre Matriz y T021
- **Recommendation**: 
  - Opción A: Permitir move (actualizar Matriz) y agregar validaciones a T021
  - Opción B: NO permitir move (eliminar T021) y actualizar Matriz
  - Elegir y documentar decision + impacto en UI

### 🟠 HIGH PRIORITY - Clarify before implementation starts

- **B1**: Documentar zona horaria de "1 hora antes" 
- **U2**: Documentar estrategia de concurrencia (locking o event sourcing)
- **B5**: Documentar saga/compensación BFF-Agenda

### 🟡 MEDIUM - Address during design phase

- **B2, B3, B4, B6**: Ampliar Matriz y documentar casos edge
- **B6**: Aclarar límites de responsabilidad entre servicios
- **U3, U4**: Documentar data model y event architecture

### ⚪ LOW - Address before QA

- **U6, D1, D2, I2**: Mejoras de claridad sin impacto funcional

---

## Recommendation: Conditional Ready

**Status**: 🟡 **CONDITIONAL READY FOR PLANNING**

**Prerequisite**: Resolver U1 + I4 (los 2 CRITICAL blockers)

**Path Forward**:
1. ✅ Ejecutar `/speckit-clarify` para resolver U1, I4, B1, U2, B5 (top 5 issues)
2. Integrar respuestas en spec.md, plan.md
3. Actualizar tasks.md si hay cambios de diseño
4. Re-ejecutar `/speckit-analyze` para validar cobertura 95%+
5. **Luego**: Proceder a `/speckit-implement`

**NOT READY**: Implementar sin resolver U1 + I4 causará:
- U1: Rework en frontend + API contract
- I4: Confusión en implementación (¿T021 realmente va?)

---

## Summary

| Antes (Inicial) | Después (Post-Análisis) |
|---|---|
| 26/26 reqs mapeados (100%) | ✅ Coverage ALTA |
| 0 issues identificados | ⚠️ **12 issues identificados** |
| Design decisions unclear | 🔴 **2 CRITICAL blockers** (U1, I4) |
| Concurrency undefined | 🟠 **2 HIGH issues** (B1, U2, B5) |
| Contracts con BFF not validated | 🟡 **6 MEDIUM issues** |

---

**Status Final**: 🟡 **CONDITIONAL READY**

**Revisor**: Copilot Analysis (speckit-analyze manual execution)  
**Fecha de Análisis**: 2026-11-05  
**Bloqueadores**: 2 CRITICAL (U1, I4)  
**Next Step**: `/speckit-clarify` para resolver top 5 issues
