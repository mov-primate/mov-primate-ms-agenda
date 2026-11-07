import { Injectable } from '@nestjs/common';
import { SlotRepository } from '../slots/infrastructure/slot.repository.js';
import { CapacityFullException } from '../shared/exceptions/booking.exceptions.js';

@Injectable()
export class CapacityValidator {
  constructor(private readonly slotRepository: SlotRepository) {}

  // T007: Validate max 4 students per slot
  async validateCapacity(slotId: string): Promise<void> {
    const slot = await this.slotRepository.findById(slotId);
    if (!slot) return;
    if (slot.capacityUsed >= slot.capacityMax) {
      throw new CapacityFullException();
    }
  }
}
