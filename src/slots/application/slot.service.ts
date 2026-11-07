import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { SlotRepository } from '../infrastructure/slot.repository.js';
import { SlotNotFoundException, SlotBlockedException } from '../../shared/exceptions/slot.exceptions.js';
import { Slot } from '../domain/slot.schema.js';

@Injectable()
export class SlotService {
  constructor(private readonly slotRepository: SlotRepository) {}

  // T005: Slot availability query
  async getAvailableSlots(date: Date, professorId: Types.ObjectId): Promise<any[]> {
    const slots = await this.slotRepository.findAvailableByDateAndProfessor(date, professorId);
    return slots.map(slot => ({
      id: slot._id,
      startAt: slot.startAt,
      endAt: slot.endAt,
      professorId: slot.professorId,
      available: slot.isAvailable && !slot.isBlocked,
      reason: !slot.isAvailable ? 'capacity_full' : slot.isBlocked ? 'blocked' : null,
      capacityUsed: slot.capacityUsed,
      capacityMax: slot.capacityMax,
    }));
  }

  async getSlotById(slotId: string): Promise<Slot> {
    const slot = await this.slotRepository.findById(slotId);
    if (!slot) throw new SlotNotFoundException();
    if (slot.isBlocked) throw new SlotBlockedException();
    return slot;
  }

  async createSlot(data: Partial<Slot>): Promise<Slot> {
    return this.slotRepository.create(data);
  }

  async blockSlot(slotId: string): Promise<Slot | null> {
    return this.slotRepository.blockSlot(slotId);
  }

  async unblockSlot(slotId: string): Promise<Slot | null> {
    return this.slotRepository.unblockSlot(slotId);
  }
}
