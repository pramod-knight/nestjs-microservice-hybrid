import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type PostLikeDocument = HydratedDocument<PostLike>;

@Schema({
  timestamps: true,
  autoIndex: true,
  collection:"post_likes"
})
export class PostLike {

  @Prop()
  post_id: string;

  @Prop()
  liked_by: string;
}

const PostLikeSchema = SchemaFactory.createForClass(PostLike);

export { PostLikeSchema };
