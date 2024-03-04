import { IsMongoId, IsNotEmpty, IsNumber, IsOptional} from "class-validator";

export class LikePostDto {
    
    @IsNotEmpty()
    @IsMongoId()
    post_id:string;

    @IsNotEmpty()
    @IsMongoId()
    liked_by:string;
}
