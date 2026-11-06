import { request } from '@umijs/max';
import type { CancellationResult, DashboardResponse } from './types';

export async function queryDashboard(signal?: AbortSignal) {
  const response = await request<DashboardResponse>('/api/state', {
    method: 'GET',
    signal,
    skipErrorHandler: true,
  });
  if (!response?.data || !Array.isArray(response.data.orders)) {
    throw new Error('业务数据响应不符合约定，请检查接口。');
  }
  return response;
}

// 独立的开发期 Mock 路径，不能当作正式撤回协议直接上线。
export async function cancelMockOrder(id: string) {
  if (!id) throw new Error('缺少订单 ID');
  const response = await request<{ data: CancellationResult; mode: 'mock' }>(
    `/api/admin-dashboard/orders/${encodeURIComponent(id)}/cancel`,
    { method: 'POST', data: { action: 'cancel' }, skipErrorHandler: true },
  );
  if (response.mode !== 'mock' || response.data?.order.id !== id) {
    throw new Error('未获得有效的 Mock 撤回结果，请刷新核实状态。');
  }
  return response.data;
}
