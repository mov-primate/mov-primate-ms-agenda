# Constitución del microservicio de agenda MovPrimate

## Principios fundamentales

### I. Gestión precisa de horarios
El servicio de agenda debe manejar reservas de 1 hora con exactitud, validando disponibilidad, evitando conflictos y preservando la integridad de los turnos. Debe distinguir claramente la identidad del alumno que solicita la sesión, el administrador que revisa la reserva y el superadmin que monitorea el sistema.

### II. Aprobación administrativa explícita
Las reservas no deben confirmarse automáticamente a menos que la regla de negocio lo autorice. La validación por parte del administrador debe ser explícita, auditable y restringida a roles autorizados.

### III. Propiedad del dominio
El servicio de agenda es responsable del ciclo de vida de la reserva, la disponibilidad, los conflictos, los estados y el historial de horarios. No debe asumir responsabilidades de marketing ni de perfiles de usuario, salvo los datos necesarios para validar la operación.

### IV. Integridad de contratos
El servicio debe exponer endpoints y eventos estables para validación, reasignación, cancelación y consulta de disponibilidad. Los contratos deben reflejar los roles y permisos implicados.

### V. Trazabilidad y tolerancia a fallos
Las operaciones de agendamiento deben ser rastreables, recuperables y fáciles de diagnosticar. Deben registrarse cambios de estado, validaciones y excepciones de negocio.

## Restricciones del producto

- Las sesiones tienen duración exacta de 1 hora
- Las reservas requieren estados claros y consistentes
- El flujo de aprobación del administrador es obligatorio
- El superadmin puede supervisar y actuar en caso de excepción
- El entorno local usa MongoDB a través de Docker
- Debe existir separación entre alumno, administrador/profesor y superadmin

## Flujo de trabajo de desarrollo

- Cada escenario de reserva debe definirse antes de implementarse.
- Deben capturarse casos límite como horarios solapados, cancelaciones, rechazos y bloques de tiempo.
- La validación mediante pruebas debe realizarse antes del despliegue.
- El servicio debe mantenerse alineado con la estrategia de Spec Kit del proyecto y con los permisos por rol.

## Gobernanza

Este servicio debe cumplir la constitución general de MovPrimate y no puede violar las reglas de agendamiento, la autoría por roles ni el flujo de validación administrativa.

**Versión**: 1.0.1 | **Ratificada**: 2026-11-03 | **Última modificación**: 2026-11-03