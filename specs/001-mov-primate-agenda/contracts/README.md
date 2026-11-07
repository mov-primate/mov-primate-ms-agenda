# Contracts: Microservicio de agenda

- GET /slots?date=YYYY-MM-DD&professorId={id}
- POST /bookings
- PATCH /bookings/{id}/move
- PATCH /bookings/{id}/approve
- PATCH /bookings/{id}/reject
- PATCH /bookings/{id}/cancel
- PATCH /bookings/{id}/attendance
- GET /superadmin/reports/attendance

Reglas:
- Reserva siempre de 1 hora.
- Alumno debe seleccionar professorId al reservar.
- Máximo 4 alumnos por slot/profesor.
- Slots completos (4) se bloquean o no se listan disponibles.
- Sin duplicados/solapes por alumno.
- Matriz de acciones:
  - Alumno: crear y cancelar reserva propia; no puede approve/reject; no puede move directo.
  - Admin: move/cancel/approve/reject solo en reservas con su professorId.
  - Superadmin: move/cancel/approve/reject en cualquier reserva.
- Cancelación: solo hasta 1 hora antes del inicio de la clase.
- Asistencia admin: attended/missed/justified.
