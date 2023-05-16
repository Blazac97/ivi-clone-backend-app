import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: true,
    },
  });
  await app.listen(PORT, () => console.log('Server started on port =' + PORT))
}

bootstrap().catch((error)=>{
  console.log("Main service",error)
})
