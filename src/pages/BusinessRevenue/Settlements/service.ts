import { serviceRequest } from '@/services/request';
import type { RequestOptions } from '@umijs/max';
import type { SettlementQuery } from './types';

// 代理端方法尚未生成；沿用 OpenAPI 中的结算分页响应类型。
export function listAgentSettlements(
  params: SettlementQuery,
  options?: RequestOptions,
) {
  return serviceRequest<YiyanchaAPI.ApiResponsePageSettlementHistory>(
    'yiyancha',
    '/api/v1/finance/ownSettlements',
    { method: 'GET', params, ...options },
  );
}
