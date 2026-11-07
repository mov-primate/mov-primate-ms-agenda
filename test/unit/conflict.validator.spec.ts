import { Types } from 'mongoose';
import { ConflictValidator } from '../../src/validation/conflict.validator';
import { BookingConflictException } from '../../src/shared/exceptions/booking.exceptions';

describe('ConflictValidator (T008)', () => {
  let validator: ConflictValidator;
  let mockBookingRepository: any;

  beforeEach(() => {
    mockBookingRepository = {
      findByStudentAndSlot: jest.fn(),
      findOverlappingBookings: jest.fn(),
    };
    validator = new ConflictValidator(mockBookingRepository);
  });

  it('should throw BookingConflictException on duplicate slot', async () => {
    const studentId = new Types.ObjectId();
    const slotId = new Types.ObjectId();
    mockBookingRepository.findByStudentAndSlot.mockResolvedValue({ _id: slotId });

    await expect(
      validator.validateNoConflict(studentId, new Date(), new Date(), slotId),
    ).rejects.toThrow(BookingConflictException);
  });

  it('should throw BookingConflictException on time overlap', async () => {
    const studentId = new Types.ObjectId();
    const slotId = new Types.ObjectId();
    mockBookingRepository.findByStudentAndSlot.mockResolvedValue(null);
    mockBookingRepository.findOverlappingBookings.mockResolvedValue([{ _id: new Types.ObjectId() }]);

    await expect(
      validator.validateNoConflict(studentId, new Date(), new Date(), slotId),
    ).rejects.toThrow(BookingConflictException);
  });

  it('should pass validation when no conflict', async () => {
    const studentId = new Types.ObjectId();
    const slotId = new Types.ObjectId();
    mockBookingRepository.findByStudentAndSlot.mockResolvedValue(null);
    mockBookingRepository.findOverlappingBookings.mockResolvedValue([]);

    await expect(
      validator.validateNoConflict(studentId, new Date(), new Date(), slotId),
    ).resolves.not.toThrow();
  });
});
