import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { BookingRepository } from '../booking/infrastructure/booking.repository.js';
import { BookingConflictException } from '../shared/exceptions/booking.exceptions.js';

@Injectable()
export class ConflictValidator {
  constructor(private readonly bookingRepository: BookingRepository) {}

  // T008: Check for duplicate + overlap for same student
  async validateNoConflict(studentId: Types.ObjectId, startAt: Date, endAt: Date, slotId: Types.ObjectId): Promise<void> {
    // Duplicate check
    const duplicate = await this.bookingRepository.findByStudentAndSlot(studentId, slotId);
    if (duplicate) throw new BookingConflictException('El alumno ya tiene una reserva en este slot');

    // Overlap check
    const overlaps = await this.bookingRepository.findOverlappingBookings(studentId, startAt, endAt);
    if (overlaps.length > 0) throw new BookingConflictException('El alumno ya tiene una reserva en un horario solapado');
  }
}
