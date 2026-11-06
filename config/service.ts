export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ApiSelection = string | { path: string; method: HttpMethod };

export type ServiceConfig = {
  /** 服务标识，同时作为 src/services 下的输出目录名，不可重复。 */
  name: string;
  /** 本地开发代理目标；代理路径由 name 自动生成。 */
  proxyTarget?: string;
  /** 测试和正式环境地址；空字符串表示同源。 */
  environments?: { test: string; production: string };
  /** Swagger / OpenAPI JSON 地址或本地 JSON 文件路径。 */
  schemaPath: string;
  /** 补全 apis 中的相对路径，并决定生成文件的路径分组起点；不改变实际请求路径。 */
  pathPrefix: string;
  /** 各后端使用独立的全局类型命名空间。 */
  namespace: string;
  /** 路径对应多个 HTTP 方法时，必须用对象明确指定 method。 */
  apis: ApiSelection[];
};

const services: ServiceConfig[] = [
  {
    name: 'yiyancha',
    proxyTarget:
      process.env.UMI_APP_YIYANCHA_DEV_PROXY_TARGET ||
      'http://192.168.1.219:8080',
    environments: {
      test: '/yiyancha',
      production: process.env.UMI_APP_YIYANCHA_PROD_URL ?? '',
    },
    schemaPath: 'http://192.168.1.219:8080/v3/api-docs',
    pathPrefix: '/api/v1',
    namespace: 'YiyanchaAPI',
    apis: [],
  },
];

export default services;
