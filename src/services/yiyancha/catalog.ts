// @ts-ignore
/* eslint-disable */
import { serviceRequest } from '@/services/request';
import { type RequestOptions } from '@umijs/max';
function request<T>(url: string, options?: RequestOptions) {
  return serviceRequest<T>('yiyancha', url, options);
}

/** 中台创建企业 **作用：**创建企业主体、BUSINESS 门户账号及零余额资金账户，可选择直接归属的代理。

**调用时机：**中台为新客户建立企业及首个门户账号时调用；不会保存手机号或登记号明文。

**调用方式：**`POST /api/v1/catalog/admin/companies`，Bearer 中台令牌，JSON 提供企业名称、可选代理编号、`notes` 和账号信息。`certificationStatus` 可选 `not_submitted`（默认待认证）、`pending`（审核中）、`approved`（已认证）或 `rejected`（已驳回）。

**权限：**ADMIN 门户且拥有 `catalog:organization:manage`；非默认初始认证状态还需 `governance:certification:review`。管理员录入的 `approved` 可通过现有交易认证门槛，但仅代表管理录入，不代表认证材料审核或外部权威核验。 POST /api/v1/catalog/admin/companies */
export async function createCompany(
  body: YiyanchaAPI.CompanyCreateRequest,
  options?: RequestOptions,
) {
  return request<YiyanchaAPI.ApiResponseOrganization>(
    '/api/v1/catalog/admin/companies',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 分页查询代理政策 **作用：**查询代理政策台账及适用产品、生效区间和分佣比例。**时机：**代理政策表格加载、筛选或翻页。**用法：**GET `/api/v1/catalog/agent-policies?page=1&pageSize=20&keyword=&status=&agentId=`。返回 items/page/pageSize/total/scopeTotal；total 受筛选影响，scopeTotal 不受过滤条件影响。ADMIN 查询全量，AGENT 查询本人及下级代理政策；AGENT 的 agentId 过滤不能超出本人代理树。需 catalog:price:read。 GET /api/v1/catalog/agent-policies */
export async function listAgentPolicies(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: YiyanchaAPI.listAgentPoliciesParams,
  options?: RequestOptions,
) {
  return request<YiyanchaAPI.ApiResponseListPageAgentPolicy>(
    '/api/v1/catalog/agent-policies',
    {
      method: 'GET',
      params: {
        // page has a default value: 1
        page: '1',
        // pageSize has a default value: 20
        pageSize: '20',

        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 查询代理树 **作用：**分页返回中台代理目录或当前代理及其下级代理。

**调用时机：**进入代理管理、查看代理树，或分批加载所属代理/上级代理选择项时调用。

**调用方式：**`GET /api/v1/catalog/agents?rootId=<可选>&page=1&pageSize=20`；响应 `data.items/page/pageSize/total`。代理门户传入 rootId 也只能等于本人代理编号；选择器需按页加载至 `total`。

**权限：**ADMIN 或 AGENT 门户且拥有 `catalog:organization:read`；页码从1开始，每页1至100条。 GET /api/v1/catalog/agents */
export async function listAgents(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: YiyanchaAPI.listAgentsParams,
  options?: RequestOptions,
) {
  return request<YiyanchaAPI.ApiResponseAgentPage>('/api/v1/catalog/agents', {
    method: 'GET',
    params: {
      // includeDemo has a default value: true
      includeDemo: 'true',

      // page has a default value: 1
      page: '1',
      // pageSize has a default value: 20
      pageSize: '20',
      ...params,
    },
    ...(options || {}),
  });
}

/** 查询组合产品目录 **作用：**分页返回组合及当前页全部产品明细；非中台目录自动排除含停用产品的组合，并返回 `scopeTotal`。

**调用时机：**查看或选择组合产品时调用。

**调用方式：**`GET /api/v1/catalog/bundles?page=1&pageSize=20`。

**权限：**三端登录用户且拥有 `catalog:bundle:read`；每页最多100项。 GET /api/v1/catalog/bundles */
export async function listBundles(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: YiyanchaAPI.listBundlesParams,
  options?: RequestOptions,
) {
  return request<YiyanchaAPI.ApiResponseListPageBundle>(
    '/api/v1/catalog/bundles',
    {
      method: 'GET',
      params: {
        // includeDemo has a default value: true
        includeDemo: 'true',
        // page has a default value: 1
        page: '1',
        // pageSize has a default value: 20
        pageSize: '20',
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 按门户数据范围查询企业 **作用：**分页查询企业目录，返回当前页记录、筛选后总数 `total`，以及不受筛选影响的当前门户可见企业总数 `scopeTotal`；企业条目含所属代理、创建人编号 `createdBy`/名称 `createdByName` 和示例标记 `isDemo`。

**调用时机：**进入企业客户管理页或切换录入认证、实名状态、关键字、代理范围及页码时调用。

**调用方式：**`GET /api/v1/catalog/companies?page=1&pageSize=20&keyword=<关键字>&certificationStatus=not_submitted&identityStatus=pending&includeDemo=true&agentId=<中台可选过滤>&created_by=<中台可选过滤>&onlyMine=false`。`identityStatus` 可选 `not_submitted`、`draft`、`pending`、`approved`、`rejected`，不传表示全部；摘要忽略中台建档初始化记录，待审记录优先，其余按提交时间（未提交时按创建时间）和编号倒序选择；`identityCertificationId` 和 `identityDocumentCount` 对应此记录，无记录时 ID 为空、状态为 `not_submitted`、材料数为0。关键字匹配企业名称、联系人、行业、地址、备注、所属代理名称/编号；手机号和统一社会信用代码只支持完整值精确匹配。`includeDemo=false` 隐藏示例企业。`created_by` 通过创建人用户编号精确筛选；`creatorId` 是兼容别名。`onlyMine=true` 由服务端按当前登录用户筛选创建记录。响应 `data.total` 是筛选后总数，`data.scopeTotal` 是当前门户权限范围内企业总数，不受任何筛选参数影响。

**权限与范围：**ADMIN、AGENT 或 BUSINESS 门户且拥有 `catalog:organization:read`；`created_by`/`creatorId` 仅 ADMIN 可传，其他门户传入会被拒绝；各门户 `onlyMine` 均按当前会话用户 ID 筛选。ADMIN 的 `agentId` 过滤企业直接所属代理，AGENT 只能查询本人代理树下企业，BUSINESS 只能查询本企业。`scopeTotal` 分别统计 ADMIN 全部企业、AGENT 当前代理树企业、BUSINESS 当前企业。 GET /api/v1/catalog/companies */
export async function listCompanies(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: YiyanchaAPI.listCompaniesParams,
  options?: RequestOptions,
) {
  return request<YiyanchaAPI.ApiResponseCompanyPage>(
    '/api/v1/catalog/companies',
    {
      method: 'GET',
      params: {
        // includeDemo has a default value: true
        includeDemo: 'true',
        // page has a default value: 1
        page: '1',
        // pageSize has a default value: 20
        pageSize: '20',
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 查询门户首页聚合指标 **作用：**在数据库中按当前门户范围汇总企业数、代理数、订单数、已完成订单数和报告数。

**调用时机：**三端工作台首页加载时调用；不返回趋势、金额或原始订单资料。

**调用方式：**`GET /api/v1/catalog/dashboard`，携带当前端 Bearer token。

**权限：**ADMIN 全局；AGENT 为本人代理树和树内企业；BUSINESS 仅本企业且代理数为0；均需 `dashboard:view`。 GET /api/v1/catalog/dashboard */
export async function dashboard(options?: RequestOptions) {
  return request<YiyanchaAPI.ApiResponseDashboard>(
    '/api/v1/catalog/dashboard',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** 查询产品开通申请 **作用：**分页查询产品开通申请；中台查全部，代理查自身代理树及其企业，企业查自身，并返回未筛选的 `scopeTotal`。

**调用时机：**查看申请进度或中台审核队列时调用。

**调用方式：**`GET /api/v1/catalog/openings?page=1&pageSize=20`。

**权限：**三端用户且拥有 `catalog:opening:read`；主体范围由服务端和 SQL 双重约束，每页最多100项。 GET /api/v1/catalog/openings */
export async function listOpenings(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: YiyanchaAPI.listOpeningsParams,
  options?: RequestOptions,
) {
  return request<YiyanchaAPI.ApiResponseListPageOpening>(
    '/api/v1/catalog/openings',
    {
      method: 'GET',
      params: {
        // page has a default value: 1
        page: '1',
        // pageSize has a default value: 20
        pageSize: '20',
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 查询当前有效产品价格 **作用：**按企业专属价优先顺序分页返回有效销售价；代理和中台可查看授权范围内供货价，企业响应裁掉供货价字段，并返回 `scopeTotal`。

**调用时机：**申请开通或向用户展示当前产品报价时调用。

**调用方式：**`GET /api/v1/catalog/prices?page=1&pageSize=20&agentId=<可选>`；企业和代理价格范围取自当前账号归属。

ADMIN 省略或留空 agentId 查询所有代理当前有效报价；指定 agentId 时按代理筛选，停用代理仍可查看已有报价。

**权限：**三端登录用户且拥有 `catalog:price:read`。 GET /api/v1/catalog/prices */
export async function listPrices(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: YiyanchaAPI.listPricesParams,
  options?: RequestOptions,
) {
  return request<YiyanchaAPI.ApiResponseListPagePrice>(
    '/api/v1/catalog/prices',
    {
      method: 'GET',
      params: {
        // page has a default value: 1
        page: '1',
        // pageSize has a default value: 20
        pageSize: '20',
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 分页查询单产品目录 **作用：**分页返回当前可见产品目录，含分类、展示价、核验内容、必要资料、适用场景和预计耗时；门户用户仅见 active 产品，中台可查看全部状态。展示价仅供目录展示，订单报价仍使用有效价格配置。

**调用时机：**产品选择、开通申请或中台维护时调用。

**调用方式：**`GET /api/v1/catalog/products?page=1&pageSize=20&keyword=&status=&includeDemo=true`；keyword 匹配名称或编码，status 筛选状态，includeDemo 控制示例数据。响应含 `items/page/pageSize/total/scopeTotal` 和产品创建时间/示例标记。

**权限：**三端登录用户且拥有 `catalog:product:read`；页码从1开始，每页1至100条。 GET /api/v1/catalog/products */
export async function listProducts(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: YiyanchaAPI.listProductsParams,
  options?: RequestOptions,
) {
  return request<YiyanchaAPI.ApiResponseProductPage>(
    '/api/v1/catalog/products',
    {
      method: 'GET',
      params: {
        // includeDemo has a default value: true
        includeDemo: 'true',
        // page has a default value: 1
        page: '1',
        // pageSize has a default value: 20
        pageSize: '20',
        ...params,
      },
      ...(options || {}),
    },
  );
}
