import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import MongoosePaginate from 'mongoose-paginate-v2';
import { Role } from 'src/common/permission/role';

@Schema({
  collection: 'member',
  timestamps: true,
  toJSON: {
    transform: (_, ref: Record<string, any>) => {
      const { password, ...rest } = ref;
      return rest;
    },
  },
})
class Member extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true })
  nickname: string;

  @Prop({
    required: true,
    type: String,
    enum: Object.values(Role),
    default: Role.MEMBER,
    index: true,
  })
  role: Role;

  @Prop({
    default: null,
  })
  bannedUntil: Date | null;
}

const MemberSchema = SchemaFactory.createForClass(Member);
MemberSchema.plugin(MongoosePaginate);

export { Member, MemberSchema };
