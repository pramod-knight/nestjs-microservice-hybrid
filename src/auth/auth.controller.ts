import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { ExceptionFilter } from 'src/exception.service';
import { LoginAuthDto } from './dto/login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseFilters(new ExceptionFilter())
  @MessagePattern('login')
  signIn(@Payload() signInDto: LoginAuthDto) {
    return this.authService.signIn(signInDto);
  }
}
