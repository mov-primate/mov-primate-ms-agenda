import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Slot extends Document {
  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ required: true, type: Date })
  startAt: Date;

  @Prop({ required: true, type: Date })
  endAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  professorId: Types.ObjectId;

  @Prop({ default: 4 })
  capacityMax: number;

  @Prop({ default: 0 })
  capacityUsed: number;

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ default: false })
  isBlocked: boolean;
}

export const SlotSchema = SchemaFactory.createForClass(Slot);
SlotSchema.index({ professorId: 1, startAt: 1, endAt: 1 });
