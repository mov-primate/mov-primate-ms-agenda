import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { Slot, SlotSchema } from './slots/domain/slot.schema.js';
import { SlotRepository } from './slots/infrastructure/slot.repository.js';
import { SlotService } from './slots/application/slot.service.js';
import { SlotController } from './slots/application/slot.controller.js';

import { Booking, BookingSchema } from './booking/domain/booking.schema.js';
import { BookingRepository } from './booking/infrastructure/booking.repository.js';
import { BookingService } from './booking/application/booking.service.js';
import { BookingController } from './booking/application/booking.controller.js';

import { Attendance, AttendanceSchema } from './attendance/domain/attendance.schema.js';
import { AttendanceRepository } from './attendance/infrastructure/attendance.repository.js';
import { AttendanceService } from './attendance/application/attendance.service.js';
import { AttendanceController } from './attendance/application/attendance.controller.js';

import { DecisionEvent, DecisionEventSchema } from './audit/domain/decision-event.schema.js';
import { DecisionEventRepository } from './audit/infrastructure/decision-event.repository.js';
import { AuditService } from './audit/application/audit.service.js';
import { AuditController } from './audit/application/audit.controller.js';

import { ConflictValidator } from './validation/conflict.validator.js';
import { CapacityValidator } from './validation/capacity.validator.js';
import { CancellationValidator } from './validation/cancellation.validator.js';
import { RbacValidator } from './validation/rbac.validator.js';
import { BookingEventService } from './events/booking-event.service.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env['MONGODB_URI'] ?? 'mongodb://localhost:27017/movprimate'),
    MongooseModule.forFeature([
      { name: Slot.name, schema: SlotSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Attendance.name, schema: AttendanceSchema },
      { name: DecisionEvent.name, schema: DecisionEventSchema },
    ]),
    ObserveModule.forRoot({
      appKey: process.env['OBSERVE_APP_KEY'] ?? 'YOUR_APP_KEY',
      appSecret: process.env['OBSERVE_APP_SECRET'] ?? 'YOUR_APP_SECRET',
      serviceId: 'mov-primate-ms-agenda',
    }),
  ],
  controllers: [AppController, SlotController, BookingController, AttendanceController, AuditController],
  providers: [
    AppService,
    SlotRepository,
    SlotService,
    BookingRepository,
    BookingService,
    AttendanceRepository,
    AttendanceService,
    DecisionEventRepository,
    AuditService,
    ConflictValidator,
    CapacityValidator,
    CancellationValidator,
    RbacValidator,
    BookingEventService,
  ],
})
export class AppModule {}
