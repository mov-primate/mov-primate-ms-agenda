# Research: Microservicio de agenda

## Decisiones clave

1. Agenda es dueño de slots, conflictos y estados de reserva.
2. Duración fija: 1 hora.
3. Cada clase tiene cupo máximo de 4 alumnos por horario/profesor.
4. El alumno debe seleccionar profesor (usuario administrador) al reservar.
5. Aprobación/rechazo requiere rol administrador autorizado y alcance sobre la clase seleccionada.
6. El administrador solo modifica reservas donde fue seleccionado por el alumno.
7. El superadmin puede modificar cualquier reserva u horario.
8. Cambios de rol vienen de servicios de identidad y se respetan por permisos.
9. Matriz explícita por acción:
   - Alumno: crear/cancelar propia reserva; no puede aprobar/rechazar ni mover slot directamente.
   - Administrador: aprobar/rechazar/cancelar/mover solo reservas donde fue seleccionado.
   - Superadmin: aprobar/rechazar/cancelar/mover en cualquier reserva.
10. La cancelación se permite hasta 1 hora antes del inicio de clase.
11. Admin registra asistencia: asistió/no asistió/justificó ausencia.
12. Agenda emite eventos de estado/asistencia para notificaciones por correo.

## Resultado

Reglas de agenda determinísticas, auditables y desacopladas del frontend, con control de cupos, selección de profesor y alcance explícito por rol y por acción.
