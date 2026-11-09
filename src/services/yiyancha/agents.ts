// @ts-ignore
/* eslint-disable */
import { serviceRequest } from '@/services/request';
import { type RequestOptions } from '@umijs/max';
function request<T>(url: string, options?: RequestOptions) {
  return serviceRequest<T>('yiyancha', url, options);
}

/** 分页查询订单 **作用：**返回当前企业订单、代理客户树订单或中台订单列表，包含授权对象姓名，不包含证件信息、证件明文和上游成本。

**调用时机：**查询记录/订单管理列表打开或翻页时。

**调用方式：**GET `/api/v1/{business|agents|admin}/orders?page=1&size=20&orderId=&batchNo=&companyId=&companyName=&productId=&productName=&agentName=&subjectName=&purpose=&minQuantity=&maxQuantity=&minPaid=&maxPaid=&createdFrom=&createdTo=&validFrom=&validTo=&status=pending&authorizationStatus=pending&isDemo=&includeDemo=true`。主体姓名完整值盲索引精确匹配；订单ID/状态精确匹配、文本包含、数量/实付金额上下限和日期区间；多条件AND。BUSINESS固定当前企业；AGENT限代理客户树，筛选仅缩小范围。

**限制：**需要 order:read；BUSINESS 固定取会话企业，AGENT 限本人及下级代理客户树，ADMIN 全局查询；page 从1开始、size 为1至100。响应 `total` 受筛选影响，`scopeTotal` 仅受会话范围影响。 GET /api/v1/agents/orders */
export async function listOrders1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: YiyanchaAPI.listOrders1Params,
  options?: RequestOptions,
) {
  return request<YiyanchaAPI.ApiResponseOrderPage>('/api/v1/agents/orders', {
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
