import { registerAs } from '@nestjs/config';
import { swaggerConfigInterface } from '@core/interface/swagger.interface';

export const SWAGGER_CONFIG: swaggerConfigInterface = {
  title: 'title swagger',
  description: 'description swagger',
  version: '1.0',
  tags: [],
};

export default registerAs(
  'swagger',
  (): Record<string, any> => ({
    username: process.env.SW_USERNAME,
    password: process.env.SW_PASSWORD,
    path: process.env.SW_PATH,
  }),
);
