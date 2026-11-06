import type { CancellationResult, DashboardResponse } from './types';

export function applyCancellation(
  snapshot: DashboardResponse,
  result: CancellationResult,
): DashboardResponse {
  const authorizations = new Map(
    result.authorizations.map((item) => [item.id, item]),
  );
  return {
    ...snapshot,
    data: {
      ...snapshot.data,
      orders: snapshot.data.orders.map((item) =>
        item.id === result.order.id ? result.order : item,
      ),
      authorizations: snapshot.data.authorizations.map(
        (item) => authorizations.get(item.id) ?? item,
      ),
    },
    logs: [
      result.log,
      ...snapshot.logs.filter((item) => item.id !== result.log.id),
    ],
  };
}

export function requestError(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = error.response;
    if (
      typeof response === 'object' &&
      response !== null &&
      'status' in response
    ) {
      switch (response.status) {
        case 403:
          return '当前没有操作权限。';
        case 404:
          return '记录已不存在，请刷新。';
        case 409:
          return '当前订单状态不能撤回，请刷新后查看。';
      }
    }
  }
  return fallback;
}
