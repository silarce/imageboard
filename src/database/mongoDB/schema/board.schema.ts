import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

@Schema({
  collection: 'board',
  timestamps: true,
})
class Board extends Document {
  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  slug: string;

  @Prop({
    default: '',
  })
  description: string;
}

const BoardSchema = SchemaFactory.createForClass(Board);
BoardSchema.plugin(mongoosePaginate);

export { Board, BoardSchema };
