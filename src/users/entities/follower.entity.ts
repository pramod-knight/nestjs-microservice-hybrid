import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserFollowerDocument = HydratedDocument<UserFollower>;

@Schema({
  timestamps: true,
  autoIndex: true,
  collection:"follower"
})
export class UserFollower {
  @Prop()
  follower_id: string;

  @Prop()
  followed_by: string;

  @Prop({ default: 1 })
  status: number;

  @Prop({ default: 0 })
  is_deleted: number;
  
  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

const UserFollowerSchema = SchemaFactory.createForClass(UserFollower);

export { UserFollowerSchema };
