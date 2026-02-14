import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Manager } from './moderator.schema';

@Schema({
  collection: 'forbiddenIp',
  timestamps: true,
})
class ForbiddenIp extends Document {
  @Prop({
    required: true,
    unique: true,
  })
  ip: string;

  @Prop({ required: true })
  reason: string;

  @Prop({ required: true, type: Types.ObjectId, ref: Manager.name })
  bannedBy: Types.ObjectId | Manager; // 管理員帳號或系統自動封禁

  // 如果有值: 當時間到達這個點，MongoDB 自動刪除此文件 (解Ban)
  // 如果沒值 (undefined/null): 永遠不會過期 (永久Ban)
  @Prop({ index: { expires: 0 } }) // expireAfterSeconds: 0
  expiresAt?: Date;
}

const ForbiddenIpSchema = SchemaFactory.createForClass(ForbiddenIp);

export { ForbiddenIp, ForbiddenIpSchema };
