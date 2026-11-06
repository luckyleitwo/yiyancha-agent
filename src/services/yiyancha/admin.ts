// @ts-ignore
/* eslint-disable */
import { serviceRequest } from '@/services/request';
import { type RequestOptions } from '@umijs/max';
function request<T>(url: string, options?: RequestOptions) {
  return serviceRequest<T>('yiyancha', url, options);
}

/** 分页查询授权记录 **作用：**查询当前企业、代理客户树或中台范围内的授权记录，列表包含订单、企业、产品、用途、有效期和状态；不返回证件或授权凭证明文。

**调用时机：**授权记录表格加载、筛选或翻页时。

**调用方式：**GET `/api/v1/{business|agents|admin}/authorizations?page=1&size=20&authorizationId=&orderId=&batchNo=&companyName=&productName=&purpose=&status=active&validUntilFrom=2026-01-01T00:00:00&validUntilTo=2026-12-31T23:59:59&includeDemo=true`。有效期使用 ISO 日期时间。

**结果：**total 为筛选后记录数，scopeTotal 为当前登录数据范围内记录数，不受筛选影响。subjectName 由加密授权信息得到，暂不支持数据库筛选。需 order:read，主体范围由登录会话确定。 GET /api/v1/admin/authorizations */
export async function listAuthorizations2(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: YiyanchaAPI.listAuthorizations2Params,
  options?: RequestOptions,
) {
  return request<YiyanchaAPI.ApiResponseAuthorizationPage>(
    '/api/v1/admin/authorizations',
    {
      method: 'GET',
      params: {
        // page has a default value: 1
        page: '1',
        // size has a default value: 20
        size: '20',

        // includeDemo has a default value: true
        includeDemo: 'true',
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 查询企业发票记录 作用：分页查询全部状态的发票申请并直接返回解密抬头、邮箱和税号；支持 companyId、keyword、status、includeDemo。调用时机：中台发票页面加载、筛选或翻页。调用方式：GET /api/v1/admin/finance/invoices?page=1&pageSize=20&companyId=...&keyword=...&status=pending&includeDemo=false；仅 ADMIN 门户及 finance:invoice:review 权限。 GET /api/v1/admin/finance/invoices */
export async function pendingInvoices(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: YiyanchaAPI.pendingInvoicesParams,
  options?: RequestOptions,
) {
  return request<YiyanchaAPI.ApiResponsePageInvoiceView>(
    '/api/v1/admin/finance/invoices',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 查询运营工作台充值发票汇总 作用：返回充值总览卡片中的已确认金额、待审核金额、充值数和发票数；金额不代表账户可用余额。调用时机：ADMIN运营工作台加载时。调用方式：GET /api/v1/admin/finance/overview?companyId=...&includeDemo=false；仅 ADMIN 门户且同时具有 finance:recharge:review 与 finance:invoice:review 权限。 GET /api/v1/admin/finance/overview */
export async function operationsOverview(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: YiyanchaAPI.operationsOverviewParams,
  options?: RequestOptions,
) {
  return request<YiyanchaAPI.ApiResponseOperationsOverview>(
    '/api/v1/admin/finance/overview',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 分页查询企业充值记录 作用：分页查询企业充值记录并直接返回已解密付款凭证；支持 companyId、keyword、status、includeDemo。响应含筛选后 total 和全局 scopeTotal。调用时机：ADMIN充值登记与审核页面加载、筛选或翻页。调用方式：GET /api/v1/admin/finance/recharges?page=1&pageSize=20&companyId=...&keyword=...&status=pending&includeDemo=false；省略 status 查询全部状态。仅 ADMIN 门户且有 finance:recharge:review 权限。 GET /api/v1/admin/finance/recharges */
export async function adminRecharges(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: YiyanchaAPI.adminRechargesParams,
  options?: RequestOptions,
) {
  return request<YiyanchaAPI.ApiResponsePageRechargeView>(
    '/api/v1/admin/finance/recharges',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 分页查询全局代理结算单 作用：查询全局代理结算记录及代理、周期、参考编号、时间和关联订单；支持关键字、代理和状态筛选。调用时机：中台结算台账加载、筛选或翻页。调用方式：GET /api/v1/admin/finance/settlements?page=1&pageSize=20&keyword=&agentId=&status=；status 支持 pending/ready/completed/reversed，省略或留空返回全部状态。仅 ADMIN 门户及 finance:settlement:read 权限。total 随筛选变化，scopeTotal 为全局结算单数。 GET /api/v1/admin/finance/settlements */
export async function adminSettlements(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: YiyanchaAPI.adminSettlementsParams,
  options?: RequestOptions,
) {
  return request<YiyanchaAPI.ApiResponsePageSettlementHistory>(
    '/api/v1/admin/finance/settlements',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 分页查询代理提现记录 作用：分页列出全局提现记录并直接返回收款账户、打款回单和申请时间；支持 agentId、keyword、status。调用时机：中台提现审核、状态标签切换或翻页。调用方式：GET /api/v1/admin/finance/withdrawals?page=1&pageSize=20&agentId=...&keyword=...&status=pending；仅 ADMIN 门户及 finance:withdrawal:review 权限。省略 status 查询全部状态，total 随状态筛选变化，scopeTotal 为全局记录数。 GET /api/v1/admin/finance/withdrawals */
export async function pendingWithdrawals(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: YiyanchaAPI.pendingWithdrawalsParams,
  options?: RequestOptions,
) {
  return request<YiyanchaAPI.ApiResponsePageWithdrawalView>(
    '/api/v1/admin/finance/withdrawals',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 分页查询可见报告 **作用：**按企业、代理客户树或中台范围查找尚在授权有效期内且企业产品权限允许查看的报告。

**调用时机：**报告中心打开或翻页时。

**调用方式：**GET `/api/v1/{business|agents|admin}/reports?page=1&size=20&reportId=&companyId=&companyName=&productId=&productName=&title=&subjectName=&status=&conclusion=&source=&createdFrom=2026-01-01T00:00:00&createdTo=2026-12-31T23:59:59&verifiedFrom=&verifiedTo=&includeDemo=true`。标题和文本包含匹配，被核验人姓名完整值盲索引精确匹配，状态/编号精确匹配，日期为闭区间。普通企业/代理列表详情不展示draft报告，ADMIN可查。

**限制：**需要 report:read；校验 company_product_permission.can_view_report、订单归属和授权/报告有效期；列表不返回加密明细解密值。 GET /api/v1/admin/reports */
export async function listReports2(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: YiyanchaAPI.listReports2Params,
  options?: RequestOptions,
) {
  return request<YiyanchaAPI.ApiResponseReportPage>('/api/v1/admin/reports', {
    method: 'GET',
    params: {
      // page has a default value: 1
      page: '1',
      // size has a default value: 20
      size: '20',

      // includeDemo has a default value: true
      includeDemo: 'true',
      ...params,
    },
    ...(options || {}),
  });
}
