# Requirements Quality Checklist: Microservicio de agenda y validación de reservas

**Purpose**: Revisar la calidad del dominio de agenda para horarios, conflictos, validación y trazabilidad.
**Created**: 2026-11-04
**Feature**: [spec.md](./spec.md)

## Dominio y disponibilidad

- [ ] CHK001 El servicio expone disponibilidad de slots de 1 hora para alumnos por fecha, hora y profesor.
- [ ] CHK002 Cada reserva exige selección explícita de profesor (usuario administrador).
- [ ] CHK003 Se respeta cupo máximo de 4 alumnos por clase/horario/profesor.
- [ ] CHK004 Los horarios con cupo completo (4) se bloquean o no aparecen disponibles.
- [ ] CHK005 Se impiden duplicados y solapamientos para un mismo usuario alumno.
- [ ] CHK006 Cada reserva mantiene estados claros: pendiente, confirmado, rechazado y cancelado.
- [ ] CHK007 Se respeta ventana de cancelación: hasta 1 hora antes del inicio.

## Seguridad y permisos

- [ ] CHK008 La validación por administrador solo es posible con permisos específicos.
- [ ] CHK009 El administrador solo modifica reservas en horarios donde fue seleccionado por el alumno.
- [ ] CHK010 El superadmin puede modificar cualquier reserva u horario del sistema.
- [ ] CHK011 El cambio de rol del usuario no invalida la lógica de conflictos ni de cupo del calendario.
- [ ] CHK012 Existe una matriz explícita de acciones permitidas/prohibidas por rol para mover slot, cancelar, aprobar y rechazar.
- [ ] CHK013 Un alumno no puede aprobar/rechazar ni mover slot directamente.
- [ ] CHK014 El administrador no puede mover/cancelar/aprobar/rechazar reservas de otro profesor.
- [ ] CHK015 El superadmin puede ejecutar mover/cancelar/aprobar/rechazar en cualquier reserva.
- [ ] CHK016 El administrador puede registrar asistencia: asistió/no asistió/justificó ausencia.

## Trazabilidad

- [ ] CHK017 Cada decisión de aprobación, rechazo, cancelación o movimiento queda registrada.
- [ ] CHK018 Se conserva historial de estado y registros de validación por reserva.
- [ ] CHK019 Los eventos de reserva se emiten para notificaciones y operaciones posteriores.

## Operabilidad

- [ ] CHK020 El servicio es compatible con MongoDB y Docker Compose.
- [ ] CHK021 El flujo se mantiene sin depender de WhatsApp ni coordinación externa.
- [ ] CHK022 La solución se integra correctamente con BFF, API y frontend por contrato.
- [ ] CHK023 Existen agregados para panel superadmin con total de asistencias por alumno.
