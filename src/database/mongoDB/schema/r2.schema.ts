import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// 為了未來擴展的可能性，不直接把R2的key存在threadPost裡，而是獨立成一個R2的schema
// 這樣以後如果需要在其他地方使用R2檔案，可以直接使用這個schema
// 也會比較方便管理
@Schema({
  collection: 'r2',
  timestamps: true,
})
class R2 extends Document {
  // key會用uuid生成，並且可能會有前綴，例如threadPost/123e4567-e89b-12d3-a456-426614174000.jpg，這樣就可以知道這個檔案是屬於哪個討論串的，也方便管理和清理檔案
  // r2檔案的key，也等同於路徑 // 在前面接上domain就是完整的URL，可以直接用來訪問檔案
  @Prop({
    required: true,
    unique: true,
  })
  key: string;

  @Prop({ required: true })
  originalName: string; //上傳檔案的原始名稱

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  fileSize: number; //檔案大小，單位為byte
}

const R2Schema = SchemaFactory.createForClass(R2);

export { R2, R2Schema };
