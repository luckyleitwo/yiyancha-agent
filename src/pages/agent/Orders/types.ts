// 代理端订单列表筛选参数；分页使用接口要求的 size。
export type OrderQuery = {
  orderId?: string;
  batchNo?: string;
  companyId?: string;
  companyName?: string;
  subjectName?: string;
  productId?: string;
  productName?: string;
  agentName?: string;
  minQuantity?: number;
  maxQuantity?: number;
  minPaid?: number;
  maxPaid?: number;
  createdFrom?: string;
  createdTo?: string;
  status?: string;
  authorizationStatus?: string;
  includeDemo?: boolean;
  page?: number;
  size?: number;
};
