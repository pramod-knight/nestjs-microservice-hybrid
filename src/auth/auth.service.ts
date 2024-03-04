import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login.dto';
import { all } from 'axios';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USERS_SERVICE') private readonly clientUsersService: ClientProxy,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    return new Promise((success) => {
      this.clientUsersService
        .send('validateUser', {
          email: email,
          password:pass
        })
        .subscribe((users) => {
          if (users) {
            success(users);
          }else{
            success(null)
          }
        });
    });
  }

  async generateToken(payload: any) {
    // /** token */
    let token = this.jwtService.sign(payload, { secret: jwtConstants.secret });
    return token;
  }

  async signIn(signInDto:LoginAuthDto): Promise<any> {
    const {email,password,}=signInDto;
    let data = await this.validateUser(email,password)
  
    if(!data){
      throw new BadRequestException("User not found");
    };

    /** here we add time */
    // var allowTime = new Date(); 
    // allowTime.setHours(9,0,0,0);

    // let getSystemTime = new Date();

    // if(getSystemTime > allowTime){
    //   throw new BadRequestException(`You can login between 9:am to 6 PM  system time : ${getSystemTime} and allow time : ${allowTime}`)
    // }
    const userJson =data;

    [
      'password',
      'status',
      'is_Edit',
      '__v',
      'is_deleted',
      'createdAt',
      'updatedAt',
    ].forEach((key) => delete userJson[key]);
    const payload = {email:email,_id:userJson._id,role:userJson.role};
    // TODO: Generate a JWT and return it here

    return { token: await this.generateToken(payload)};
  }
}
export const jwtConstants = {
  secret:
    'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
};

