import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking } from '../domain/booking.schema.js';
import { BookingStatusEnum } from '../../shared/enums/index.js';

@Injectable()
export class BookingRepository {
  constructor(@InjectModel(Booking.name) private readonly bookingModel: Model<Booking>) {}

  async create(data: Partial<Booking>): Promise<Booking> {
    return this.bookingModel.create(data);
  }

  async findById(id: string): Promise<Booking | null> {
    return this.bookingModel.findById(id).exec();
  }

  async findByStudentAndSlot(studentId: Types.ObjectId, slotId: Types.ObjectId): Promise<Booking | null> {
    return this.bookingModel.findOne({ studentId, slotId }).exec();
  }

  // T008: Overlap detection - bookings by student in a time range
  async findOverlappingBookings(studentId: Types.ObjectId, startAt: Date, endAt: Date): Promise<Booking[]> {
    return this.bookingModel.aggregate([
      { $match: { studentId, status: { $nin: [BookingStatusEnum.CANCELADO, BookingStatusEnum.RECHAZADO] } } },
      { $lookup: { from: 'slots', localField: 'slotId', foreignField: '_id', as: 'slot' } },
      { $unwind: '$slot' },
      { $match: { 'slot.startAt': { $lt: endAt }, 'slot.endAt': { $gt: startAt } } },
    ]).exec();
  }

  async updateStatus(id: string, status: BookingStatusEnum): Promise<Booking | null> {
    return this.bookingModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
  }

  async findPendingByProfessor(professorId: Types.ObjectId): Promise<Booking[]> {
    return this.bookingModel.find({ professorId, status: BookingStatusEnum.PENDIENTE }).exec();
  }

  async findAllByProfessor(professorId: Types.ObjectId): Promise<Booking[]> {
    return this.bookingModel.find({ professorId }).exec();
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingModel.find().exec();
  }
}
