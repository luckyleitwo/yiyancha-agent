// @ts-ignore
/* eslint-disable */
import { serviceRequest } from '@/services/request';
import { type RequestOptions } from '@umijs/max';
function request<T>(url: string, options?: RequestOptions) {
  return serviceRequest<T>('yiyancha', url, options);
}

/** 分页查询渠道 **作用：**读取渠道关联供应商、编码和状态，不返回渠道密钥或密文。**时机：**渠道配置页面加载。**用法：**GET page、size。**权限：**仅 ADMIN 且需 governance:channel:read；支持 code（编码包含匹配）、status（active/disabled）、supplierId（精确匹配）。筛选只影响 total，不影响 scopeTotal。 GET /api/v1/governance/channels */
export async function channels(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: YiyanchaAPI.channelsParams,
  options?: RequestOptions,
) {
  return request<YiyanchaAPI.ApiResponsePageChannel>(
    '/api/v1/governance/channels',
    {
      method: 'GET',
      params: {
        // page has a default value: 1
        page: '1',
        // size has a default value: 20
        size: '20',
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 分页查询合同台账 **作用：**读取当前主体合同；ADMIN 读取全部台账。列表不返回合同内容或密文。**时机：**合同列表加载时调用。**用法：**GET status、contractType、subjectType、subjectId、companyName、agentName、page、size；状态为 pending/signed，主体名称包含匹配，其余字段精确匹配。total 随筛选变化，scopeTotal 不受筛选影响。**权限：**三端需 governance:contract:read；主体按会话归属过滤。 GET /api/v1/governance/contracts */
export async function contracts(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: YiyanchaAPI.contractsParams,
  options?: RequestOptions,
) {
  return request<YiyanchaAPI.ApiResponsePageContract>(
    '/api/v1/governance/contracts',
    {
      method: 'GET',
      params: {
        // page has a default value: 1
        page: '1',
        // size has a default value: 20
        size: '20',
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 分页查询供应商 **作用：**读取供应商编码、名称和状态。**时机：**中台配置页面加载时调用。**用法：**GET page、size。**权限：**仅 ADMIN 且需 governance:supplier:read；支持 name（名称包含匹配）、status（active/disabled）。筛选只影响 total，不影响 scopeTotal。 GET /api/v1/governance/suppliers */
export async function suppliers(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: YiyanchaAPI.suppliersParams,
  options?: RequestOptions,
) {
  return request<YiyanchaAPI.ApiResponsePageSupplier>(
    '/api/v1/governance/suppliers',
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

/** 分页查询通知模板 **作用：**读取通知渠道、正文和状态。**时机：**中台模板配置页加载。**用法：**GET page、size。**权限：**仅 ADMIN 且需 governance:template:read；支持 code（编码包含匹配）、status（active/disabled）、channel（精确匹配）。筛选只影响 total，不影响 scopeTotal。模板只保存，不触发发送。 GET /api/v1/governance/templates */
export async function templates(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: YiyanchaAPI.templatesParams,
  options?: RequestOptions,
) {
  return request<YiyanchaAPI.ApiResponsePageTemplate>(
    '/api/v1/governance/templates',
    {
      method: 'GET',
      params: {
        // page has a default value: 1
        page: '1',
        // size has a default value: 20
        size: '20',
        ...params,
      },
      ...(options || {}),
    },
  );
}
