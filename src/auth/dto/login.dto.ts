import { IsEmail, IsNotEmpty, IsString,IsOptional } from "class-validator";

export class LoginAuthDto {
    @IsNotEmpty()
    @IsEmail()
    email:string;
    
    @IsNotEmpty()
    @IsString()
    password:string;

    @IsOptional()
    device_token: string;
}
