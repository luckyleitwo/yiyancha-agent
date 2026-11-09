export interface RechargeQuery {
  page: number;
  pageSize: number;
  keyword?: string;
  status?: string;
  includeDemo?: boolean;
  companyName?: string;
  amountMin?: number;
  amountMax?: number;
  paymentMethod?: string;
  paymentReference?: string;
  paymentDateFrom?: string;
  paymentDateTo?: string;
}
