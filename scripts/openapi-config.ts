import type { ServiceConfig } from '../config/service';

export function validateServices(services: ServiceConfig[]) {
  if (!Array.isArray(services)) {
    throw new Error('config/service.ts 必须导出后端服务配置数组');
  }
  const names = new Set<string>();
  const namespaces = new Set<string>();
  for (const service of services) {
    if (!service || typeof service !== 'object') {
      throw new Error('每个后端必须是服务配置对象');
    }
    const { name, namespace, schemaPath, pathPrefix, apis } = service;
    if (
      typeof name !== 'string' ||
      !/^[a-z][a-z0-9_-]*$/.test(name) ||
      /^(demo|con|prn|aux|nul|com[1-9]|lpt[1-9])$/.test(name)
    ) {
      throw new Error(
        'name 必须以小写字母开头，仅含小写字母、数字、下划线或短横线，且不能使用保留目录名',
      );
    }
    if (names.has(name)) throw new Error(`服务 name 重复：${name}`);
    names.add(name);
    if (
      typeof namespace !== 'string' ||
      !/^[A-Z][A-Za-z0-9_]*$/.test(namespace) ||
      namespace === 'API'
    ) {
      throw new Error(
        `${name} 的 namespace 必须以大写字母开头，不能使用 demo 的 API`,
      );
    }
    if (namespaces.has(namespace))
      throw new Error(`namespace 重复：${namespace}`);
    namespaces.add(namespace);
    if (typeof schemaPath !== 'string' || !schemaPath.trim()) {
      throw new Error(`${name} 必须配置 schemaPath`);
    }
    if (
      typeof pathPrefix !== 'string' ||
      pathPrefix !== pathPrefix.trim() ||
      /[?#:]/.test(pathPrefix)
    ) {
      throw new Error(`${name} 的 pathPrefix 必须是接口公共路径前缀，可留空`);
    }
    if (!Array.isArray(apis)) throw new Error(`${name} 的 apis 必须是数组`);
  }
}
