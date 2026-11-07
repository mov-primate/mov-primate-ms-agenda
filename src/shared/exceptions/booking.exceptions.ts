export class BookingConflictException extends Error {
  code = 'ERR_BOOKING_CONFLICT';
  statusCode = 409;
  constructor(message = 'Reserva duplicada o con solapamiento de horario') {
    super(message);
    this.name = 'BookingConflictException';
  }
}

export class CapacityFullException extends Error {
  code = 'ERR_CAPACITY_FULL';
  statusCode = 409;
  constructor(message = 'El slot está lleno (máximo 4 alumnos)') {
    super(message);
    this.name = 'CapacityFullException';
  }
}

export class CancellationWindowException extends Error {
  code = 'ERR_CANCELLATION_WINDOW';
  statusCode = 422;
  constructor(message = 'La cancelación no está permitida con menos de 1 hora de anticipación') {
    super(message);
    this.name = 'CancellationWindowException';
  }
}

export class NoClassesAvailableException extends Error {
  code = 'ERR_NO_CLASSES_AVAILABLE';
  statusCode = 422;
  constructor(message = 'El alumno no tiene clases disponibles') {
    super(message);
    this.name = 'NoClassesAvailableException';
  }
}

export class BookingUnauthorizedException extends Error {
  code = 'ERR_UNAUTHORIZED';
  statusCode = 403;
  constructor(message = 'No autorizado para esta operación de reserva') {
    super(message);
    this.name = 'BookingUnauthorizedException';
  }
}
