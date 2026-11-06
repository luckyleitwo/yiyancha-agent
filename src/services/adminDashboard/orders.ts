import { request } from '@umijs/max';
import type { OrderListQuery, OrderListResult } from './types';

// 独立开发 Mock 协议，正式服务接入时按实际接口替换。
export async function queryMockOrders(
  params: OrderListQuery,
  signal?: AbortSignal,
) {
  const response = await request<{ mode: 'mock'; data: OrderListResult }>(
    '/api/admin-dashboard/orders',
    { method: 'GET', params, signal, skipErrorHandler: true },
  );
  if (response.mode !== 'mock' || !Array.isArray(response.data?.rows)) {
    throw new Error('订单数据响应不符合约定。');
  }
  return response.data;
}

export async function exportMockOrders(params: OrderListQuery) {
  const response = await request<{
    mode: 'mock';
    data: { csv: string; count: number };
  }>('/api/admin-dashboard/orders-export', {
    method: 'GET',
    params,
    skipErrorHandler: true,
  });
  if (response.mode !== 'mock' || typeof response.data?.csv !== 'string') {
    throw new Error('订单导出响应不符合约定。');
  }
  return response.data;
}
