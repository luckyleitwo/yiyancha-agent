import { serviceRequest } from '@/services/request';
import type { RequestOptions } from '@umijs/max';
import type { OrderQuery } from './types';

// 代理订单接口尚未生成，使用项目统一请求入口以复用会话和服务配置。
export function listAgentOrders(params: OrderQuery, options?: RequestOptions) {
  return serviceRequest<YiyanchaAPI.ApiResponseOrderPage>(
    'yiyancha',
    '/api/v1/agents/orders',
    {
      method: 'GET',
      params,
      ...options,
    },
  );
}
