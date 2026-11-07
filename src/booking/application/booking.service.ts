import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { BookingRepository } from '../infrastructure/booking.repository.js';
import { SlotRepository } from '../../slots/infrastructure/slot.repository.js';
import { ConflictValidator } from '../../validation/conflict.validator.js';
import { CapacityValidator } from '../../validation/capacity.validator.js';
import { CancellationValidator } from '../../validation/cancellation.validator.js';
import { RbacValidator } from '../../validation/rbac.validator.js';
import { AuditService } from '../../audit/application/audit.service.js';
import { BookingStatusEnum, RoleEnum } from '../../shared/enums/index.js';
import { SlotNotFoundException, SlotBlockedException } from '../../shared/exceptions/slot.exceptions.js';
import { NoClassesAvailableException } from '../../shared/exceptions/booking.exceptions.js';
import { Booking } from '../domain/booking.schema.js';

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly slotRepository: SlotRepository,
    private readonly conflictValidator: ConflictValidator,
    private readonly capacityValidator: CapacityValidator,
    private readonly cancellationValidator: CancellationValidator,
    private readonly rbacValidator: RbacValidator,
    private readonly auditService: AuditService,
  ) {}

  // T010-T012: Create reservation (alumno only, T006 RBAC)
  async createBooking(
    studentId: Types.ObjectId,
    professorId: Types.ObjectId,
    slotId: string,
    studentRole: RoleEnum,
    availableClasses: number,
  ): Promise<Booking> {
    // T006: Role check
    this.rbacValidator.validateAction(studentRole, 'create');

    // Slot validation
    const slot = await this.slotRepository.findById(slotId);
    if (!slot) throw new SlotNotFoundException();
    if (slot.isBlocked) throw new SlotBlockedException();

    // T009.5/FR-021: available_classes check
    if (availableClasses <= 0) throw new NoClassesAvailableException();

    // T007: Capacity check
    await this.capacityValidator.validateCapacity(slotId);

    // T008: Conflict/overlap check
    await this.conflictValidator.validateNoConflict(studentId, slot.startAt, slot.endAt, slot._id as Types.ObjectId);

    // Create booking (pendiente)
    const booking = await this.bookingRepository.create({
      studentId,
      professorId,
      slotId: slot._id as Types.ObjectId,
      status: BookingStatusEnum.PENDIENTE,
    });

    // Increment slot capacity
    await this.slotRepository.incrementCapacity(slotId);

    return booking;
  }

  // T013: Cancel booking (alumno or admin/superadmin scoped)
  async cancelBooking(
    bookingId: string,
    actorId: Types.ObjectId,
    actorRole: RoleEnum,
  ): Promise<Booking> {
    this.rbacValidator.validateAction(actorRole, 'cancel');

    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) throw new SlotNotFoundException('Reserva no encontrada');

    // Scope check for admin
    this.rbacValidator.validateAdminScope(actorRole, actorId, booking.professorId);

    // T009: Cancellation window
    const slot = await this.slotRepository.findById(booking.slotId.toString());
    if (slot) this.cancellationValidator.validateWindow(slot.startAt);

    const updated = await this.bookingRepository.updateStatus(bookingId, BookingStatusEnum.CANCELADO);

    // Decrement slot capacity
    await this.slotRepository.decrementCapacity(booking.slotId.toString());

    // T023: Audit event
    await this.auditService.logDecision(bookingId, 'cancel', actorId, actorRole, 'Reserva cancelada');

    return updated!;
  }

  // T020: Approve booking (admin scoped)
  async approveBooking(bookingId: string, actorId: Types.ObjectId, actorRole: RoleEnum): Promise<Booking> {
    this.rbacValidator.validateAction(actorRole, 'approve');

    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) throw new SlotNotFoundException('Reserva no encontrada');

    this.rbacValidator.validateAdminScope(actorRole, actorId, booking.professorId);

    const updated = await this.bookingRepository.updateStatus(bookingId, BookingStatusEnum.CONFIRMADO);

    await this.auditService.logDecision(bookingId, 'approve', actorId, actorRole, 'Reserva aprobada');

    return updated!;
  }

  // T020: Reject booking (admin scoped)
  async rejectBooking(bookingId: string, actorId: Types.ObjectId, actorRole: RoleEnum, reason?: string): Promise<Booking> {
    this.rbacValidator.validateAction(actorRole, 'reject');

    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) throw new SlotNotFoundException('Reserva no encontrada');

    this.rbacValidator.validateAdminScope(actorRole, actorId, booking.professorId);

    const updated = await this.bookingRepository.updateStatus(bookingId, BookingStatusEnum.RECHAZADO);

    // Decrement capacity when rejected
    await this.slotRepository.decrementCapacity(booking.slotId.toString());

    await this.auditService.logDecision(bookingId, 'reject', actorId, actorRole, reason ?? 'Reserva rechazada');

    return updated!;
  }

  // T021: Move-slot (admin: cancel + new booking in new slot)
  async moveBooking(
    bookingId: string,
    newSlotId: string,
    actorId: Types.ObjectId,
    actorRole: RoleEnum,
    availableClasses: number,
  ): Promise<Booking> {
    this.rbacValidator.validateAction(actorRole, 'move');

    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) throw new SlotNotFoundException('Reserva no encontrada');

    this.rbacValidator.validateAdminScope(actorRole, actorId, booking.professorId);

    // Cancel existing
    const slot = await this.slotRepository.findById(booking.slotId.toString());
    if (slot) this.cancellationValidator.validateWindow(slot.startAt);

    await this.bookingRepository.updateStatus(bookingId, BookingStatusEnum.CANCELADO);
    await this.slotRepository.decrementCapacity(booking.slotId.toString());

    // Create new booking in new slot
    const newBooking = await this.createBooking(
      booking.studentId,
      booking.professorId,
      newSlotId,
      RoleEnum.ALUMNO,
      availableClasses,
    );

    await this.auditService.logDecision(bookingId, 'move_slot', actorId, actorRole, `Movido a slot ${newSlotId}`);

    return newBooking;
  }

  // T018, T019: Get pending bookings for admin (scoped)
  async getPendingByProfessor(professorId: Types.ObjectId): Promise<Booking[]> {
    return this.bookingRepository.findPendingByProfessor(professorId);
  }

  // T025, T028: Superadmin global view
  async getAllBookings(): Promise<Booking[]> {
    return this.bookingRepository.findAll();
  }
}
