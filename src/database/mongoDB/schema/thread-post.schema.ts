import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Thread } from './thread.schema';
import { R2 } from './r2.schema';

@Schema({ _id: false })
class PostAttachment {
  @Prop({ required: true }) key: string;
  @Prop({ required: true }) thumbnailKey: string;
  @Prop({ required: true }) originalName: string;
  @Prop({ required: true }) mimeType: string;
  @Prop({ required: true, type: Types.ObjectId, ref: R2.name })
  attachmentRef: R2 | Types.ObjectId;
  @Prop({ required: true, type: Types.ObjectId, ref: R2.name })
  thumbnailRef: R2 | Types.ObjectId;
}

const PostAttachmentSchema = SchemaFactory.createForClass(PostAttachment);

@Schema({ _id: false, timestamps: true })
class Report {
  @Prop({ required: true }) reporterIp: string; // 設備指紋
  @Prop({ required: true }) reason: string; // 舉報理由
}

const ReportSchema = SchemaFactory.createForClass(Report);

@Schema({
  collection: 'threadPost',
  timestamps: true,
})
class ThreadPost extends Document {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: Thread.name,
    index: true,
  })
  thread: Thread | Types.ObjectId;

  @Prop({
    type: [PostAttachmentSchema],
    default: [],
  })
  attachments: PostAttachment[];

  // 超過一定數量的舉報後，文章會被自動軟刪除，並且不再顯示在前端，但仍然保留在資料庫中，以便管理員審核和統計分析
  // 基本上會設定為10
  @Prop({ type: [ReportSchema], default: [] })
  report: Report[];

  @Prop({ required: true, default: 0 })
  reportCount: number; // 舉報次數，冗餘字段，方便查詢和排序

  @Prop({ required: true })
  content: string;

  // 發文者IP地址
  // 每次使用者發文都會把這個ip記錄到redis中，並且設ttl 1分鐘
  // 如果在ttl內同一個ip再次發文，就會拒絕這次發文，並且提示用戶發文過於頻繁，請稍後再試
  // 如果該貼文的使用者被ban，則會把這個ip加入紀錄黑名單的collection中，並且設ttl 7天。
  // 如果是永久ban，則不設ttl，直接永久存在黑名單中
  @Prop({ required: true })
  authorIp: string;

  @Prop()
  softDeleted: boolean;
}

const ThreadPostSchema = SchemaFactory.createForClass(ThreadPost);

// 一般的查詢
ThreadPostSchema.index({ thread: 'asc', createdAt: 'asc', _id: 'asc' });

// 查詢被舉報貼文
ThreadPostSchema.index({
  thread: 'asc',
  authorIp: 'asc',
  reportCount: 'desc',
  createdAt: 'desc',
});

export { ThreadPost, ThreadPostSchema };
