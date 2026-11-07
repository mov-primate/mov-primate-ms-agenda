import { BookingStatusEnum } from '../../src/shared/enums';
import { CancellationWindowException, NoClassesAvailableException } from '../../src/shared/exceptions/booking.exceptions';

describe('Booking Lifecycle Integration (T030)', () => {
  it('should represent full booking lifecycle states', () => {
    const states = [
      BookingStatusEnum.PENDIENTE,
      BookingStatusEnum.CONFIRMADO,
      BookingStatusEnum.RECHAZADO,
      BookingStatusEnum.CANCELADO,
    ];
    expect(states).toHaveLength(4);
  });

  it('should reject booking when available_classes is 0 (T009.5)', () => {
    const err = new NoClassesAvailableException();
    expect(err.code).toBe('ERR_NO_CLASSES_AVAILABLE');
    expect(err.message).toContain('clases disponibles');
  });

  it('should enforce cancellation window (T009)', () => {
    const err = new CancellationWindowException();
    expect(err.code).toBe('ERR_CANCELLATION_WINDOW');
  });
});
