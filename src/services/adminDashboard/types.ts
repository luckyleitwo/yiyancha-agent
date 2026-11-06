export interface DashboardRecord {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  version?: number;
  _demo?: boolean;
}

export interface Company extends DashboardRecord {
  contact: string;
  industry: string;
  phone?: string;
  creditCode?: string;
  address?: string;
  notes?: string;
  agentId?: string;
}

export interface Agent extends DashboardRecord {
  contact: string;
  level: string;
  type?: string;
  phone?: string;
  parentId?: string;
  bankAccount?: string;
  notes?: string;
}

export interface Product extends DashboardRecord {
  category: string;
  price: number;
  code?: string;
  content?: string;
  inputs?: string;
  scene?: string;
  duration?: string;
  notes?: string;
}

export interface Recharge extends DashboardRecord {
  companyId: string;
  amount: number;
  method: string;
  reference?: string;
  paidAt?: string;
  notes?: string;
}

export interface Order extends DashboardRecord {
  companyId: string;
  productId: string;
  subject: string;
  authorization: string;
  amount: number;
  scene: string;
  purpose: string;
  phone?: string;
  notes?: string;
}

export interface Authorization extends DashboardRecord {
  orderId: string;
  subject: string;
  purpose: string;
  expires: string;
}

export interface Report extends DashboardRecord {
  orderId: string;
  summary: string;
  source?: string;
  overall?: string;
  checkedAt?: string;
  reference?: string;
  validUntil?: string;
  notes?: string;
}

export interface OperationLog {
  id: string;
  action: string;
  entity: string;
  record_id: string;
  label: string;
  created_at: string;
}

// 当前开发适配协议，不代表正式后端已提供这些接口。
export interface DashboardData {
  companies: Company[];
  agents: Agent[];
  products: Product[];
  recharges: Recharge[];
  orders: Order[];
  reports: Report[];
  authorizations: Authorization[];
}

export interface DashboardResponse {
  data: DashboardData;
  logs: OperationLog[];
  mode?: 'mock';
  capabilities?: { cancelOrder: boolean; editRecords?: boolean };
}

export interface OrderListQuery {
  keyword: string;
  status: string;
  realOnly: boolean;
  page: number;
  pageSize: number;
}

export interface OrderListResult {
  rows: Order[];
  total: number;
  allCount: number;
  statuses: string[];
  page: number;
}

export interface CancellationResult {
  order: Order;
  authorizations: Authorization[];
  log: OperationLog;
}
