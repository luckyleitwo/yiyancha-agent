import { generateService } from '@umijs/openapi';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import type { ServiceConfig } from '../config/service';
import { validateServices } from './openapi-config';
import { getServiceFileGroup, selectOperations } from './openapi-select';

async function readSchema(schemaPath: string): Promise<unknown> {
  if (!/^https?:\/\//.test(schemaPath)) {
    return JSON.parse(await fs.readFile(path.resolve(schemaPath), 'utf8'));
  }
  const response = await fetch(schemaPath, {
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`文档下载失败：HTTP ${response.status}`);
  return response.json();
}

// 同磁盘替换单个服务目录；失败时恢复旧目录，不影响其他服务。
async function installService(source: string, target: string) {
  const swapDir = await fs.mkdtemp(
    path.join(path.dirname(target), '.openapi-'),
  );
  const next = path.join(swapDir, 'next');
  const previous = path.join(swapDir, 'previous');
  let backedUp = false;
  let keepBackup = false;
  try {
    await fs.cp(source, next, { recursive: true });
    try {
      await fs.rename(target, previous);
      backedUp = true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
    try {
      await fs.rename(next, target);
    } catch (error) {
      if (backedUp) {
        try {
          await fs.rename(previous, target);
        } catch {
          keepBackup = true;
          throw new Error(`目录替换失败，旧文件保留在 ${previous}，请手动恢复`);
        }
      }
      throw error;
    }
  } finally {
    if (!keepBackup) await fs.rm(swapDir, { recursive: true, force: true });
  }
}

export async function generateServices(
  services: ServiceConfig[],
  outputRoot: string,
  schemaOverride?: string,
) {
  validateServices(services);
  const active = services.filter((service) => service.apis.length > 0);
  if (active.length === 0) {
    console.log('未选择接口，跳过生成，已有文件保持不变。');
    return;
  }
  if (schemaOverride && active.length !== 1) {
    throw new Error(
      'OPENAPI_SCHEMA_PATH 仅支持一个启用的服务；多服务请分别配置 schemaPath',
    );
  }

  // 所有服务先完成文档读取和筛选，任何配置错误都不能更新已有输出。
  const prepared = [];
  for (const service of active) {
    try {
      const schema = await readSchema(schemaOverride || service.schemaPath);
      prepared.push({
        service,
        schema: selectOperations(schema, service.apis, service.pathPrefix),
      });
    } catch (error) {
      throw new Error(
        `[${service.name}] ${error instanceof Error ? error.message : error}`,
      );
    }
  }

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'yiyancha-openapi-'));
  try {
    for (const { service, schema } of prepared) {
      const snapshotDir = path.join(tempDir, 'schemas', service.name);
      await fs.mkdir(snapshotDir, { recursive: true });
      const snapshotPath = path.join(snapshotDir, 'schema.json');
      await fs.writeFile(snapshotPath, JSON.stringify(schema));
      await generateService({
        schemaPath: snapshotPath,
        serversPath: path.join(tempDir, 'generated'),
        projectName: service.name,
        namespace: service.namespace,
        isCamelCase: true,
        hook: {
          customFileNames: (_operation, apiPath) => [
            getServiceFileGroup(apiPath, service.pathPrefix),
          ],
        },
        // 保留服务标识，环境地址由统一请求入口提供。
        requestLibPath: `import { type RequestOptions } from '@umijs/max';
import { serviceRequest } from '@/services/request';
function request<T>(url: string, options?: RequestOptions) {
  return serviceRequest<T>(${JSON.stringify(service.name)}, url, options);
}`,
        requestOptionsType: 'RequestOptions',
      });
    }
    await fs.mkdir(outputRoot, { recursive: true });
    for (const { service } of prepared) {
      await installService(
        path.join(tempDir, 'generated', service.name),
        path.join(outputRoot, service.name),
      );
      console.log(
        `[${service.name}] 已生成所选的 ${service.apis.length} 个接口。`,
      );
    }
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}
