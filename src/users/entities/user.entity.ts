import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsersDocument = HydratedDocument<Users>;

@Schema({
  timestamps: true,
  autoIndex: true,
})
export class Users {
  @Prop()
  profile_photo: string;

  @Prop()
  username: string;

  @Prop()
  bio: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    set: (v) => v?.toLowerCase(),
  })
  email: string;

  @Prop()
  password: string;

  @Prop()
  device_token: string;

  @Prop()
  role: string;

  @Prop({ default: 0 })
  followers: number;

  @Prop({ default: 1 })
  status: number;

  @Prop({ default: 0 })
  is_deleted: number;

  @Prop()
  created_by: string;

  @Prop()
  updated_by: string;

  @Prop({ unique: true })
  slug: string;
  
  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

const UsersSchema = SchemaFactory.createForClass(Users);

UsersSchema.pre('save', function (next) {
  this.slug = this.username + (+new Date()).toString(36).slice(-5);
  next();
});

export { UsersSchema };
