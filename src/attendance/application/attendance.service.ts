import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { AttendanceRepository } from '../infrastructure/attendance.repository.js';
import { RbacValidator } from '../../validation/rbac.validator.js';
import { RoleEnum, AttendanceStatusEnum } from '../../shared/enums/index.js';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly attendanceRepository: AttendanceRepository,
    private readonly rbacValidator: RbacValidator,
  ) {}

  // T024: Update attendance (admin/superadmin only)
  async updateAttendance(
    bookingId: Types.ObjectId,
    studentId: Types.ObjectId,
    status: AttendanceStatusEnum,
    actorId: Types.ObjectId,
    actorRole: RoleEnum,
  ) {
    this.rbacValidator.validateAction(actorRole, 'update_attendance');
    return this.attendanceRepository.upsert(bookingId, studentId, status, actorId);
  }

  // T027: Aggregate attended count per student (superadmin)
  async getAttendedCountByStudent(studentId: Types.ObjectId): Promise<number> {
    return this.attendanceRepository.countAttendedByStudent(studentId);
  }

  // T026, T027: All attendance records (superadmin)
  async getAllAttendance() {
    return this.attendanceRepository.findAll();
  }
}
