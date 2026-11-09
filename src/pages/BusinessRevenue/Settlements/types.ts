// 代理树结算台账列表参数；日期格式需结合正式接口验证。
export type SettlementQuery = {
  page: number;
  pageSize: number;
  keyword?: string;
  agentId?: string;
  agentName?: string;
  amountMin?: number;
  amountMax?: number;
  periodLabel?: string;
  periodStart?: string;
  periodEnd?: string;
  reference?: string;
  orderId?: string;
  createdFrom?: string;
  createdTo?: string;
  status?: string;
  includeDemo?: boolean;
};
