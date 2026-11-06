// @ts-ignore
/* eslint-disable */
import { serviceRequest } from '@/services/request';
import { type RequestOptions } from '@umijs/max';
function request<T>(url: string, options?: RequestOptions) {
  return serviceRequest<T>('yiyancha', url, options);
}

/** 检查服务是否存活 **作用：**返回当前应用进程的存活状态。

**调用时机：**部署平台、负载均衡器或运维监控定期探测服务时调用，也可用于本地确认服务已启动。

**调用方式：**向 `GET /api/v1/system/health` 发送请求；无需令牌和请求体。`data.status` 为 `UP` 表示应用接口可响应；此探测不代表数据库等所有依赖均健康。 GET /api/v1/system/health */
export async function health(options?: RequestOptions) {
  return request<YiyanchaAPI.ApiResponseHealthResult>('/api/v1/system/health', {
    method: 'GET',
    ...(options || {}),
  });
}
