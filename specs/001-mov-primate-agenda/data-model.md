# Data Model: Microservicio de agenda

- Slot: id, date, startAt, endAt, professorId, capacityMax, capacityUsed, isAvailable, isBlocked
- Booking: id, studentId, professorId, slotId, status, createdAt
- Attendance: bookingId, studentId, status (attended|missed|justified), updatedBy, updatedAt
- DecisionEvent: id, bookingId, action, actorId, actorRole, timestamp, reason
- AuthorizationRule: role, action, scope, allowed

Reglas:
- Booking.status inicia en pendiente.
- Estados permitidos: pendiente, confirmado, rechazado, cancelado.
- Cada Slot tiene capacityMax=4.
- Si capacityUsed=4, el Slot se bloquea o no se expone como disponible.
- No se permite duplicado ni solapamiento para el mismo studentId.
- Un administrador solo puede modificar reservas de slots donde professorId coincide con su usuario.
- Acciones auditadas: move_slot, cancel, approve, reject.
- move_slot por alumno no es directo; se resuelve como cancel + nueva reserva.
- Cancelación válida solo si startAt - now >= 1 hora.
