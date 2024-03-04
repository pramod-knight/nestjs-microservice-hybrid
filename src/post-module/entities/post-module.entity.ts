import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type ProductServiceDocument = HydratedDocument<Post>;

@Schema({
  timestamps: true,
  autoIndex: true,
})
export class Post {

  @Prop()
  description: string;

  @Prop()
  post_images: string[];

  @Prop({ default: 0 })
  like: number;

  @Prop({ default: 0 })
  comment: number;

  @Prop({ default: 0 })
  share: number;

  @Prop({ default: 1 })
  status: number;

  @Prop({ default: 0 })
  is_deleted: number;

  @Prop({ unique: true })
  slug: string;

  @Prop()
  created_by: string;
}

const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.pre('save', function (next) {
  this.slug = (+new Date()).toString(36).slice(-5);
  next();
});
export { PostSchema };
