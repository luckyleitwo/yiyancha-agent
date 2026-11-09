import { defineConfig } from '@umijs/max';
import routes from './config/router';
import services from './config/service';
import { createServiceRuntimeConfig } from './config/serviceRuntime';

const { proxy, baseUrls } = createServiceRuntimeConfig(
  services,
  process.env.NODE_ENV === 'development',
  process.env.UMI_APP_ENV,
);

export default defineConfig({
  antd: {
    theme: {
      token: {
        colorPrimary: '#6954d9',
        colorText: '#252638',
        colorTextSecondary: '#747589',
        colorBorderSecondary: '#eceef4',
        colorBgLayout: '#f6f7fb',
        borderRadius: 7,
        fontFamily: 'Inter, "Segoe UI", "Microsoft YaHei", Arial, sans-serif',
      },
    },
  },
  access: {},
  model: {},
  initialState: {},
  request: {},
  title: '亿眼查 · 代理端',
  favicons: ['/favicon.svg'],
  layout: {
    title: '亿眼查',
  },
  routes,
  proxy,
  define: { __API_BASE_URLS__: baseUrls },
  npmClient: 'pnpm',
  utoopack: {},
});
