// 从生成协议中选取客户充值记录页面支持的查询字段。
export type RechargeQuery = Pick<
  YiyanchaAPI.agentRechargesParams,
  | 'page'
  | 'pageSize'
  | 'keyword'
  | 'status'
  | 'includeDemo'
  | 'companyName'
  | 'amountMin'
  | 'amountMax'
  | 'paymentMethod'
  | 'paymentReference'
  | 'paymentDateFrom'
  | 'paymentDateTo'
>;

// 表格使用数字分页和金额，由 model 转成生成协议要求的字符串。
export type RechargeSearchValues = Omit<
  RechargeQuery,
  'page' | 'pageSize' | 'amountMin' | 'amountMax'
> & {
  /** 表格当前页码，从 1 开始。 */
  current?: number;
  /** 每页条数。 */
  pageSize?: number;
  /** 充值金额下限，保留合法的 0。 */
  amountMin?: number;
  /** 充值金额上限。 */
  amountMax?: number;
};
