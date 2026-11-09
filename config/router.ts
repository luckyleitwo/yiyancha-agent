import type { defineConfig } from '@umijs/max';

type Routes = NonNullable<Parameters<typeof defineConfig>[0]['routes']>;
const routes: Routes = [
  { path: '/login', component: './Login', layout: false },
  { path: '/', redirect: '/agent/dashboard' },
  {
    name: '工作空间',
    path: '/',
    routes: [
      {
        name: '首页看板',
        path: '/agent/dashboard',
        component: './agent/Home',
        layoutIcon: 'grid',
      },
    ],
  },
  {
    name: '客户与产品',
    path: '/agent',
    routes: [
      {
        name: '企业客户',
        path: '/agent/companies',
        component: './agent/Companies',
        layoutIcon: 'building',
      },
      {
        name: '客户账号',
        path: '/agent/members',
        component: './agent/Members',
        layoutIcon: 'users',
      },
      {
        name: '可接入产品',
        path: '/agent/catalog',
        component: './agent/Catalog',
        layoutIcon: 'box',
      },
      {
        name: '产品开通',
        path: '/agent/openings',
        component: './agent/Openings',
        layoutIcon: 'key',
      },
      {
        name: '销售定价',
        path: '/agent/prices',
        component: './agent/Prices',
        layoutIcon: 'tag',
      },
      {
        name: '组合产品',
        path: '/agent/bundles',
        component: './agent/Bundles',
        layoutIcon: 'layers',
      },
    ],
  },
  {
    name: '业务与收益',
    path: '/agent',
    routes: [
      {
        name: '客户查询记录',
        path: '/agent/orders',
        component: './agent/Orders',
        layoutIcon: 'list',
      },
    ],
  },
];
export default routes;
