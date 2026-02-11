import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import MongoosePaginate from 'mongoose-paginate-v2';
import { Thread } from './thread.schema';
import { Member } from './member.schema';
import { Attachment } from './attachment.schema';

@Schema({
  collection: 'thread_post',
  timestamps: true,
})
class ThreadPost extends Document {
  @Prop({ required: true, type: String, ref: Thread.name, index: true })
  thread: string;

  @Prop({ required: true, type: String, ref: Member.name, index: true })
  member: string;

  @Prop({
    type: [{ type: String, ref: Attachment.name }],
    default: null,
  })
  images: string[] | null;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  softDelete: boolean;
}

const ThreadPostSchema = SchemaFactory.createForClass(ThreadPost);
ThreadPostSchema.plugin(MongoosePaginate);

export { ThreadPost, ThreadPostSchema };
