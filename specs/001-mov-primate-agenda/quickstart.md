# Quickstart: Microservicio de agenda

1. Levantar MongoDB y servicio agenda.
2. Consultar slots disponibles por fecha, hora y profesor.
3. Crear reserva de 1 hora seleccionando profesor (admin).
4. Crear reservas hasta completar 4 alumnos y validar bloqueo/no disponibilidad del slot.
5. Intentar duplicado y solapamiento del mismo alumno para validar rechazo.
6. Aprobar/rechazar como admin en reservas donde fue seleccionado.
7. Intentar modificar reserva de otro profesor como admin y validar denegación.
8. Modificar cualquier reserva como superadmin y validar trazabilidad.
9. Intentar aprobar/rechazar y mover slot como alumno y validar denegación.
10. Mover slot como admin en reserva propia (permitido) y en reserva de otro profesor (denegado).
11. Intentar cancelar dentro de 1 hora y validar denegación.
12. Registrar asistencia como admin (asistió/no asistió/justificó ausencia).
