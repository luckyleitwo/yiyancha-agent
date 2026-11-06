import { apiBaseUrls } from '@/constants/api';
import { clearLoginSession, getAccessToken } from '@/utils/auth';
import { loadCurrentSession } from '@/utils/authSession';
// @ts-ignore
import type { RequestConfig, RequestOptions } from '@umijs/max';
import { message } from 'antd';

export const request: RequestConfig = {
  requestInterceptors: [
    (config: RequestOptions) => {
      const { apiServiceName, ...options } = config;
      if (!apiServiceName) return config;
      if (
        typeof apiServiceName !== 'string' ||
        !Object.prototype.hasOwnProperty.call(apiBaseUrls, apiServiceName)
      ) {
        throw new Error(`未配置后端服务：${String(apiServiceName)}`);
      }
      // 只为本服务的相对 API 请求附带令牌，不向其他地址或登录接口泄露。
      const baseURL = options.baseURL ?? apiBaseUrls[apiServiceName];
      // 本次请求的相对路径。
      const url = typeof options.url === 'string' ? options.url : '';
      // 保留调用方已有请求头。
      const headers = { ...options.headers };
      // 当前登录令牌，仅在浏览器读取。
      const token = typeof window === 'undefined' ? null : getAccessToken();
      if (
        apiServiceName === 'yiyancha' &&
        baseURL === apiBaseUrls.yiyancha &&
        url.startsWith('/api/v1/') &&
        url.split(/[?#]/, 1)[0] !== '/api/v1/auth/login' &&
        token &&
        !Object.keys(headers).some(
          (key) => key.toLowerCase() === 'authorization',
        )
      ) {
        headers.Authorization = `Bearer ${token}`;
      }
      return {
        ...options,
        baseURL,
        headers,
      };
    },
  ],
  responseInterceptors: [
    (response: any) => {
      // 仅处理明确标记为失败的业务响应，保留原响应供调用方使用。
      const data: unknown = response.data;
      if (
        data &&
        typeof data === 'object' &&
        'success' in data &&
        data.success === false
      ) {
        // 兼容接口返回的 msg 和 message 字段。
        const result = data as {
          code?: number;
          msg?: string;
          message?: string;
        };
        message.error(result.msg || result.message || '请求失败');
        if (result.code === 401 && typeof window !== 'undefined') {
          clearLoginSession();
          // 重新加载以清除内存中的用户状态，登录页无需重复跳转。
          if (window.location.pathname !== '/login') {
            window.location.replace('/login');
          }
        }
      }
      return response;
    },
  ],
};

export const getInitialState = loadCurrentSession;

export { layout } from '@/components/AdminLayout/config';
