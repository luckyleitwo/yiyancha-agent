import { request, type RequestOptions } from '@umijs/max';

/** 将生成接口所属的服务名交给全局请求拦截器。 */
export function serviceRequest<T>(
  service: string,
  url: string,
  options?: RequestOptions,
) {
  return request<T>(url, { ...options, apiServiceName: service });
}
