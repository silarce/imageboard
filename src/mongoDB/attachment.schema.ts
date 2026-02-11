import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import MongoosePaginate from 'mongoose-paginate-v2';

@Schema({
  collection: 'attachment',
  timestamps: true,
})
class Attachment extends Document {
  @Prop({ type: String, ref: 'Thread', default: null })
  thread: string | null;

  @Prop({ type: String, ref: 'ThreadPost', default: null })
  threadPost: string | null;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  type: string;

  @Prop() // 若未來哪天不用cloudflare了，所以非required
  r2Key: string;
}

const AttachmentSchema = SchemaFactory.createForClass(Attachment);
AttachmentSchema.plugin(MongoosePaginate);

export { Attachment, AttachmentSchema };
