import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';
import { swagger } from '@core/docs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const defaultVersion = configService.get<string>('app.defaultVersion');
  const enableVersion = configService.get<string>('app.enableVersion');

  const globalPrefix = configService.get<string>('app.globalPrefix');
  const versionPrefix = configService.get<string>('app.versionPrefix');

  const appNodeMode = configService.get<string>('app.nodeMode');
  const appPort = configService.get<string>('app.port');

  const tz = configService.get<string>('app.tz');
  process.env.TZ = tz;

  app.enableCors();
  app.setGlobalPrefix(globalPrefix);

  if (enableVersion) {
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion,
      prefix: versionPrefix,
    });
    swagger(app);
  }

  await app.listen(appPort);
}
bootstrap();
