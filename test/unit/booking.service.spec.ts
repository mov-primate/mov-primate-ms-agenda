import { Types } from 'mongoose';
import { RoleEnum } from '../../src/shared/enums';
import { CancellationWindowException, NoClassesAvailableException, BookingUnauthorizedException } from '../../src/shared/exceptions/booking.exceptions';
import { CancellationValidator } from '../../src/validation/cancellation.validator';
import { RbacValidator } from '../../src/validation/rbac.validator';

describe('CancellationValidator (T009)', () => {
  const validator = new CancellationValidator();

  it('should throw when cancelling within 1 hour', () => {
    const startAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min from now
    expect(() => validator.validateWindow(startAt)).toThrow(CancellationWindowException);
  });

  it('should pass when cancelling more than 1 hour before', () => {
    const startAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now
    expect(() => validator.validateWindow(startAt)).not.toThrow();
  });
});

describe('RbacValidator (T006, T022)', () => {
  const validator = new RbacValidator();

  it('should deny alumno from approving', () => {
    expect(() => validator.validateAction(RoleEnum.ALUMNO, 'approve')).toThrow(BookingUnauthorizedException);
  });

  it('should deny alumno from rejecting', () => {
    expect(() => validator.validateAction(RoleEnum.ALUMNO, 'reject')).toThrow(BookingUnauthorizedException);
  });

  it('should deny alumno from moving slot', () => {
    expect(() => validator.validateAction(RoleEnum.ALUMNO, 'move')).toThrow(BookingUnauthorizedException);
  });

  it('should allow admin to approve', () => {
    expect(() => validator.validateAction(RoleEnum.ADMIN, 'approve')).not.toThrow();
  });

  it('should deny admin acting on another professor booking', () => {
    const adminId = new Types.ObjectId();
    const otherProfessorId = new Types.ObjectId();
    expect(() => validator.validateAdminScope(RoleEnum.ADMIN, adminId, otherProfessorId)).toThrow(BookingUnauthorizedException);
  });

  it('should allow admin acting on own booking', () => {
    const adminId = new Types.ObjectId();
    expect(() => validator.validateAdminScope(RoleEnum.ADMIN, adminId, adminId)).not.toThrow();
  });

  it('should allow superadmin to act on any booking', () => {
    const superadminId = new Types.ObjectId();
    const otherProfessorId = new Types.ObjectId();
    expect(() => validator.validateAdminScope(RoleEnum.SUPERADMIN, superadminId, otherProfessorId)).not.toThrow();
  });
});

describe('NoClassesAvailableException (T009.5/FR-021)', () => {
  it('should have correct error code', () => {
    const err = new NoClassesAvailableException();
    expect(err.code).toBe('ERR_NO_CLASSES_AVAILABLE');
    expect(err.statusCode).toBe(422);
  });
});
