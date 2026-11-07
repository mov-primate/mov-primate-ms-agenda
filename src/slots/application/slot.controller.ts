import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { Types } from 'mongoose';
import { SlotService } from './slot.service.js';

@Controller('slots')
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  // T005: GET available slots by date and professor
  @Get()
  async getAvailableSlots(
    @Query('date') date: string,
    @Query('professorId') professorId: string,
  ) {
    return this.slotService.getAvailableSlots(new Date(date), new Types.ObjectId(professorId));
  }

  @Get(':id')
  async getSlot(@Param('id') id: string) {
    return this.slotService.getSlotById(id);
  }

  // Admin: Create slot
  @Post()
  async createSlot(@Body() body: any) {
    return this.slotService.createSlot(body);
  }

  // Admin/Superadmin: Block slot
  @Post(':id/block')
  async blockSlot(@Param('id') id: string) {
    return this.slotService.blockSlot(id);
  }

  @Post(':id/unblock')
  async unblockSlot(@Param('id') id: string) {
    return this.slotService.unblockSlot(id);
  }
}
