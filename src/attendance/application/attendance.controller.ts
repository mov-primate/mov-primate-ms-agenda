import { Controller, Put, Get, Param, Body, Query } from '@nestjs/common';
import { Types } from 'mongoose';
import { AttendanceService } from './attendance.service.js';
import { RoleEnum, AttendanceStatusEnum } from '../../shared/enums/index.js';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // T024: Register attendance
  @Put(':bookingId')
  async updateAttendance(
    @Param('bookingId') bookingId: string,
    @Body() body: { studentId: string; status: AttendanceStatusEnum; actorId: string; actorRole: RoleEnum },
  ) {
    return this.attendanceService.updateAttendance(
      new Types.ObjectId(bookingId),
      new Types.ObjectId(body.studentId),
      body.status,
      new Types.ObjectId(body.actorId),
      body.actorRole,
    );
  }

  // T027: Get attended count for student (superadmin)
  @Get('count')
  async getAttendedCount(@Query('studentId') studentId: string) {
    return { count: await this.attendanceService.getAttendedCountByStudent(new Types.ObjectId(studentId)) };
  }

  // T026: All attendance records
  @Get()
  async getAll() {
    return this.attendanceService.getAllAttendance();
  }
}
