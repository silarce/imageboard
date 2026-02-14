import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import bcrypt from 'bcrypt';
import { Board } from './board.schema';

enum ManagerRole {
  Admin = 'Admin',
  Moderator = 'Moderator',
  // Janitors = 'Janitors', // 清潔員，負責刪除不當內容，但沒有管理討論版的權限 // 專案v2完成後再考慮加進這個角色
}

@Schema({
  collection: 'manager',
  timestamps: true,
  toJSON: {
    transform: (_, ret: Record<string, any>) => {
      delete ret.password;
      return ret;
    },
  },
})
class Manager extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  nickname: string;

  @Prop({
    required: true,
    type: String,
    enum: ManagerRole,
    default: ManagerRole.Moderator,
  })
  role: ManagerRole;

  @Prop({
    type: [{ type: Types.ObjectId, ref: Board.name }],
    default: [],
  })
  managedBoards: Types.ObjectId[]; // 版主管理的討論版ID列表
}

const ManagerSchema = SchemaFactory.createForClass(Manager);

// ManagerSchema.pre('save', async function () {
//   if (this.isModified('password')) {
//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(this.password, salt);
//     this.password = hash;
//   }
// });

export { Manager, ManagerSchema };
