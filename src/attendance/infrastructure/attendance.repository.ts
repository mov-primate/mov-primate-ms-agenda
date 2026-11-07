import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Attendance } from '../domain/attendance.schema.js';
import { AttendanceStatusEnum } from '../../shared/enums/index.js';

@Injectable()
export class AttendanceRepository {
  constructor(@InjectModel(Attendance.name) private readonly attendanceModel: Model<Attendance>) {}

  async upsert(bookingId: Types.ObjectId, studentId: Types.ObjectId, status: AttendanceStatusEnum, updatedBy: Types.ObjectId): Promise<Attendance> {
    return this.attendanceModel.findOneAndUpdate(
      { bookingId },
      { bookingId, studentId, status, updatedBy },
      { upsert: true, new: true },
    ).exec() as Promise<Attendance>;
  }

  async findByStudent(studentId: Types.ObjectId): Promise<Attendance[]> {
    return this.attendanceModel.find({ studentId }).exec();
  }

  async countAttendedByStudent(studentId: Types.ObjectId): Promise<number> {
    return this.attendanceModel.countDocuments({ studentId, status: AttendanceStatusEnum.ATTENDED }).exec();
  }

  async findAll(): Promise<Attendance[]> {
    return this.attendanceModel.find().exec();
  }
}
