import { IsMongoId, IsNotEmpty} from 'class-validator';

export class FollowUserDto {
  @IsNotEmpty()
  @IsMongoId()
  followed_by: string;

  @IsNotEmpty()
  @IsMongoId()
  follower_id: string;
}
