// @ts-ignore
/* eslint-disable */
import { serviceRequest } from '@/services/request';
import { type RequestOptions } from '@umijs/max';
function request<T>(url: string, options?: RequestOptions) {
  return serviceRequest<T>('yiyancha', url, options);
}

/** 分页查询本人及下属代理结算单 作用：分页查询当前代理及全部后代的结算记录，返回代理名称、周期、金额、状态和订单编号。调用时机：代理结算页面加载、按列筛选或翻页。调用方式：GET /api/v1/finance/ownSettlements?page=1&pageSize=20&agentId=&agentName=&amountMin=&amountMax=&periodStart=&periodEnd=&periodLabel=&reference=&orderId=&createdFrom=&createdTo=&status=&includeDemo=；指定代理仍限制在当前树，status 支持 pending/ready/completed/reversed。仅 AGENT 门户及 finance:settlement:read 权限，每页最多100条。total 受筛选影响，scopeTotal 为代理树未筛选记录数。 GET /api/v1/finance/ownSettlements */
export async function ownSettlements(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: YiyanchaAPI.ownSettlementsParams,
  options?: RequestOptions,
) {
  return request<YiyanchaAPI.ApiResponsePageSettlementHistory>(
    '/api/v1/finance/ownSettlements',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 查询本人及下属代理提现申请 作用：分页读取当前代理及全部后代的提现记录并解密收款账户。调用时机：代理查看提现记录时。调用方式：GET /api/v1/finance/withdrawals?page=1&pageSize=20&agentId=&agentName=&amountMin=&amountMax=&bankAccount=&payoutReference=&createdFrom=&createdTo=&status=&includeDemo=；所有条件在代理树范围内组合筛选，bankAccount 使用完整值精确匹配。仅 AGENT 门户及 finance:withdrawal:read 权限，每页最多100条，total 随筛选变化，scopeTotal 不随筛选变化。 GET /api/v1/finance/withdrawals */
export async function ownWithdrawals(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: YiyanchaAPI.ownWithdrawalsParams,
  options?: RequestOptions,
) {
  return request<YiyanchaAPI.ApiResponsePageWithdrawalView>(
    '/api/v1/finance/withdrawals',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}
