import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import {HttpExceptionFilter} from "../../api-gateway/src/exceptions/httpExceptionFilter";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://rabbitmq:5672'],
      queue: 'films_queue',
      queueOptions: {
        durable: false
      },
    },
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen();
}
bootstrap();
