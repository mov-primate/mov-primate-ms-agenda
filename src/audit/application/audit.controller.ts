import { Controller, Get, Param } from '@nestjs/common';
import { AuditService } from './audit.service.js';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  // T025: Get audit trail for booking
  @Get('bookings/:bookingId')
  async getAuditTrail(@Param('bookingId') bookingId: string) {
    return this.auditService.getAuditTrail(bookingId);
  }

  // T028: All audit events (superadmin)
  @Get()
  async getAllEvents() {
    return this.auditService.getAllEvents();
  }
}
