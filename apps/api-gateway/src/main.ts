import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {HttpExceptionFilter} from "./exceptions/httpExceptionFilter";

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: true,
    },
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(PORT, () => console.log('Server started on port =' + PORT))
}

bootstrap().catch((error)=>{
  console.log("Main service",error)
})
