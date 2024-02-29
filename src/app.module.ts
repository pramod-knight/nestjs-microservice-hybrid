import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/auth.service';
import { JwtStrategy } from './auth/auth.jwt.stragy';
import { PostModuleModule } from './post-module/post-module.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '1hr' },
      }),
    }),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}${process.env.DATABASE_HOST}${process.env.DATABASE_NAME}?retryWrites=true&w=majority`,
      {
        autoIndex: true,
      },
    ),
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
      },
    ]),
    ClientsModule.register([
      {
        name: 'ROLE_SERVICE',
        transport: Transport.TCP,
      },
    ]),
    ClientsModule.register([
      {
        name: 'Auth_SERVICE',
        transport: Transport.TCP,
      },
    ]),

    ClientsModule.register([
      {
        name: 'POST_SERVICE',
        transport: Transport.TCP,
      },
    ]),

    UsersModule,
    RolesModule,
    AuthModule,
    PostModuleModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
