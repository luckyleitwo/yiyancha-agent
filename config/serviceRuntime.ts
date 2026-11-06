import type { ServiceConfig } from './service';

type RuntimeService = Pick<
  ServiceConfig,
  'name' | 'proxyTarget' | 'environments'
>;

function validateUrl(value: string, description: string, allowEmpty = false) {
  if (allowEmpty && value === '') return;
  try {
    const url = new URL(value);
    if (
      !['http:', 'https:'].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      value !== value.trim()
    )
      throw new Error();
  } catch {
    throw new Error(
      `${description}必须是有效的 HTTP(S) 地址${
        allowEmpty ? '或空字符串' : ''
      }`,
    );
  }
}

/** 在 Umi 启动/构建时同时生成代理和可公开的请求地址。 */
export function createServiceRuntimeConfig(
  services: RuntimeService[],
  development: boolean,
  appEnvironment?: string,
) {
  if (
    appEnvironment &&
    !['development', 'test', 'production'].includes(appEnvironment)
  ) {
    throw new Error(`无效的 UMI_APP_ENV：${appEnvironment}`);
  }
  const environment = appEnvironment === 'test' ? 'test' : 'production';
  const proxy: Record<
    string,
    {
      target: string;
      changeOrigin: boolean;
      pathRewrite: Record<string, string>;
    }
  > = {};
  const baseUrls: Record<string, string> = {};
  for (const { name, proxyTarget, environments } of services) {
    if (!/^[a-z][a-z0-9_-]*$/.test(name) || Object.hasOwn(baseUrls, name)) {
      throw new Error(`服务名称无效或重复：${name}`);
    }
    const baseUrl = environments?.[environment] ?? '';
    validateUrl(baseUrl, `${name} 的 ${environment} 地址`, true);
    if (development) {
      validateUrl(proxyTarget ?? '', `${name} 的开发代理目标`);
      proxy[`/${name}/`] = {
        target: proxyTarget!,
        changeOrigin: true,
        pathRewrite: { [`^/${name}(?=/|$)`]: '' },
      };
    }
    baseUrls[name] = development ? `/${name}` : baseUrl;
  }
  return { proxy, baseUrls };
}
