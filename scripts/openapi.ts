import path from 'node:path';
import services from '../config/service';
import { generateServices } from './openapi-generate';

generateServices(
  services,
  path.resolve(__dirname, '../src/services'),
  process.env.OPENAPI_SCHEMA_PATH,
).catch((error: unknown) => {
  console.error(
    'OpenAPI 生成失败：',
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
});
