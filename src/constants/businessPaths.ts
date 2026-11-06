export const businessPaths = {
  companies: '/customers/companies',
  orders: '/customers/orders',
  products: '/services/products',
  recharges: '/finance/recharges',
  agents: '/finance/agents',
  reports: '/system/reports',
  help: '/system/help',
} as const;

export const reportPath = (id: string) =>
  `${businessPaths.reports}/${encodeURIComponent(id)}`;
