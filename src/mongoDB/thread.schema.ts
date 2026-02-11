import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import MongoosePaginate from 'mongoose-paginate-v2';
import { Board } from './board.schema';

@Schema({
  collection: 'thread',
  timestamps: true,
})
class Thread extends Document {
  @Prop({
    required: true,
    type: String,
    ref: Board.name,
    index: true,
  })
  board: string;

  @Prop({ required: true })
  title: string;

  @Prop({ default: false })
  inPinned: boolean;

  @Prop({ default: false })
  isLocked: boolean;

  @Prop({ required: true })
  lastReplyAt: Date;

  @Prop({ default: false })
  softDelete: boolean;
}

const ThreadSchema = SchemaFactory.createForClass(Thread);
ThreadSchema.plugin(MongoosePaginate);

export { Thread, ThreadSchema };
