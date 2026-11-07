import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Slot } from '../domain/slot.schema.js';

@Injectable()
export class SlotRepository {
  constructor(@InjectModel(Slot.name) private readonly slotModel: Model<Slot>) {}

  async create(data: Partial<Slot>): Promise<Slot> {
    return this.slotModel.create(data);
  }

  async findById(id: string): Promise<Slot | null> {
    return this.slotModel.findById(id).exec();
  }

  async findAvailableByDateAndProfessor(date: Date, professorId: Types.ObjectId): Promise<Slot[]> {
    return this.slotModel.find({
      date: { $gte: new Date(date.setHours(0, 0, 0, 0)), $lt: new Date(date.setHours(23, 59, 59, 999)) },
      professorId,
      isBlocked: false,
    }).exec();
  }

  async incrementCapacity(slotId: string): Promise<Slot | null> {
    return this.slotModel.findByIdAndUpdate(
      slotId,
      [{ $set: {
        capacityUsed: { $add: ['$capacityUsed', 1] },
        isAvailable: { $lt: [{ $add: ['$capacityUsed', 1] }, '$capacityMax'] },
      }}],
      { new: true },
    ).exec();
  }

  async decrementCapacity(slotId: string): Promise<Slot | null> {
    return this.slotModel.findByIdAndUpdate(
      slotId,
      [{ $set: {
        capacityUsed: { $max: [{ $subtract: ['$capacityUsed', 1] }, 0] },
        isAvailable: true,
      }}],
      { new: true },
    ).exec();
  }

  async blockSlot(slotId: string): Promise<Slot | null> {
    return this.slotModel.findByIdAndUpdate(slotId, { isBlocked: true, isAvailable: false }, { new: true }).exec();
  }

  async unblockSlot(slotId: string): Promise<Slot | null> {
    return this.slotModel.findByIdAndUpdate(slotId, { isBlocked: false, isAvailable: true }, { new: true }).exec();
  }
}
