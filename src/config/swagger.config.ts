import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export function SwaggerConfigInit(app: INestApplication): void {
  const document = new DocumentBuilder()
    .setTitle('Snappfood backend clone')
    .setDescription('backend of snappfood website clone using nestjs and mysql')
    .setVersion('v0.0.1')
    .addBearerAuth(SwaggerAuthConfig(), 'Authorization')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, document);
  SwaggerModule.setup('/swagger', app, swaggerDocument);
}

function SwaggerAuthConfig(): SecuritySchemeObject {
  return {
    type: 'http',
    bearerFormat: 'JWT',
    in: 'header',
    scheme: 'bearer',
  };
}
