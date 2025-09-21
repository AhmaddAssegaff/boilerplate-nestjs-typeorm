import { SWAGGER_CONFIG } from '@app/config/swagger.config';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import basicAuth from 'express-basic-auth';

export function swagger(app: INestApplication) {
  const configService = app.get(ConfigService);

  const usernameSwagger = configService.get<string>('swagger.username');
  const passwordSwagger = configService.get<string>('swagger.password');
  const pathSwagger = configService.get<string>('swagger.path');

  const appNodeMode = configService.get<string>('app.nodeMode');

  if (appNodeMode !== 'development') {
    app.use(
      `/${pathSwagger}`,
      basicAuth({
        challenge: true,
        users: { [usernameSwagger]: passwordSwagger },
      }),
    );
  }

  const builder = new DocumentBuilder()
    .setTitle(SWAGGER_CONFIG.title)
    .setDescription(SWAGGER_CONFIG.description)
    .setVersion(SWAGGER_CONFIG.version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    );
  SWAGGER_CONFIG.tags.forEach((tag) => {
    builder.addTag(tag);
  });

  const options = builder.build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(pathSwagger, app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      deepScanRoutes: true,
      showRequestDuration: true,
    },
  });
}
