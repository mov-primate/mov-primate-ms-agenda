import { Controller, Post, Put, Get, Param, Body, Query } from '@nestjs/common';
import { Types } from 'mongoose';
import { BookingService } from './booking.service.js';
import { RoleEnum } from '../../shared/enums/index.js';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // T010-T012: Create booking (alumno)
  @Post()
  async createBooking(@Body() body: {
    studentId: string;
    professorId: string;
    slotId: string;
    studentRole: RoleEnum;
    availableClasses: number;
  }) {
    return this.bookingService.createBooking(
      new Types.ObjectId(body.studentId),
      new Types.ObjectId(body.professorId),
      body.slotId,
      body.studentRole,
      body.availableClasses,
    );
  }

  // T013: Cancel booking
  @Put(':id/cancel')
  async cancelBooking(
    @Param('id') id: string,
    @Body() body: { actorId: string; actorRole: RoleEnum },
  ) {
    return this.bookingService.cancelBooking(id, new Types.ObjectId(body.actorId), body.actorRole);
  }

  // T020: Approve booking (admin scoped)
  @Put(':id/approve')
  async approveBooking(
    @Param('id') id: string,
    @Body() body: { actorId: string; actorRole: RoleEnum },
  ) {
    return this.bookingService.approveBooking(id, new Types.ObjectId(body.actorId), body.actorRole);
  }

  // T020: Reject booking (admin scoped)
  @Put(':id/reject')
  async rejectBooking(
    @Param('id') id: string,
    @Body() body: { actorId: string; actorRole: RoleEnum; reason?: string },
  ) {
    return this.bookingService.rejectBooking(id, new Types.ObjectId(body.actorId), body.actorRole, body.reason);
  }

  // T021: Move booking (admin scoped)
  @Put(':id/move')
  async moveBooking(
    @Param('id') id: string,
    @Body() body: { newSlotId: string; actorId: string; actorRole: RoleEnum; availableClasses: number },
  ) {
    return this.bookingService.moveBooking(
      id,
      body.newSlotId,
      new Types.ObjectId(body.actorId),
      body.actorRole,
      body.availableClasses,
    );
  }

  // T018: Get pending bookings for admin
  @Get('pending')
  async getPending(@Query('professorId') professorId: string) {
    return this.bookingService.getPendingByProfessor(new Types.ObjectId(professorId));
  }

  // T025, T028: Superadmin: all bookings
  @Get()
  async getAll() {
    return this.bookingService.getAllBookings();
  }
}
