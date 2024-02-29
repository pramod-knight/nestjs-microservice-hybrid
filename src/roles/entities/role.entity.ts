import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RolesDocument = HydratedDocument<Role>;

@Schema({
  timestamps: true,
  autoIndex: true,
  collection:"roles"
})
export class Role {
  @Prop()
  name: string;

  @Prop({unique:true})
  slug: string;
  
  @Prop({ default: 1 })
  status: number;

  //1 for deleted, 0 for not deleted
  @Prop({ default: 0 })
  is_deleted: number;

}

const RolesSchema = SchemaFactory.createForClass(Role);

RolesSchema.pre("save",function(next){
  this.slug = this.name.split(" ").join("-")
    next()
})
export { RolesSchema };

