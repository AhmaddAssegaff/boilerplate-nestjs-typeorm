import { registerAs } from '@nestjs/config';

export default registerAs(
  'db',
  (): Record<string, any> => ({
    databaseName: process.env.DB_NAME,
    databaseHost: process.env.DB_HOST,
    databasePassword: process.env.DB_PASS,
    databaseUsername: process.env.DB_USER,
    databasePort: process.env.DB_PORT,
    DatabaseSync: process.env.TYPEORM_SYNC,
  }),
);
