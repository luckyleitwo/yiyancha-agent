import type { RecordEntity, RecordInput } from '@/constants/recordFields';
import { request } from '@umijs/max';
import type { DashboardRecord } from './types';

export function createRecord(entity: RecordEntity, data: RecordInput) {
  return request<DashboardRecord>(`/api/records/${entity}`, {
    method: 'POST',
    data,
    skipErrorHandler: true,
  });
}

export function updateRecord(
  entity: RecordEntity,
  id: string,
  version: number,
  data: RecordInput,
) {
  return request<DashboardRecord>(
    `/api/records/${entity}/${encodeURIComponent(id)}`,
    { method: 'PATCH', data: { version, data }, skipErrorHandler: true },
  );
}

export function deleteRecord(
  entity: RecordEntity,
  id: string,
  version: number,
) {
  return request<{ ok: boolean }>(
    `/api/records/${entity}/${encodeURIComponent(id)}`,
    { method: 'DELETE', data: { version }, skipErrorHandler: true },
  );
}

export async function recordError(error: unknown): Promise<string> {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = error.response;
    if (response instanceof Response) {
      try {
        const body: unknown = await response.clone().json();
        if (
          typeof body === 'object' &&
          body !== null &&
          'error' in body &&
          typeof body.error === 'string'
        )
          return body.error;
      } catch {
        /* no JSON body */
      }
    }
    if (
      typeof response === 'object' &&
      response !== null &&
      'data' in response
    ) {
      const data = response.data;
      if (
        typeof data === 'object' &&
        data !== null &&
        'error' in data &&
        typeof data.error === 'string'
      )
        return data.error;
    }
  }
  return error instanceof Error ? error.message : '操作失败，请重试';
}
