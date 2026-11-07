import { RoleEnum } from '../../src/shared/enums';
import { RbacValidator } from '../../src/validation/rbac.validator';
import { BookingUnauthorizedException } from '../../src/shared/exceptions/booking.exceptions';
import { Types } from 'mongoose';

describe('RBAC Security Tests (T032)', () => {
  const validator = new RbacValidator();

  describe('Alumno restrictions', () => {
    it('should deny alumno from approve', () => {
      expect(() => validator.validateAction(RoleEnum.ALUMNO, 'approve')).toThrow(BookingUnauthorizedException);
    });
    it('should deny alumno from reject', () => {
      expect(() => validator.validateAction(RoleEnum.ALUMNO, 'reject')).toThrow(BookingUnauthorizedException);
    });
    it('should deny alumno from move', () => {
      expect(() => validator.validateAction(RoleEnum.ALUMNO, 'move')).toThrow(BookingUnauthorizedException);
    });
    it('should deny alumno from update_attendance', () => {
      expect(() => validator.validateAction(RoleEnum.ALUMNO, 'update_attendance')).toThrow(BookingUnauthorizedException);
    });
  });

  describe('Admin cross-professor restriction (T019, T032)', () => {
    it('should deny admin modifying another professors booking', () => {
      const adminId = new Types.ObjectId();
      const otherProfessorId = new Types.ObjectId();
      expect(() => validator.validateAdminScope(RoleEnum.ADMIN, adminId, otherProfessorId)).toThrow(BookingUnauthorizedException);
    });
    it('should allow admin modifying own booking scope', () => {
      const adminId = new Types.ObjectId();
      expect(() => validator.validateAdminScope(RoleEnum.ADMIN, adminId, adminId)).not.toThrow();
    });
  });

  describe('Superadmin full access (T032)', () => {
    it('should allow superadmin approve', () => {
      expect(() => validator.validateAction(RoleEnum.SUPERADMIN, 'approve')).not.toThrow();
    });
    it('should allow superadmin move', () => {
      expect(() => validator.validateAction(RoleEnum.SUPERADMIN, 'move')).not.toThrow();
    });
    it('should allow superadmin on any booking scope', () => {
      const superadminId = new Types.ObjectId();
      const anyProfessorId = new Types.ObjectId();
      expect(() => validator.validateAdminScope(RoleEnum.SUPERADMIN, superadminId, anyProfessorId)).not.toThrow();
    });
  });
});
