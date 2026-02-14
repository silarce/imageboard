import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Board } from './board.schema';

@Schema({
  collection: 'thread',
  timestamps: true,
})
class Thread extends Document {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: Board.name,
  })
  board: Board | Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, default: Date.now })
  lastReplyAt: Date;

  @Prop({
    required: true,
    default: false,
  })
  isPinned: boolean;

  @Prop({
    required: true,
    default: false,
  })
  isLocked: boolean;

  @Prop({
    required: true,
    default: false,
  })
  softDeleted: boolean;
}

const ThreadSchema = SchemaFactory.createForClass(Thread);
ThreadSchema.index({
  board: 'asc',
  isPinned: 'desc',
  lastReplyAt: 'desc',
  _id: 'asc',
});

export { Thread, ThreadSchema };
