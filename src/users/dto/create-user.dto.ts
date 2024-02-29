import {
  IS_STRONG_PASSWORD,
  IsEmail,
  IsMobilePhone,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  Matches,
} from 'class-validator';

export class CreateUserDto {
 
  @IsOptional()
  profile_photo: string;

  @IsOptional()
  bio: string;

  // @IsOptional()
  // followers: number;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsMongoId()
  role: string;

  @IsOptional()
  device_token: string;

  @IsNotEmpty()
  @IsMongoId()
  created_by: string;

  @IsNotEmpty()
  @IsMongoId()
  updated_by: string;
}
