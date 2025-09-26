import { ConfigModule } from '@nestjs/config';
import Configs from '@config/index';
import { Module } from '@nestjs/common';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: Configs,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
      validationSchema: Joi.object({
        APP_PORT: Joi.number().required(),
        NODE_ENV: Joi.string()
          .valid('development', 'test', 'staging', 'production')
          .required(),
        DB_NAME: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        API_PREFIX: Joi.string().required(),
        ENABLE_VERSION: Joi.boolean().required(),
        VERSION_PREFIX: Joi.string().required(),
        DEFAULT_VERSION: Joi.string().required(),
        SW_USERNAME: Joi.string().required(),
        SW_PASSWORD: Joi.string().required(),
        SW_PATH: Joi.string().required(),
        TZ: Joi.string().required(),
        AUTH_JWT_ACCESS_TOKEN_SECRET_KEY: Joi.string().required(),
        AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN: Joi.string().required(),
        AUTH_JWT_REFRESH_TOKEN_SECRET_KEY: Joi.string().required(),
        AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN: Joi.string().required(),
        AUTH_JWT_PAYLOAD_ENCRYPT: Joi.boolean().required(),
        AUTH_JWT_ENCRYPTION_KEY: Joi.string().required(),
        AUTH_JWT_ENCRYPTION_IV: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: true,
        allowUnknown: true,
      },
    }),
  ],
  exports: [ConfigModule],
})
export class CommonModule {}
