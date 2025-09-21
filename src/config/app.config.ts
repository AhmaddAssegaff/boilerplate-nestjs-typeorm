import { registerAs } from '@nestjs/config';

export default registerAs(
  'app',
  (): Record<string, any> => ({
    port: process.env.APP_PORT,
    nodeMode: process.env.NODE_ENV,
    globalPrefix: process.env.API_PREFIX,
    enableVersion: process.env.ENABLE_VERSION,
    versionPrefix: process.env.VERSION_PREFIX,
    defaultVersion: process.env.DEFAULT_VERSION,
    tz: process.env.TZ,
  }),
);
