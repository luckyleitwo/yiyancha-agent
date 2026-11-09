// 复用生成协议，仅保留本页使用的筛选项。
export type OrderQuery = Omit<
  YiyanchaAPI.listOrders1Params,
  'status' | 'purpose' | 'validFrom' | 'validTo' | 'isDemo'
>;

export type OrderSearchValues = Omit<
  OrderQuery,
  'page' | 'size' | 'includeDemo'
> & {
  includeDemo?: string;
  current?: number;
  pageSize?: number;
};
