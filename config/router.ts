import type { defineConfig } from '@umijs/max';

type Routes = NonNullable<Parameters<typeof defineConfig>[0]['routes']>;
const routes: Routes = [
  { path: '/login', component: './Login', layout: false },
  { path: '/', redirect: '/Workspace/Home' },
  {
    name: '工作空间',
    path: '/Workspace',
    routes: [
      {
        name: '首页看板',
        path: '/Workspace/Home',
        component: './Workspace/Home',
        layoutIcon: 'grid',
      },
    ],
  },
  {
    name: '客户与产品',
    path: '/CustomerProducts',
    routes: [
      {
        name: '企业客户',
        path: '/CustomerProducts/Companies',
        component: './CustomerProducts/Companies',
        layoutIcon: 'building',
      },
      {
        name: '客户账号',
        path: '/CustomerProducts/Members',
        component: './CustomerProducts/Members',
        layoutIcon: 'users',
      },
      {
        name: '可接入产品',
        path: '/CustomerProducts/Catalog',
        component: './CustomerProducts/Catalog',
        layoutIcon: 'box',
      },
      {
        name: '产品开通',
        path: '/CustomerProducts/Openings',
        component: './CustomerProducts/Openings',
        layoutIcon: 'key',
      },
      {
        name: '销售定价',
        path: '/CustomerProducts/Prices',
        component: './CustomerProducts/Prices',
        layoutIcon: 'tag',
      },
      {
        name: '组合产品',
        path: '/CustomerProducts/Bundles',
        component: './CustomerProducts/Bundles',
        layoutIcon: 'layers',
      },
    ],
  },
  {
    name: '业务与收益',
    path: '/BusinessRevenue',
    routes: [
      {
        name: '客户查询记录',
        path: '/BusinessRevenue/Orders',
        component: './BusinessRevenue/Orders',
        layoutIcon: 'list',
      },
      {
        name: '客户充值记录',
        path: '/BusinessRevenue/Recharges',
        component: './BusinessRevenue/Recharges',
        layoutIcon: 'wallet',
      },
      {
        name: '下级代理',
        path: '/BusinessRevenue/Agents',
        component: './BusinessRevenue/Agents',
        layoutIcon: 'network',
      },
      {
        name: '分佣配置',
        path: '/BusinessRevenue/Policies',
        component: './BusinessRevenue/Policies',
        layoutIcon: 'sliders',
      },
      {
        name: '收益明细',
        path: '/BusinessRevenue/Settlements',
        component: './BusinessRevenue/Settlements',
        layoutIcon: 'coins',
      },
    ],
  },
];
export default routes;
