import type { DashboardEntry } from './type';

export const dashboardShortcuts: DashboardEntry[] = [
  {
    name: '企业客户',
    description: '新增与管理企业资料',
    icon: 'building',
    section: 'companies',
  },
  {
    name: '查询订单',
    description: '追踪业务执行进度',
    icon: 'list',
    section: 'orders',
  },
  {
    name: '产品服务',
    description: '维护产品与业务配置',
    icon: 'box',
    section: 'products',
  },
  {
    name: '资金记录',
    description: '查看充值与到账进度',
    icon: 'wallet',
    section: 'recharges',
  },
];

export const dashboardTasks: DashboardEntry[] = [
  {
    name: '企业待认证',
    description: '完善资料与审核信息',
    icon: 'building',
    section: 'companies',
  },
  {
    name: '待审核充值',
    description: '核对企业付款凭证',
    icon: 'wallet',
    section: 'recharges',
  },
  {
    name: '待审核代理',
    description: '查看新的合作申请',
    icon: 'network',
    section: 'agents',
  },
];
