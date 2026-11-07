import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BookingStatusEnum } from '../../shared/enums/index.js';

@Schema({ timestamps: true })
export class Booking extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  studentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  professorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Slot', required: true })
  slotId: Types.ObjectId;

  @Prop({ type: String, required: true, enum: BookingStatusEnum, default: BookingStatusEnum.PENDIENTE })
  status: BookingStatusEnum;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
// Unique index prevents duplicate bookings (T008)
BookingSchema.index({ studentId: 1, slotId: 1 }, { unique: true });
