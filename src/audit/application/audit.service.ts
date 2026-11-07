import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DecisionEventRepository } from '../infrastructure/decision-event.repository.js';

@Injectable()
export class AuditService {
  constructor(private readonly decisionEventRepository: DecisionEventRepository) {}

  // T023, T028: Log decision event
  async logDecision(
    bookingId: string,
    action: string,
    actorId: Types.ObjectId,
    actorRole: string,
    reason?: string,
  ): Promise<void> {
    await this.decisionEventRepository.create({
      bookingId: new Types.ObjectId(bookingId),
      action,
      actorId,
      actorRole,
      reason,
    });
  }

  // T025, T026: Get audit trail for booking
  async getAuditTrail(bookingId: string) {
    return this.decisionEventRepository.findByBooking(new Types.ObjectId(bookingId));
  }

  // T028: All audit events (superadmin)
  async getAllEvents() {
    return this.decisionEventRepository.findAll();
  }
}
