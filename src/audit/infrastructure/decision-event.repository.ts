import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DecisionEvent } from '../domain/decision-event.schema.js';

@Injectable()
export class DecisionEventRepository {
  constructor(@InjectModel(DecisionEvent.name) private readonly model: Model<DecisionEvent>) {}

  async create(data: Partial<DecisionEvent>): Promise<DecisionEvent> {
    return this.model.create(data);
  }

  async findByBooking(bookingId: Types.ObjectId): Promise<DecisionEvent[]> {
    return this.model.find({ bookingId }).sort({ timestamp: -1 }).exec();
  }

  async findAll(): Promise<DecisionEvent[]> {
    return this.model.find().sort({ timestamp: -1 }).exec();
  }
}
