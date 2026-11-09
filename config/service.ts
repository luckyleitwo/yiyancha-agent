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

// 各后端的请求地址、协议来源和保留生成的接口白名单。
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
    // 保留现有接口并补充当前页面所需接口；生成器会替换整个服务目录。
    apis: [
      { path: 'admin/authorizations', method: 'GET' },
      { path: 'admin/finance/invoices', method: 'GET' },
      { path: 'admin/finance/overview', method: 'GET' },
      { path: 'admin/finance/recharges', method: 'GET' },
      { path: 'admin/finance/settlements', method: 'GET' },
      { path: 'admin/finance/withdrawals', method: 'GET' },
      { path: 'admin/reports', method: 'GET' },
      { path: 'auth/login', method: 'POST' },
      { path: 'auth/logout', method: 'POST' },
      { path: 'auth/me', method: 'GET' },
      { path: 'catalog/admin/companies', method: 'POST' },
      { path: 'catalog/agent-policies', method: 'GET' },
      { path: 'catalog/agents', method: 'GET' },
      { path: 'catalog/bundles', method: 'GET' },
      { path: 'catalog/companies', method: 'GET' },
      { path: 'catalog/dashboard', method: 'GET' },
      { path: 'catalog/openings', method: 'GET' },
      { path: 'catalog/prices', method: 'GET' },
      { path: 'catalog/products', method: 'GET' },
      { path: 'governance/channels', method: 'GET' },
      { path: 'governance/contracts', method: 'GET' },
      { path: 'governance/suppliers', method: 'GET' },
      { path: 'governance/templates', method: 'GET' },
      { path: 'identity/audit-logs', method: 'GET' },
      { path: 'identity/permissions', method: 'GET' },
      { path: 'identity/roles', method: 'GET' },
      { path: 'identity/users', method: 'GET' },
      { path: 'system/health', method: 'GET' },
      { path: 'agents/orders', method: 'GET' },
      { path: 'finance/ownSettlements', method: 'GET' },
    ],
  },
];

export default services;
