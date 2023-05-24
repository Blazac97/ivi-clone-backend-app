import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: true,
    },
  });

  const config = new DocumentBuilder()
      .setTitle('ivi clone')
      .setDescription('Документащия REST API')
      .setVersion('1.0.0')
      .build()
  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('/api/docs',app,document)

  await app.listen(PORT, () => console.log('Server started on port =' + PORT))
}

bootstrap().catch((error)=>{
  console.log("Main service",error)
})
