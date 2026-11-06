import type { ApiSelection } from '../config/service';

const httpMethods = [
  'get',
  'post',
  'put',
  'patch',
  'delete',
  'head',
  'options',
  'trace',
];
const supportedMethods = new Set(['get', 'post', 'put', 'patch', 'delete']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function getServiceFileGroup(
  apiPath: string,
  pathPrefix: string,
): string {
  const prefixSegments = pathPrefix.split('/').filter(Boolean).length;
  const group = apiPath.split('/').filter(Boolean)[prefixSegments];
  if (
    !group ||
    !/^[A-Za-z][A-Za-z0-9]*(?:[-_][A-Za-z0-9]+)*$/.test(group) ||
    /^(index|typings|con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(group)
  ) {
    throw new Error(
      `接口 ${apiPath} 在 pathPrefix 后没有可用的文件分组名：${
        group || '(空)'
      }`,
    );
  }
  return group;
}

export function selectOperations(
  schema: unknown,
  apis: ApiSelection[],
  pathPrefix = '',
): Record<string, unknown> & { paths: Record<string, unknown> } {
  if (!Array.isArray(apis) || apis.length === 0) {
    throw new Error('apis 必须是非空的接口路径数组');
  }
  if (typeof pathPrefix !== 'string' || /[?#]/.test(pathPrefix)) {
    throw new Error('pathPrefix 必须是不含查询参数的路径');
  }
  if (
    !isRecord(schema) ||
    !(schema.openapi || schema.swagger) ||
    !isRecord(schema.info) ||
    !isRecord(schema.paths) ||
    Object.keys(schema.paths).length === 0
  ) {
    throw new Error(
      '文档必须是包含 info 和非空 paths 的 Swagger / OpenAPI JSON',
    );
  }

  const selected = new Map<string, Set<string>>();
  const groupKeys = new Map<string, string>();
  for (const api of apis) {
    const relativePath = typeof api === 'string' ? api : api?.path;
    if (
      typeof relativePath !== 'string' ||
      !relativePath.trim() ||
      relativePath !== relativePath.trim() ||
      /[?#]/.test(relativePath)
    ) {
      throw new Error(
        'apis 必须填写非空的接口路径，不能包含查询参数或首尾空格',
      );
    }
    const apiPath = `/${[pathPrefix, relativePath]
      .map((part) => part.replace(/^\/+|\/+$/g, ''))
      .filter(Boolean)
      .join('/')}`;
    const pathItem = schema.paths[apiPath];
    if (!isRecord(pathItem)) {
      throw new Error(`Swagger 中找不到接口路径：${apiPath}`);
    }
    const group = getServiceFileGroup(apiPath, pathPrefix);
    // 生成器会把分组名转换为驼峰；避免不同路径覆盖同一个文件。
    const groupKey = group.toLowerCase().replace(/[-_]/g, '');
    const existingGroup = groupKeys.get(groupKey);
    if (existingGroup && existingGroup !== group) {
      throw new Error(`接口分组文件名冲突：${existingGroup} 与 ${group}`);
    }
    groupKeys.set(groupKey, group);
    const methods = httpMethods.filter((method) => isRecord(pathItem[method]));
    let method: string;
    if (typeof api === 'string') {
      if (methods.length !== 1) {
        throw new Error(
          `接口 ${apiPath} 存在多个或没有 HTTP 方法，请用对象指定 method`,
        );
      }
      method = methods[0];
    } else {
      if (typeof api.method !== 'string') {
        throw new Error(`接口 ${apiPath} 必须指定 method`);
      }
      method = api.method.toLowerCase();
    }
    if (!supportedMethods.has(method)) {
      throw new Error(`生成器不支持 ${method.toUpperCase()} 接口：${apiPath}`);
    }
    if (!isRecord(pathItem[method])) {
      throw new Error(
        `Swagger 中找不到接口：${method.toUpperCase()} ${apiPath}`,
      );
    }
    const selectedMethods = selected.get(apiPath) || new Set<string>();
    if (selectedMethods.has(method)) {
      throw new Error(`重复选择接口：${method.toUpperCase()} ${apiPath}`);
    }
    selectedMethods.add(method);
    selected.set(apiPath, selectedMethods);
  }

  const paths: Record<string, unknown> = {};
  const operationIds = new Set<string>();
  for (const [apiPath, methods] of selected) {
    const pathItem = schema.paths[apiPath] as Record<string, unknown>;
    paths[apiPath] = Object.fromEntries(
      Object.entries(pathItem).filter(
        ([key]) => !httpMethods.includes(key) || methods.has(key),
      ),
    );
    for (const method of methods) {
      const operation = pathItem[method] as Record<string, unknown>;
      const id = operation.operationId;
      if (typeof id === 'string' && operationIds.has(id)) {
        throw new Error(`所选接口的 operationId 不唯一：${id}`);
      }
      if (typeof id === 'string') operationIds.add(id);
    }
  }
  // 保留完整协议类型，避免选中接口的共享类型或嵌套引用丢失。
  return { ...schema, paths };
}
