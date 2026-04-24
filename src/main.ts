import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Get ConfigService
  const configService = app.get(ConfigService);
  
  // CORS configuration from environment
  const corsOrigin = configService.get<string>('CORS_ORIGIN');
  
  app.enableCors({
    origin: corsOrigin === '*' ? true : corsOrigin?.split(',').map((o) => o.trim()) ?? true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  
  const config = new DocumentBuilder()
    .setTitle('Birthday Card API')
    .setDescription('API for creating interactive birthday greeting cards')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('cards', 'Birthday card management')
    .addTag('games', 'Game instance management')
    .addTag('themes', 'Theme management')
    .addTag('upload', 'File upload endpoints')
    .addTag('template', 'Template generation')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(process.env.PORT ?? 9001);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation available at: ${await app.getUrl()}/api/docs`);
}
bootstrap();
