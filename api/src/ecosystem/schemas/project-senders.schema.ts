import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ProjectSenders extends Document {
  @Prop({ required: true, index: true })
  packageAddress: string;

  @Prop({ required: true })
  module: string;

  @Prop({ type: [String], default: [] })
  senders: string[];

  @Prop({ type: String, default: null })
  cursor: string | null;

  @Prop({ default: 0 })
  eventsScanned: number;
}

export const ProjectSendersSchema = SchemaFactory.createForClass(ProjectSenders);
ProjectSendersSchema.index({ packageAddress: 1, module: 1 }, { unique: true });
