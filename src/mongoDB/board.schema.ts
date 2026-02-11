import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'board',
  timestamps: true,
})
class Board extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;
}

const BoardSchema = SchemaFactory.createForClass(Board);

export { Board, BoardSchema };
