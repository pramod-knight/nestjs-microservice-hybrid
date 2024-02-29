import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import {
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';
import { AllExceptionsFilter } from 'src/exception/global.exception';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors();
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { retryAttempts: 5, retryDelay: 3000 },
  });

  //Handle Dto Class-validation Error
  app.useGlobalPipes(
    new ValidationPipe({
      always: true,
      //The exceptionFactory helps us to control the error message and here we manage message into object from string
      // default the error message will be in array of string
      exceptionFactory: (errors) => {
        const errorMessages = {};
        errors.forEach((error) => {
          errorMessages[error.property] = Object.values(error.constraints)
            .join('. ')
            .trim();
        });
        return new BadRequestException(errorMessages);
      },
      whitelist: true,
    }),
  );
  //Handle App exception
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  //Start All Microservice
  await app.startAllMicroservices();

  const config = new DocumentBuilder()
    .setTitle('TestETtA Version1.0')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('test-v1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(4000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
