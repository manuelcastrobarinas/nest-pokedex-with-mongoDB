import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CONFIG } from './env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use((req, res, next) => {
    if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
      next();
    } else {
      res.status(400).send('Only HTTPS requests allowed');
    }
  });
  
  app.setGlobalPrefix('api/v2') //principal route
  
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  app.useGlobalPipes( //PIPES de validacion global para las rutas
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, //para que transforme la informacion que fluye por los DTO
      transformOptions: {
        enableImplicitConversion: true,
      }
    })
  )
  await app.listen(CONFIG().port);
  console.log(`servidor corriendo en puerto ${CONFIG().port}`);
}
bootstrap();
