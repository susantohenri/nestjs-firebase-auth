import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as firebaseAdmin from 'firebase-admin';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('User Authentication')
    .setDescription(
      'API details for User Authentication Demo application using Firebase in NestJS backend.',
    )
    .setVersion('1.0')
    .addTag('Authentication')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const firebaseKeyFilePath =
    './ayamku-auth-firebase-adminsdk-6kvyo-1d48834ace.json';
  const firebaseServiceAccount = JSON.parse(
    fs.readFileSync(firebaseKeyFilePath).toString(),
  );
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
  });

  await app.listen(3000);
}
bootstrap();
