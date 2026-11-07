import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class DecisionEvent extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Booking', required: true })
  bookingId: Types.ObjectId;

  @Prop({ type: String, required: true })
  action: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  actorId: Types.ObjectId;

  @Prop({ type: String, required: true })
  actorRole: string;

  @Prop({ type: String })
  reason: string;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

export const DecisionEventSchema = SchemaFactory.createForClass(DecisionEvent);
