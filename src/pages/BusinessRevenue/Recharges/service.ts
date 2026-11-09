import { serviceRequest } from '@/services/request';
import type { RequestOptions } from '@umijs/max';
import type { RechargeQuery } from './types';

// 代理端接口暂未生成，响应结构沿用现有充值类型，仍需实际联调确认。
export function listAgentRecharges(
  params: RechargeQuery,
  options?: RequestOptions,
) {
  return serviceRequest<YiyanchaAPI.ApiResponsePageRechargeView>(
    'yiyancha',
    '/api/v1/agents/recharges',
    { method: 'GET', params, ...options },
  );
}
