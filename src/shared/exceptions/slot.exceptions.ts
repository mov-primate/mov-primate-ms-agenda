export class SlotNotFoundException extends Error {
  code = 'ERR_SLOT_NOT_FOUND';
  statusCode = 404;
  constructor(message = 'Slot no encontrado') {
    super(message);
    this.name = 'SlotNotFoundException';
  }
}

export class SlotBlockedException extends Error {
  code = 'ERR_SLOT_BLOCKED';
  statusCode = 422;
  constructor(message = 'El slot está bloqueado') {
    super(message);
    this.name = 'SlotBlockedException';
  }
}
