import { Injectable } from '@nestjs/common';
import { CancellationWindowException } from '../shared/exceptions/booking.exceptions.js';

@Injectable()
export class CancellationValidator {
  // T009: Cancellation only 1 hour before start
  validateWindow(startAt: Date): void {
    const now = new Date();
    const diffMs = startAt.getTime() - now.getTime();
    const oneHourMs = 60 * 60 * 1000;
    if (diffMs < oneHourMs) {
      throw new CancellationWindowException();
    }
  }
}
