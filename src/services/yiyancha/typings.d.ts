declare namespace YiyanchaAPI {
  type AccountBindingRequest = {
    /** 目标门户账号编号 */
    userId: string;
    /** 目标企业编号；企业账号绑定时填写 */
    companyId?: string;
    /** 目标代理编号；代理账号绑定时填写 */
    agentId?: string;
  };

  type AccountRequest = {
    /** 登录名，3至64位英文字母、数字或 ._@- */
    loginName: string;
    /** 初始密码，至少12位并同时包含字母和数字 */
    password: string;
    /** 账号显示名称 */
    displayName: string;
    /** 可选的可委派角色编号；为空不分配任何角色 */
    roleIds?: string[];
  };

  type AccountView = {
    /** 账户编号 */
    accountId?: string;
    /** 可用余额（元） */
    availableAmount?: number;
    /** 冻结余额（元） */
    frozenAmount?: number;
    /** 待结算余额（元） */
    pendingAmount?: number;
  };

  type adminRechargesParams = {
    /** 页码，从1开始 */
    page?: string;
    /** 每页条数，最大100 */
    pageSize?: string;
    /** 可选状态筛选；省略时查询当前数据范围内全部状态 */
    status?: string;
    /** 企业编号筛选；仅 ADMIN 财务列表使用 */
    companyId?: string;
    /** 代理编号筛选；仅 ADMIN 财务列表使用 */
    agentId?: string;
    /** 资金方向筛选；账户流水仅支持 IN、OUT、PENDING、FREEZE、UNFREEZE */
    direction?: string;
    /** 提现收款账户完整值精确筛选；服务端转换为HMAC盲索引 */
    bankAccount?: string;
    /** 是否包含示例记录 */
    includeDemo?: string;
    /** 可选关键字；根据接口用途匹配名称或编号 */
    keyword?: string;
    /** 企业名称模糊筛选 */
    companyName?: string;
    /** 代理名称模糊筛选 */
    agentName?: string;
    /** 充值金额下限 */
    amountMin?: string;
    /** 充值金额上限 */
    amountMax?: string;
    /** 支付方式精确筛选 */
    paymentMethod?: string;
    /** 支付凭证编号模糊筛选 */
    paymentReference?: string;
    /** 充值日期起 */
    paymentDateFrom?: string;
    /** 充值日期止 */
    paymentDateTo?: string;
    /** 发票类型精确筛选 */
    invoiceType?: string;
    /** 发票号码模糊筛选 */
    invoiceNo?: string;
    /** 付款参考号模糊筛选 */
    payoutReference?: string;
    /** 结算周期模糊筛选 */
    periodLabel?: string;
    /** 资金记录创建日期起 */
    createdFrom?: string;
    /** 资金记录创建日期止 */
    createdTo?: string;
    /** 结算周期开始日期精确筛选 */
    periodStart?: string;
    /** 结算周期结束日期精确筛选 */
    periodEnd?: string;
    /** 结算关联订单编号精确筛选 */
    orderId?: string;
    /** 结算参考号模糊筛选 */
    reference?: string;
  };

  type adminSettlementsParams = {
    /** 页码，从1开始 */
    page?: string;
    /** 每页条数，最大100 */
    pageSize?: string;
    /** 可选状态筛选；省略时查询当前数据范围内全部状态 */
    status?: string;
    /** 企业编号筛选；仅 ADMIN 财务列表使用 */
    companyId?: string;
    /** 代理编号筛选；仅 ADMIN 财务列表使用 */
    agentId?: string;
    /** 资金方向筛选；账户流水仅支持 IN、OUT、PENDING、FREEZE、UNFREEZE */
    direction?: string;
    /** 提现收款账户完整值精确筛选；服务端转换为HMAC盲索引 */
    bankAccount?: string;
    /** 是否包含示例记录 */
    includeDemo?: string;
    /** 可选关键字；根据接口用途匹配名称或编号 */
    keyword?: string;
    /** 企业名称模糊筛选 */
    companyName?: string;
    /** 代理名称模糊筛选 */
    agentName?: string;
    /** 充值金额下限 */
    amountMin?: string;
    /** 充值金额上限 */
    amountMax?: string;
    /** 支付方式精确筛选 */
    paymentMethod?: string;
    /** 支付凭证编号模糊筛选 */
    paymentReference?: string;
    /** 充值日期起 */
    paymentDateFrom?: string;
    /** 充值日期止 */
    paymentDateTo?: string;
    /** 发票类型精确筛选 */
    invoiceType?: string;
    /** 发票号码模糊筛选 */
    invoiceNo?: string;
    /** 付款参考号模糊筛选 */
    payoutReference?: string;
    /** 结算周期模糊筛选 */
    periodLabel?: string;
    /** 资金记录创建日期起 */
    createdFrom?: string;
    /** 资金记录创建日期止 */
    createdTo?: string;
    /** 结算周期开始日期精确筛选 */
    periodStart?: string;
    /** 结算周期结束日期精确筛选 */
    periodEnd?: string;
    /** 结算关联订单编号精确筛选 */
    orderId?: string;
    /** 结算参考号模糊筛选 */
    reference?: string;
  };

  type AgentContractUpdate = {
    title: string;
    contractNo?: string;
    expiresAt?: string;
  };

  type AgentCreateRequest = {
    /** 代理名称 */
    name: string;
    /** 代理类型：ENTERPRISE 企业代理、INDIVIDUAL 个人代理 */
    agentType?: string;
    /** 联系人姓名 */
    contactName?: string;
    /** 联系人手机号；AES-256-GCM 加密保存，列表仅返回遮蔽提示 */
    phone?: string;
    /** 收款银行账号；AES-256-GCM 加密保存，列表仅返回遮蔽提示 */
    bankAccount?: string;
    /** 代理备注 */
    notes?: string;
    /** 上级代理编号；为空时创建根代理 */
    parentId?: string;
    account: AccountRequest;
  };

  type AgentPage = {
    /** 当前页代理记录 */
    items?: Organization[];
    /** 当前页码，从1开始 */
    page?: number;
    /** 每页条数，最大100 */
    pageSize?: number;
    /** 符合当前代理树范围的总记录数 */
    total?: number;
    /** 当前代理树范围内的代理总数，不受分页影响 */
    scopeTotal?: number;
  };

  type AgentPolicy = {
    /** 政策编号 */
    id?: string;
    /** 适用代理编号 */
    agentId?: string;
    /** 适用代理名称 */
    agentName?: string;
    /** 政策名称 */
    name?: string;
    /** 可售产品名称，逗号分隔 */
    productNames?: string;
    /** 可售产品编号集合 */
    productIds?: string[];
    /** 分佣比例百分数 */
    commissionRate?: number;
    /** 生效时间 */
    effectiveFrom?: string;
    /** 失效时间 */
    effectiveUntil?: string;
    /** 政策状态 */
    status?: string;
    /** 政策备注 */
    remark?: string;
    /** 创建时间 */
    createdAt?: string;
  };

  type AgentPolicyDraftRequest = {
    /** 政策名称 */
    name: string;
    /** 分佣比例百分数；仅保存草稿，不改变现有订单计提规则 */
    commissionRate: number;
    /** 计划生效时间 */
    effectiveFrom: string;
    /** 计划失效时间 */
    effectiveUntil?: string;
    remark?: string;
    productIds: string[];
  };

  type AgentPriceRequest = {
    /** 对下销售单价，金额非负且最多两位小数 */
    salePrice: number;
  };

  type AgentProfile = {
    /** 代理名称 */
    name: string;
    /** 代理类型：ENTERPRISE 企业代理、INDIVIDUAL 个人代理 */
    agentType: string;
    /** 联系人姓名 */
    contactName: string;
    /** 联系人手机号；AES-256-GCM 加密存储 */
    phone: string;
    /** 收款账号；AES-256-GCM 加密存储 */
    bankAccount?: string;
    /** 代理备注 */
    notes?: string;
  };

  type AgentSettlementRequest = {
    /** 本次申请幂等UUID，重试沿用 */
    requestId: string;
    /** 申请结算周期起始日期 */
    periodStart: string;
    /** 申请结算周期结束日期 */
    periodEnd: string;
    /** 申请说明 */
    note?: string;
    periodValid?: boolean;
  };

  type AgentSettlementRequestNote = {
    /** 申请说明 */
    note?: string;
  };

  type AgentSettlementRequestView = {
    /** 申请编号 */
    id?: string;
    /** 所属代理编号 */
    agentId?: string;
    /** 所属代理名称 */
    agentName?: string;
    /** 周期起始日 */
    periodStart?: string;
    /** 周期结束日 */
    periodEnd?: string;
    /** 申请说明 */
    note?: string;
    /** 处理说明 */
    reviewNote?: string;
    /** 申请状态：pending/approved/rejected */
    status?: string;
    /** ADMIN 执行后关联的真实结算单编号 */
    settlementId?: string;
    /** 申请时间 */
    createdAt?: string;
    /** 处理时间 */
    reviewedAt?: string;
  };

  type ApiResponseAccountView = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: AccountView;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseAgentPage = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: AgentPage;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseAgentPolicy = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: AgentPolicy;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseAgentSettlementRequestView = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: AgentSettlementRequestView;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseAuthorizationPage = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: AuthorizationPage;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseBundle = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: Bundle;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseCertification = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: Certification;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseCompanyPage = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: CompanyPage;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseCompanyPermissionPage = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: CompanyPermissionPage;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseCompanyPriceDraft = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: CompanyPriceDraft;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseContract = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: Contract;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseCreatedResult = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: CreatedResult;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseCurrentUserResult = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: CurrentUserResult;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseDashboard = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: Dashboard;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseDictionaryRecord = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: DictionaryRecord;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseHealthResult = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: HealthResult;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseIncomePage = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: IncomePage;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseInvoiceSensitiveView = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: InvoiceSensitiveView;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseListDictionaryItem = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    /** 响应业务数据；无数据时为 null */
    data?: DictionaryItem[];
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseListIncomeSnapshot = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    /** 响应业务数据；无数据时为 null */
    data?: IncomeSnapshot[];
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseListLoginLogRecord = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    /** 响应业务数据；无数据时为 null */
    data?: LoginLogRecord[];
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseListOrderView = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    /** 响应业务数据；无数据时为 null */
    data?: OrderView[];
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseListPageAgentPolicy = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: ListPageAgentPolicy;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseListPageBundle = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: ListPageBundle;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseListPageCompanyPriceDraft = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: ListPageCompanyPriceDraft;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseListPageOpening = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: ListPageOpening;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseListPagePrice = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: ListPagePrice;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseListRole = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    /** 响应业务数据；无数据时为 null */
    data?: Role[];
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseListString = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    /** 响应业务数据；无数据时为 null */
    data?: string[];
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseLoginResult = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: LoginResult;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseOpening = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: Opening;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseOperationsOverview = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: OperationsOverview;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseOrderPage = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: OrderPage;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseOrderView = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: OrderView;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseOrganization = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: Organization;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponsePageAgentSettlementRequestView = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: PageAgentSettlementRequestView;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponsePageAuditLogRecord = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: PageAuditLogRecord;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponsePageCertification = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: PageCertification;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponsePageChannel = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: PageChannel;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponsePageContract = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: PageContract;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponsePageDictionaryRecord = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: PageDictionaryRecord;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponsePageInvoiceView = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: PageInvoiceView;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponsePageLedgerView = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: PageLedgerView;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponsePagePermission = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: PagePermission;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponsePageRechargeView = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: PageRechargeView;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponsePageRole = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: PageRole;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponsePageSettlementHistory = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: PageSettlementHistory;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponsePageSettlementItemView = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: PageSettlementItemView;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponsePageSupplier = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: PageSupplier;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponsePageTemplate = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: PageTemplate;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponsePageUser = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: PageUser;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponsePageWithdrawalView = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: PageWithdrawalView;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseProduct = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: Product;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseProductPage = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: ProductPage;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseQuote = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: Quote;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseRechargeView = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: RechargeView;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseReportPage = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: ReportPage;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseReportView = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: ReportView;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseSensitiveValue = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: SensitiveValue;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseSettlementView = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: SettlementView;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseString = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    /** 响应业务数据；无数据时为 null */
    data?: string;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseTicketPage = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: TicketPage;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseUser = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: User;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseVoid = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    /** 响应业务数据；无数据时为 null */
    data?: Record<string, any>;
    /** 响应提示信息 */
    message?: string;
  };

  type ApiResponseWithdrawalView = {
    /** 响应状态码；成功为 200，失败为原 HTTP 状态码 */
    code?: number;
    /** 请求是否处理成功 */
    success?: boolean;
    data?: WithdrawalView;
    /** 响应提示信息 */
    message?: string;
  };

  type AuditLogRecord = {
    id?: string;
    userId?: string;
    userName?: string;
    action?: string;
    resourceType?: string;
    resourceId?: string;
    source?: string;
    ipAddress?: string;
    createdAt?: string;
  };

  type auditLogsParams = {
    action?: string;
    resourceType?: string;
    userName?: string;
    createdFrom?: string;
    createdTo?: string;
    source?: string;
    page?: number;
    pageSize?: number;
  };

  type AuthorizationConfirmRequest = {
    /** 授权材料核验方式 */
    verificationMethod: string;
    /** 核验依据或材料编号，不要填写证件原文 */
    evidenceReference: string;
  };

  type AuthorizationPage = {
    items?: AuthorizationView[];
    total?: number;
    page?: number;
    size?: number;
    scopeTotal?: number;
  };

  type AuthorizationView = {
    /** 授权记录编号 */
    authorizationId?: string;
    /** 关联订单编号 */
    orderId?: string;
    /** 订单批次号 */
    batchNo?: string;
    /** 所属企业名称 */
    companyName?: string;
    /** 授权对象姓名；由授权密文解出，不返回证件信息 */
    subjectName?: string;
    /** 核验产品名称 */
    productName?: string;
    /** 授权用途 */
    purpose?: string;
    /** 授权状态 */
    status?: string;
    /** 授权有效截止时间 */
    validUntil?: string;
    /** 授权签署时间 */
    signedAt?: string;
    /** 关联订单创建时间 */
    createdAt?: string;
  };

  type BatchCreateRequest = {
    /** 重试时复用的批次幂等号 */
    batchNo: string;
    /** 批次中每位核验对象及其产品数量 */
    subjects: BatchSubject[];
    /** 授权用途 */
    purpose: string;
    /** 授权有效截止时间 */
    validUntil: string;
    /** 全批次报价确认金额；不得作为扣款金额来源 */
    confirmedQuote: number;
  };

  type BatchSubject = {
    subject: Subject;
    /** 该对象购买的产品和数量 */
    items: OrderLine[];
  };

  type Bundle = {
    /** 组合编号 */
    id?: string;
    /** 组合业务编码 */
    code?: string;
    /** 组合名称 */
    name?: string;
    /** 展示价格，不作为订单计价来源 */
    displayPrice?: number;
    /** 适用场景 */
    usageScene?: string;
    /** 部分失败处理规则 */
    failureRule?: string;
    /** 组合状态 */
    status?: string;
    /** 归属代理编号；为空表示平台组合 */
    ownerAgentId?: string;
    /** 创建时间 */
    createdAt?: string;
    /** 是否示例数据 */
    isDemo?: boolean;
    /** 组合内产品 */
    items?: ProductItem[];
  };

  type BundleRequest = {
    /** 组合业务编码 */
    code: string;
    /** 组合名称 */
    name: string;
    displayPrice?: number;
    usageScene?: string;
    failureRule?: string;
    status?: string;
    /** 组合内产品编号；至少一项且不能重复 */
    productIds: string[];
  };

  type Certification = {
    /** 认证记录 ID */
    id?: string;
    /** 申请人姓名，鉴权后明文返回 */
    applicantName?: string;
    /** 申请人手机号，鉴权后明文返回 */
    applicantPhone?: string;
    /** 证件号码，鉴权后明文返回 */
    identity?: string;
    /** 提交材料数量 */
    documentCount?: number;
    /** 草稿或申请创建时间 */
    createdAt?: string;
    /** 提交时间 */
    submittedAt?: string;
    /** 申请主体类型 */
    subjectType?: string;
    /** 企业主体 ID */
    companyId?: string;
    /** 代理主体 ID */
    agentId?: string;
    /** 认证状态 */
    status?: string;
    /** 审核完成时间 */
    reviewedAt?: string;
  };

  type CertificationFile = {
    /** 证件文件原始文件名 */
    fileName: string;
    /** 证件文件 Base64 内容，解码后最大 5 MiB */
    fileBase64: string;
  };

  type CertificationRequest = {
    /** 申请人姓名 */
    applicantName?: string;
    /** 申请人手机号 */
    applicantPhone?: string;
    /** 申请主体类型，仅限个人或企业认证 */
    subjectType: string;
    /** 证件号码，仅接收时使用，数据库仅保存加密值 */
    identity?: string;
    /** 代理端企业认证的所属企业 ID；BUSINESS 端不传 */
    companyId?: string;
    /** 本申请的证件附件，最多 5 份且每份最大 5 MiB */
    documents: CertificationFile[];
  };

  type ChangePassword = {
    /** 当前密码 */
    oldPassword: string;
    /** 新密码，须为12至128位且同时包含字母和数字 */
    newPassword: string;
  };

  type Channel = {
    /** 渠道 ID */
    id?: string;
    /** 供应商 ID */
    supplierId?: string;
    /** 渠道编码 */
    code?: string;
    /** 渠道状态 */
    status?: string;
  };

  type ChannelRequest = {
    /** 所属供应商 ID */
    supplierId: string;
    /** 渠道编码 */
    code: string;
    /** 状态编码 active 或 disabled */
    status: string;
    /** 渠道密钥；创建必填，更新留空表示不轮换 */
    secret?: string;
  };

  type channelsParams = {
    /** 渠道编码，包含匹配 */
    code?: string;
    /** 状态：active 或 disabled */
    status?: string;
    /** 供应商 ID，精确匹配 */
    supplierId?: string;
    /** 页码，从 1 开始，最大 1000000 */
    page?: number;
    /** 每页记录数，最大 100 */
    size?: number;
  };

  type CompanyCreateRequest = {
    /** 企业名称 */
    name: string;
    /** 企业联系人姓名 */
    contactName?: string;
    /** 联系人手机号；AES-256-GCM 加密保存，列表仅返回遮蔽提示 */
    phone?: string;
    /** 统一社会信用代码；AES-256-GCM 加密保存，认证状态由 certification 记录独立决定 */
    creditCode?: string;
    /** 所属行业 */
    industry?: string;
    /** 企业地址 */
    address?: string;
    /** 企业备注 */
    notes?: string;
    /** 初始认证状态 */
    certificationStatus?: 'not_submitted' | 'pending' | 'approved' | 'rejected';
    /** 所属代理编号；为空表示中台直管 */
    agentId?: string;
    account: AccountRequest;
  };

  type CompanyPage = {
    /** 当前页企业记录；所属代理名称由 agentName 提供 */
    items?: Organization[];
    /** 当前页码，从1开始 */
    page?: number;
    /** 每页条数，最大100 */
    pageSize?: number;
    /** 符合当前门户和代理筛选条件的总记录数 */
    total?: number;
    /** 当前登录账号门户数据范围内的企业总数；不受关键字、状态、示例、代理、创建人或分页条件影响 */
    scopeTotal?: number;
  };

  type CompanyPermissionItem = {
    /** 权限记录编号 */
    id?: string;
    /** 企业编号 */
    companyId?: string;
    /** 企业名称 */
    companyName?: string;
    /** 产品编号 */
    productId?: string;
    /** 产品编码 */
    productCode?: string;
    /** 产品名称 */
    productName?: string;
    /** 每日核验次数上限；空表示不限制 */
    dailyLimit?: number;
    /** 是否允许查看报告 */
    canViewReport?: boolean;
    /** 是否允许下载报告 */
    canDownloadReport?: boolean;
    /** 权限状态：active 或 disabled */
    status?: string;
    /** 所属企业是否为示例数据 */
    isDemo?: boolean;
    /** 适用场景说明；可为空 */
    usageScene?: string;
    /** 创建时间；历史数据可能为空 */
    createdAt?: string;
  };

  type CompanyPermissionPage = {
    /** 当前页权限记录 */
    items?: CompanyPermissionItem[];
    /** 当前页码，从1开始 */
    page?: number;
    /** 每页条数，最大100 */
    pageSize?: number;
    /** 符合门户范围及筛选条件的权限记录总数 */
    total?: number;
    /** 当前门户范围内企业产品权限记录数；不受过滤条件和分页影响 */
    scopeTotal?: number;
  };

  type CompanyPriceDraft = {
    id?: string;
    agentId?: string;
    companyId?: string;
    companyName?: string;
    productId?: string;
    productName?: string;
    salePrice?: number;
    status?: string;
    note?: string;
    createdAt?: string;
    updatedAt?: string;
  };

  type CompanyPriceDraftRequest = {
    /** 拟设置的销售单价 */
    salePrice: number;
    /** 草稿备注 */
    note?: string;
  };

  type CompanyPriceRequest = {
    /** 企业专属销售单价，须不低于代理供货价 */
    salePrice: number;
  };

  type CompanyProfile = {
    /** 企业名称 */
    name: string;
    /** 联系人姓名 */
    contactName: string;
    /** 联系人手机号；AES-256-GCM 加密存储 */
    phone: string;
    /** 统一社会信用代码；AES-256-GCM 加密存储，后续仍需独立认证审核 */
    creditCode?: string;
    /** 所属行业 */
    industry?: string;
    /** 企业地址 */
    address?: string;
    /** 企业备注 */
    notes?: string;
  };

  type Contract = {
    /** 合同记录 ID */
    id?: string;
    /** 合同类型编码 */
    contractType?: string;
    /** 合同标题 */
    title?: string;
    /** 合同编号 */
    contractNo?: string;
    /** 合同到期时间 */
    expiresAt?: string;
    /** 合同创建时间 */
    createdAt?: string;
    /** 是否示例数据 */
    isDemo?: boolean;
    /** 合同主体类型 */
    subjectType?: string;
    /** 合同主体 ID */
    subjectId?: string;
    /** 所属企业名称 */
    companyName?: string;
    /** 所属代理名称 */
    agentName?: string;
    /** 合同状态 */
    status?: string;
    /** 人工确认时间；不代表第三方电子签署时间 */
    signedAt?: string;
  };

  type ContractRequest = {
    /** 合同标题 */
    title: string;
    /** 合同编号 */
    contractNo?: string;
    /** 合同到期时间 */
    expiresAt?: string;
    /** 合同类型编码 */
    contractType: string;
    /** 主体类型 company 或 agent */
    subjectType: string;
    /** 合同所属企業或代理 ID */
    subjectId: string;
    /** 合同文件 Base64 内容，将以 AES-GCM 加密存储 */
    documentBase64?: string;
  };

  type contractsParams = {
    /** 合同状态：pending 或 signed */
    status?: string;
    /** 合同类型编码，精确匹配 */
    contractType?: string;
    /** 主体类型：company 或 agent */
    subjectType?: string;
    /** 主体 ID，精确匹配 */
    subjectId?: string;
    /** 所属企业名称，包含匹配 */
    companyName?: string;
    /** 所属代理名称，包含匹配 */
    agentName?: string;
    /** 合同标题，包含匹配 */
    title?: string;
    /** 合同编号，精确匹配 */
    contractNo?: string;
    /** 是否示例数据 */
    isDemo?: boolean;
    /** 页码，从 1 开始，最大 1000000 */
    page?: number;
    /** 每页记录数，最大 100 */
    size?: number;
  };

  type CreatedResult = {
    /** 新建资源唯一标识 */
    id?: string;
  };

  type CreatePermission = {
    /** 稳定权限编码 */
    code: string;
    /** 权限名称 */
    name: string;
    /** 资源类型，例如 menu 或 api */
    type: string;
    /** 父级权限标识；顶级权限留空 */
    parentId?: string;
  };

  type CreateRequest = {
    /** 客户端生成并在重试时复用的批次幂等号 */
    batchNo: string;
    subject: Subject;
    /** 授权用途 */
    purpose: string;
    /** 授权有效截止时间，必须晚于当前时间 */
    validUntil: string;
    /** 报价确认金额；必须等于服务端当前报价，仅用于发现价格变化 */
    confirmedQuote: number;
    /** 产品和数量 */
    items: OrderLine[];
  };

  type CreateRole = {
    /** 稳定角色编码 */
    code: string;
    /** 角色名称 */
    name: string;
    /** 数据范围编码 */
    dataScope: string;
    /** 是否允许按门户白名单委派；默认为 false */
    delegatable?: boolean;
    /** 可委派门户白名单；BUSINESS、AGENT；仅 delegatable=true 时可填写 */
    delegationPortals?: string[];
  };

  type CreateUser = {
    /** 登录账号 */
    loginName: string;
    /** 初始密码，须为12至128位且同时包含字母和数字 */
    password: string;
    /** 账号显示名称 */
    displayName: string;
    /** 创建账号所属门户；中台成员管理可创建 BUSINESS 或 AGENT */
    portal: string;
    /** 目标企业标识；BUSINESS 账号必填，中台创建时须为有效企业 */
    companyId?: string;
    /** 目标代理标识；AGENT 账号必填，中台创建时须为有效代理 */
    agentId?: string;
    /** 邮箱；AES-256-GCM 加密保存，可选 */
    email?: string;
    /** 手机号；AES-256-GCM 加密保存，可选 */
    phone?: string;
    /** 部门或项目，可选 */
    department?: string;
    /** 成员备注，可选 */
    notes?: string;
    /** 创建后关联的可委派角色ID；只允许分配权限为操作者权限子集的角色 */
    roleIds?: string[];
  };

  type CurrentUserResult = {
    /** 账号唯一标识 */
    userId?: string;
    /** 账号显示名称 */
    displayName?: string;
    /** 账号所属端：BUSINESS、AGENT 或 ADMIN */
    portal?: string;
    /** 所属企业编号；非企业账号时为空 */
    companyId?: string;
    /** 所属代理编号；非代理账号时为空 */
    agentId?: string;
    /** 账号已分配的角色编码列表 */
    roles?: string[];
  };

  type Dashboard = {
    /** 当前数据范围内企业总数 */
    companyCount?: number;
    /** 当前数据范围内代理总数；企业门户固定为0 */
    agentCount?: number;
    /** 当前数据范围内订单总数 */
    orderCount?: number;
    /** 当前数据范围内状态为 completed 的订单数 */
    completedOrderCount?: number;
    /** 当前数据范围内报告总数 */
    reportCount?: number;
  };

  type DictionaryItem = {
    /** 字典项编码 */
    code?: string;
    /** 字典项显示名称 */
    label?: string;
    /** 字典项说明 */
    description?: string;
    /** 字典项排序值，数值越小越靠前 */
    sortOrder?: number;
  };

  type DictionaryRecord = {
    id?: string;
    key?: string;
    name?: string;
    from?: string;
  };

  type HealthResult = {
    /** 服务状态，UP 表示正常 */
    status?: string;
  };

  type IdListRequest = {
    /** 本次替换后保留的角色编号或权限编号列表；最多200项，空数组表示清空分配 */
    ids: string[];
  };

  type IncomePage = {
    /** 收益记录 */
    items?: IncomeView[];
    /** 匹配记录总数 */
    total?: number;
    /** 当前代理本人收益总数，不受筛选条件影响 */
    scopeTotal?: number;
    /** 页码，从1开始 */
    page?: number;
    /** 每页记录数 */
    size?: number;
  };

  type IncomeSnapshot = {
    /** 代理账号编号 */
    agentId?: string;
    /** 代理从上级获得的结算价 */
    supplyPrice?: number;
    /** 代理提供给下级的销售价 */
    salePrice?: number;
    /** 该级代理获得的差价收益 */
    incomeAmount?: number;
  };

  type IncomeView = {
    /** 订单ID */
    orderId?: string;
    /** 产品名称 */
    productName?: string;
    /** 订单状态 */
    orderStatus?: string;
    /** 本代理收益状态 */
    incomeStatus?: string;
    /** 本代理订单收益总额，已乘购买数量 */
    incomeAmount?: number;
    /** 创建时间 */
    createdAt?: string;
  };

  type InvoiceIssueRequest = {
    /** 人工开票后登记的发票号码 */
    invoiceNo: string;
  };

  type InvoiceRequest = {
    /** 客户端为本次申请生成的UUID；重试沿用该值 */
    requestId: string;
    /** 申请金额（元），必须大于0且不超过企业剩余可开票额度 */
    amount: number;
    /** 发票类型，如增值税普通发票、增值税专用发票 */
    invoiceType: string;
    /** 发票抬头；服务端加密保存 */
    receiver: string;
    /** 纳税人识别号；服务端加密保存 */
    taxId: string;
    /** 发票接收邮箱；AES-GCM 加密保存 */
    receiverEmail: string;
  };

  type InvoiceSensitiveView = {
    /** 发票抬头 */
    receiver?: string;
    /** 纳税人识别号 */
    taxId?: string;
    /** 发票接收邮箱 */
    receiverEmail?: string;
    /** 发票类型 */
    invoiceType?: string;
    /** 申请金额（元） */
    amount?: number;
    /** 当前状态 */
    status?: string;
  };

  type InvoiceView = {
    /** 发票申请编号 */
    id?: string;
    /** 企业编号；仅 ADMIN 列表包含 */
    companyId?: string;
    /** 申请金额（元） */
    amount?: number;
    /** 状态：pending、approved、issued、rejected */
    status?: string;
    /** 发票号码；待开票时为空 */
    invoiceNo?: string;
    /** 发票抬头 */
    receiver?: string;
    /** 所属企业名称 */
    companyName?: string;
    /** 发票类型 */
    invoiceType?: string;
    /** 接收邮箱 */
    receiverEmail?: string;
    /** 纳税人识别号 */
    taxId?: string;
    /** 申请时间 */
    createdAt?: string;
  };

  type LedgerView = {
    /** 流水编号 */
    id?: string;
    /** 关联业务类型 */
    businessType?: string;
    /** 关联业务编号 */
    businessId?: string;
    /** 资金事件方向：IN、OUT、PENDING、FREEZE 或 UNFREEZE */
    direction?: string;
    /** 发生金额（元） */
    amount?: number;
    /** 变动后可用余额（元） */
    balanceAfter?: number;
    /** 记账时间 */
    createdAt?: string;
    /** 账户归属类型：COMPANY 或 AGENT */
    ownerType?: string;
    /** 账户归属主体编号 */
    ownerId?: string;
    /** 账户归属主体名称 */
    ownerName?: string;
  };

  type listAgentPoliciesParams = {
    /** 页码，从1开始 */
    page?: number;
    /** 每页条数，范围1至100 */
    pageSize?: number;
    name?: string;
    agentName?: string;
    productName?: string;
    productId?: string;
    agentId?: string;
    minCommissionRate?: number;
    maxCommissionRate?: number;
    status?: string;
  };

  type listAgentsParams = {
    /** 中台可指定代理树根编号；代理端只能查询自身树 */
    rootId?: string;
    name?: string;
    contactName?: string;
    agentType?: string;
    level?: number;
    parentId?: string;
    parentName?: string;
    status?: string;
    includeDemo?: boolean;
    /** 是否排除rootId对应代理本人；默认false保持原树查询行为 */
    descendantsOnly?: boolean;
    /** 页码，从1开始 */
    page?: number;
    /** 每页条数，范围1至100 */
    pageSize?: number;
  };

  type listAuthorizations2Params = {
    page?: number;
    size?: number;
    authorizationId?: string;
    orderId?: string;
    batchNo?: string;
    companyName?: string;
    productName?: string;
    purpose?: string;
    validUntilFrom?: string;
    validUntilTo?: string;
    status?: string;
    includeDemo?: boolean;
  };

  type listBundlesParams = {
    name?: string;
    productId?: string;
    productName?: string;
    usageScene?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    includeDemo?: boolean;
    page?: number;
    pageSize?: number;
  };

  type listCompaniesParams = {
    /** 中台可按代理筛选；代理门户的范围始终由当前会话决定 */
    agentId?: string;
    /** 企业创建人用户编号；仅 ADMIN 可传；直接匹配 company.created_by */
    created_by?: string;
    /** 兼容参数；与 created_by 同传时必须相同；仅 ADMIN 可传 */
    creatorId?: string;
    /** 是否只查询当前登录用户创建的企业；true 时不能同时传 created_by/creatorId */
    onlyMine?: boolean;
    /** 企业名称、联系人或关联信息关键字；手机号/统一社会信用代码只支持完整精确匹配 */
    keyword?: string;
    name?: string;
    contactName?: string;
    phone?: string;
    industry?: string;
    agentName?: string;
    /** 认证状态：not_submitted 待认证、pending 审核中、approved 已认证、rejected 已驳回；不传表示全部 */
    certificationStatus?: string;
    /** 是否包含示例记录，true 包含，false 隐藏示例；默认 true */
    includeDemo?: boolean;
    /** 页码，从1开始 */
    page?: number;
    /** 每页条数，范围1至100 */
    pageSize?: number;
  };

  type listOpeningsParams = {
    companyId?: string;
    companyName?: string;
    productId?: string;
    productName?: string;
    status?: string;
    usagePurpose?: string;
    createdFrom?: string;
    createdTo?: string;
    /** 页码，从1开始 */
    page?: number;
    /** 每页记录数，1至100 */
    pageSize?: number;
  };

  type ListPageAgentPolicy = {
    /** 当前页记录 */
    items?: AgentPolicy[];
    /** 当前页码 */
    page?: number;
    /** 每页条数 */
    pageSize?: number;
    /** 符合筛选条件的总数 */
    total?: number;
    /** 当前数据范围内未受筛选影响的总数 */
    scopeTotal?: number;
  };

  type ListPageBundle = {
    /** 当前页记录 */
    items?: Bundle[];
    /** 当前页码 */
    page?: number;
    /** 每页条数 */
    pageSize?: number;
    /** 符合筛选条件的总数 */
    total?: number;
    /** 当前数据范围内未受筛选影响的总数 */
    scopeTotal?: number;
  };

  type ListPageCompanyPriceDraft = {
    /** 当前页记录 */
    items?: CompanyPriceDraft[];
    /** 当前页码 */
    page?: number;
    /** 每页条数 */
    pageSize?: number;
    /** 符合筛选条件的总数 */
    total?: number;
    /** 当前数据范围内未受筛选影响的总数 */
    scopeTotal?: number;
  };

  type ListPageOpening = {
    /** 当前页记录 */
    items?: Opening[];
    /** 当前页码 */
    page?: number;
    /** 每页条数 */
    pageSize?: number;
    /** 符合筛选条件的总数 */
    total?: number;
    /** 当前数据范围内未受筛选影响的总数 */
    scopeTotal?: number;
  };

  type ListPagePrice = {
    /** 当前页记录 */
    items?: Price[];
    /** 当前页码 */
    page?: number;
    /** 每页条数 */
    pageSize?: number;
    /** 符合筛选条件的总数 */
    total?: number;
    /** 当前数据范围内未受筛选影响的总数 */
    scopeTotal?: number;
  };

  type listPricesParams = {
    /** 可选代理编号；ADMIN 省略或留空查询全部代理当前有效报价，企业或代理门户不以此扩大范围 */
    agentId?: string;
    agentName?: string;
    productId?: string;
    productName?: string;
    minSalePrice?: number;
    maxSalePrice?: number;
    minSupplyPrice?: number;
    maxSupplyPrice?: number;
    page?: number;
    pageSize?: number;
  };

  type listProductsParams = {
    name?: string;
    code?: string;
    category?: string;
    minDisplayPrice?: number;
    maxDisplayPrice?: number;
    duration?: string;
    /** 产品状态筛选；all 或省略表示全部 */
    status?: string;
    /** 是否包含示例产品 */
    includeDemo?: boolean;
    /** 页码，从1开始 */
    page?: number;
    /** 每页条数，范围1至100 */
    pageSize?: number;
  };

  type listReports2Params = {
    /** 页码，从1开始 */
    page?: number;
    /** 每页记录数，1至100 */
    size?: number;
    reportId?: string;
    companyName?: string;
    productName?: string;
    conclusion?: string;
    source?: string;
    createdFrom?: string;
    createdTo?: string;
    companyId?: string;
    productId?: string;
    title?: string;
    status?: string;
    verifiedFrom?: string;
    verifiedTo?: string;
    subjectName?: string;
    includeDemo?: boolean;
  };

  type LoginLogRecord = {
    /** 本次尝试提交的登录账号 */
    accountIdentifier?: string;
    /** 登录时间 */
    loginAt?: string;
    /** 退出登录时间；尚未退出时为空 */
    logoutAt?: string;
    /** 登录入口：business、agent 或 admin */
    portalCode?: string;
    /** 本次登录是否成功 */
    success?: boolean;
    /** 登录失败原因；登录成功时为空 */
    failureReason?: string;
    /** 登录来源 IP 地址 */
    remoteIp?: string;
    /** 登录客户端 User-Agent 信息 */
    userAgent?: string;
    /** 退出登录原因；未退出时为空 */
    logoutReason?: string;
  };

  type LoginRequest = {
    /** 登录账号 */
    loginName: string;
    /** 登录密码 */
    password: string;
    /** 登录端类型：BUSINESS 企业端、AGENT 代理端、ADMIN 中台端 */
    portal: string;
  };

  type LoginResult = {
    /** 登录后签发的访问令牌 */
    accessToken?: string;
    /** 令牌过期时间 */
    expiresAt?: string;
    /** 账号唯一标识 */
    userId?: string;
    /** 账号登录名 */
    loginName?: string;
    /** 账号显示名称 */
    displayName?: string;
    /** 账号所属端：BUSINESS、AGENT 或 ADMIN */
    portal?: string;
    /** 所属企业编号；非企业账号时为空 */
    companyId?: string;
    /** 所属代理编号；非代理账号时为空 */
    agentId?: string;
    /** 账号已分配的角色编码列表 */
    roles?: string[];
    /** 令牌类型，固定为 Bearer */
    tokenType?: string;
  };

  type Opening = {
    /** 申请编号 */
    id?: string;
    /** 申请主体类型：COMPANY 或 AGENT */
    applicantType?: string;
    /** 申请主体编号 */
    applicantId?: string;
    /** 申请用途 */
    usagePurpose?: string;
    /** 申请时间 */
    createdAt?: string;
    /** 企业名称；企业申请时有值 */
    companyName?: string;
    /** 代理名称；代理申请时有值 */
    agentName?: string;
    /** 产品编号 */
    productId?: string;
    /** 产品名称 */
    productName?: string;
    /** 申请状态：pending、approved 或 rejected */
    status?: string;
    /** 审核时间 */
    reviewedAt?: string;
    permission?: PermissionView;
  };

  type OpeningRequest = {
    /** 申请开通的产品编号 */
    productId: string;
    /** 代理为树内企业代申请时的企业编号；留空表示代理自身申请 */
    companyId?: string;
    /** 开通用途 */
    usagePurpose?: string;
  };

  type OpeningReviewRequest = {
    /** 是否批准申请 */
    approved: boolean;
    permission?: PermissionRequest;
  };

  type OpeningUpdateRequest = {
    /** 开通用途 */
    usagePurpose?: string;
  };

  type OperationsOverview = {
    /** 已确认充值金额（元） */
    confirmedRechargeAmount?: number;
    /** 待审核充值金额（元） */
    pendingRechargeAmount?: number;
    /** 充值申请数量 */
    rechargeCount?: number;
    /** 发票申请数量 */
    invoiceCount?: number;
  };

  type operationsOverviewParams = {
    /** 页码，从1开始 */
    page?: string;
    /** 每页条数，最大100 */
    pageSize?: string;
    /** 可选状态筛选；省略时查询当前数据范围内全部状态 */
    status?: string;
    /** 企业编号筛选；仅 ADMIN 财务列表使用 */
    companyId?: string;
    /** 代理编号筛选；仅 ADMIN 财务列表使用 */
    agentId?: string;
    /** 资金方向筛选；账户流水仅支持 IN、OUT、PENDING、FREEZE、UNFREEZE */
    direction?: string;
    /** 提现收款账户完整值精确筛选；服务端转换为HMAC盲索引 */
    bankAccount?: string;
    /** 是否包含示例记录 */
    includeDemo?: string;
    /** 可选关键字；根据接口用途匹配名称或编号 */
    keyword?: string;
    /** 企业名称模糊筛选 */
    companyName?: string;
    /** 代理名称模糊筛选 */
    agentName?: string;
    /** 充值金额下限 */
    amountMin?: string;
    /** 充值金额上限 */
    amountMax?: string;
    /** 支付方式精确筛选 */
    paymentMethod?: string;
    /** 支付凭证编号模糊筛选 */
    paymentReference?: string;
    /** 充值日期起 */
    paymentDateFrom?: string;
    /** 充值日期止 */
    paymentDateTo?: string;
    /** 发票类型精确筛选 */
    invoiceType?: string;
    /** 发票号码模糊筛选 */
    invoiceNo?: string;
    /** 付款参考号模糊筛选 */
    payoutReference?: string;
    /** 结算周期模糊筛选 */
    periodLabel?: string;
    /** 资金记录创建日期起 */
    createdFrom?: string;
    /** 资金记录创建日期止 */
    createdTo?: string;
    /** 结算周期开始日期精确筛选 */
    periodStart?: string;
    /** 结算周期结束日期精确筛选 */
    periodEnd?: string;
    /** 结算关联订单编号精确筛选 */
    orderId?: string;
    /** 结算参考号模糊筛选 */
    reference?: string;
  };

  type OrderLine = {
    /** 产品ID */
    productId: string;
    /** 购买数量 */
    quantity: number;
  };

  type OrderPage = {
    /** 订单记录 */
    items?: OrderView[];
    /** 匹配记录总数 */
    total?: number;
    /** 页码，从1开始 */
    page?: number;
    /** 每页记录数 */
    size?: number;
    /** 当前门户权限范围内、未应用筛选条件的订单总数 */
    scopeTotal?: number;
  };

  type OrderView = {
    /** 订单ID */
    orderId?: string;
    /** 批次号 */
    batchNo?: string;
    /** 企业名称 */
    companyName?: string;
    /** 授权对象姓名；历史或旧字段缺失时为空，不返回证件信息 */
    subjectName?: string;
    /** 产品名称 */
    productName?: string;
    /** 购买数量 */
    quantity?: number;
    /** 企业应付金额 */
    amount?: number;
    /** 订单状态 */
    status?: string;
    /** 授权状态 */
    authorizationStatus?: string;
    /** 授权用途 */
    purpose?: string;
    /** 授权有效截止时间 */
    authorizationValidUntil?: string;
    /** 创建时间 */
    createdAt?: string;
    /** 是否为示例订单；根据订单ID或批次号前缀判定 */
    isDemo?: boolean;
  };

  type Organization = {
    /** 组织编号 */
    id?: string;
    /** 组织名称 */
    name?: string;
    /** 状态 */
    status?: string;
    /** 主体创建时间 */
    createdAt?: string;
    /** 代理上级编号；企业条目表示所属代理 */
    parentId?: string;
    /** 代理上级名称 */
    parentName?: string;
    /** 企业直接所属代理编号 */
    agentId?: string;
    /** 企业直接所属代理名称；未分配代理时为空 */
    agentName?: string;
    /** 创建该主体的用户编号；历史记录可能为空 */
    createdBy?: string;
    /** 创建该主体的用户显示名称；历史记录可能为空 */
    createdByName?: string;
    /** 组织类型：AGENT（代理） 或 COMPANY（公司） */
    type?: string;
    /** 联系人姓名 */
    contactName?: string;
    /** 联系人电话；返回明文 */
    phone?: string;
    /** 企业统一社会信用代码；仅企业适用，返回明文 */
    creditCode?: string;
    /** 所属行业；仅企业适用 */
    industry?: string;
    /** 是否为示例数据；示例记录编号以 demo- 开头 */
    isDemo?: boolean;
    /** 企业地址；仅企业适用 */
    address?: string;
    /** 代理类型；仅代理适用 */
    agentType?: string;
    /** 代理收款账号；仅代理适用，返回明文 */
    bankAccount?: string;
    /** 备注 */
    notes?: string;
    /** 代理在父链中的层级；根代理为1，不接收客户端设置 */
    level?: number;
    /** 企业认证展示状态：pending、approved、rejected 或 not_submitted，由 certification 记录推导，存在任意待审认证时显示 pending；否则按 reviewed_at 最新、再按 id 倒序取最近已审核记录，approved 显示已认证，rejected 显示已驳回；无记录显示 not_submitted。 */
    certificationStatus?: string;
  };

  type OrganizationStatusRequest = {
    /** 经营状态：pending 待处理、active 启用、disabled 停用；不改变认证记录 */
    status: string;
  };

  type OrganizationUpdateRequest = {
    /** 名称；不传保留，非空时更新 */
    name?: string;
    /** 联系人姓名；空字符串清空 */
    contactName?: string;
    /** 手机号；未传、null、空白或遮蔽值均保留原密文 */
    phone?: string;
    /** 信用代码；未传、null、空白或遮蔽值均保留原密文 */
    creditCode?: string;
    /** 仅中台编辑企业时可传所属代理编号；未传或null保持原归属，空字符串解除代理归属 */
    agentId?: string;
    /** 代理类型：ENTERPRISE 或 INDIVIDUAL */
    agentType?: string;
    /** 收款账号；未传、null、空白或遮蔽值均保留原密文 */
    bankAccount?: string;
    /** 所属行业；空字符串清空 */
    industry?: string;
    /** 企业地址；空字符串清空 */
    address?: string;
    /** 备注；空字符串清空 */
    notes?: string;
  };

  type PageAgentSettlementRequestView = {
    /** 当前页 */
    page?: number;
    /** 每页条数 */
    pageSize?: number;
    /** 筛选后总数 */
    total?: number;
    /** 当前数据范围内未受筛选影响的总数 */
    scopeTotal?: number;
    /** 当前页记录 */
    items?: AgentSettlementRequestView[];
  };

  type PageAuditLogRecord = {
    /** 当前页码 */
    page?: number;
    /** 每页条数 */
    pageSize?: number;
    /** 筛选后总数 */
    total?: number;
    /** 当前权限范围内未受筛选影响的总数 */
    scopeTotal?: number;
    /** 当前页记录 */
    items?: AuditLogRecord[];
  };

  type PageCertification = {
    /** 当前页记录 */
    items?: Certification[];
    /** 当前页码，从 1 开始 */
    page?: number;
    /** 每页条数，最大 100 */
    size?: number;
    /** 符合条件的总记录数 */
    total?: number;
    /** 当前门户范围内未受筛选影响的总记录数 */
    scopeTotal?: number;
  };

  type PageChannel = {
    /** 当前页记录 */
    items?: Channel[];
    /** 当前页码，从 1 开始 */
    page?: number;
    /** 每页条数，最大 100 */
    size?: number;
    /** 符合条件的总记录数 */
    total?: number;
    /** 当前门户范围内未受筛选影响的总记录数 */
    scopeTotal?: number;
  };

  type PageContract = {
    /** 当前页记录 */
    items?: Contract[];
    /** 当前页码，从 1 开始 */
    page?: number;
    /** 每页条数，最大 100 */
    size?: number;
    /** 符合条件的总记录数 */
    total?: number;
    /** 当前门户范围内未受筛选影响的总记录数 */
    scopeTotal?: number;
  };

  type PageDictionaryRecord = {
    current?: number;
    size?: number;
    total?: number;
    records?: DictionaryRecord[];
  };

  type PageInvoiceView = {
    /** 当前页 */
    page?: number;
    /** 每页条数 */
    pageSize?: number;
    /** 筛选后总数 */
    total?: number;
    /** 当前数据范围内未受筛选影响的总数 */
    scopeTotal?: number;
    /** 当前页记录 */
    items?: InvoiceView[];
  };

  type PageLedgerView = {
    /** 当前页 */
    page?: number;
    /** 每页条数 */
    pageSize?: number;
    /** 筛选后总数 */
    total?: number;
    /** 当前数据范围内未受筛选影响的总数 */
    scopeTotal?: number;
    /** 当前页记录 */
    items?: LedgerView[];
  };

  type PagePermission = {
    /** 当前页码 */
    page?: number;
    /** 每页条数 */
    pageSize?: number;
    /** 筛选后总数 */
    total?: number;
    /** 当前权限范围内未受筛选影响的总数 */
    scopeTotal?: number;
    /** 当前页记录 */
    items?: Permission[];
  };

  type PageRechargeView = {
    /** 当前页 */
    page?: number;
    /** 每页条数 */
    pageSize?: number;
    /** 筛选后总数 */
    total?: number;
    /** 当前数据范围内未受筛选影响的总数 */
    scopeTotal?: number;
    /** 当前页记录 */
    items?: RechargeView[];
  };

  type PageRole = {
    /** 当前页码 */
    page?: number;
    /** 每页条数 */
    pageSize?: number;
    /** 筛选后总数 */
    total?: number;
    /** 当前权限范围内未受筛选影响的总数 */
    scopeTotal?: number;
    /** 当前页记录 */
    items?: Role[];
  };

  type PageSettlementHistory = {
    /** 当前页 */
    page?: number;
    /** 每页条数 */
    pageSize?: number;
    /** 筛选后总数 */
    total?: number;
    /** 当前数据范围内未受筛选影响的总数 */
    scopeTotal?: number;
    /** 当前页记录 */
    items?: SettlementHistory[];
  };

  type PageSettlementItemView = {
    /** 当前页 */
    page?: number;
    /** 每页条数 */
    pageSize?: number;
    /** 筛选后总数 */
    total?: number;
    /** 当前数据范围内未受筛选影响的总数 */
    scopeTotal?: number;
    /** 当前页记录 */
    items?: SettlementItemView[];
  };

  type PageSupplier = {
    /** 当前页记录 */
    items?: Supplier[];
    /** 当前页码，从 1 开始 */
    page?: number;
    /** 每页条数，最大 100 */
    size?: number;
    /** 符合条件的总记录数 */
    total?: number;
    /** 当前门户范围内未受筛选影响的总记录数 */
    scopeTotal?: number;
  };

  type PageTemplate = {
    /** 当前页记录 */
    items?: Template[];
    /** 当前页码，从 1 开始 */
    page?: number;
    /** 每页条数，最大 100 */
    size?: number;
    /** 符合条件的总记录数 */
    total?: number;
    /** 当前门户范围内未受筛选影响的总记录数 */
    scopeTotal?: number;
  };

  type PageUser = {
    /** 当前页码 */
    page?: number;
    /** 每页条数 */
    pageSize?: number;
    /** 筛选后总数 */
    total?: number;
    /** 当前权限范围内未受筛选影响的总数 */
    scopeTotal?: number;
    /** 当前页记录 */
    items?: User[];
  };

  type PageWithdrawalView = {
    /** 当前页 */
    page?: number;
    /** 每页条数 */
    pageSize?: number;
    /** 筛选后总数 */
    total?: number;
    /** 当前数据范围内未受筛选影响的总数 */
    scopeTotal?: number;
    /** 当前页记录 */
    items?: WithdrawalView[];
  };

  type PayoutRequest = {
    /** 银行回单号或人工打款凭证编号，写入操作审计 */
    reference: string;
  };

  type pendingInvoicesParams = {
    /** 页码，从1开始 */
    page?: string;
    /** 每页条数，最大100 */
    pageSize?: string;
    /** 可选状态筛选；省略时查询当前数据范围内全部状态 */
    status?: string;
    /** 企业编号筛选；仅 ADMIN 财务列表使用 */
    companyId?: string;
    /** 代理编号筛选；仅 ADMIN 财务列表使用 */
    agentId?: string;
    /** 资金方向筛选；账户流水仅支持 IN、OUT、PENDING、FREEZE、UNFREEZE */
    direction?: string;
    /** 提现收款账户完整值精确筛选；服务端转换为HMAC盲索引 */
    bankAccount?: string;
    /** 是否包含示例记录 */
    includeDemo?: string;
    /** 可选关键字；根据接口用途匹配名称或编号 */
    keyword?: string;
    /** 企业名称模糊筛选 */
    companyName?: string;
    /** 代理名称模糊筛选 */
    agentName?: string;
    /** 充值金额下限 */
    amountMin?: string;
    /** 充值金额上限 */
    amountMax?: string;
    /** 支付方式精确筛选 */
    paymentMethod?: string;
    /** 支付凭证编号模糊筛选 */
    paymentReference?: string;
    /** 充值日期起 */
    paymentDateFrom?: string;
    /** 充值日期止 */
    paymentDateTo?: string;
    /** 发票类型精确筛选 */
    invoiceType?: string;
    /** 发票号码模糊筛选 */
    invoiceNo?: string;
    /** 付款参考号模糊筛选 */
    payoutReference?: string;
    /** 结算周期模糊筛选 */
    periodLabel?: string;
    /** 资金记录创建日期起 */
    createdFrom?: string;
    /** 资金记录创建日期止 */
    createdTo?: string;
    /** 结算周期开始日期精确筛选 */
    periodStart?: string;
    /** 结算周期结束日期精确筛选 */
    periodEnd?: string;
    /** 结算关联订单编号精确筛选 */
    orderId?: string;
    /** 结算参考号模糊筛选 */
    reference?: string;
  };

  type pendingWithdrawalsParams = {
    /** 页码，从1开始 */
    page?: string;
    /** 每页条数，最大100 */
    pageSize?: string;
    /** 可选状态筛选；省略时查询当前数据范围内全部状态 */
    status?: string;
    /** 企业编号筛选；仅 ADMIN 财务列表使用 */
    companyId?: string;
    /** 代理编号筛选；仅 ADMIN 财务列表使用 */
    agentId?: string;
    /** 资金方向筛选；账户流水仅支持 IN、OUT、PENDING、FREEZE、UNFREEZE */
    direction?: string;
    /** 提现收款账户完整值精确筛选；服务端转换为HMAC盲索引 */
    bankAccount?: string;
    /** 是否包含示例记录 */
    includeDemo?: string;
    /** 可选关键字；根据接口用途匹配名称或编号 */
    keyword?: string;
    /** 企业名称模糊筛选 */
    companyName?: string;
    /** 代理名称模糊筛选 */
    agentName?: string;
    /** 充值金额下限 */
    amountMin?: string;
    /** 充值金额上限 */
    amountMax?: string;
    /** 支付方式精确筛选 */
    paymentMethod?: string;
    /** 支付凭证编号模糊筛选 */
    paymentReference?: string;
    /** 充值日期起 */
    paymentDateFrom?: string;
    /** 充值日期止 */
    paymentDateTo?: string;
    /** 发票类型精确筛选 */
    invoiceType?: string;
    /** 发票号码模糊筛选 */
    invoiceNo?: string;
    /** 付款参考号模糊筛选 */
    payoutReference?: string;
    /** 结算周期模糊筛选 */
    periodLabel?: string;
    /** 资金记录创建日期起 */
    createdFrom?: string;
    /** 资金记录创建日期止 */
    createdTo?: string;
    /** 结算周期开始日期精确筛选 */
    periodStart?: string;
    /** 结算周期结束日期精确筛选 */
    periodEnd?: string;
    /** 结算关联订单编号精确筛选 */
    orderId?: string;
    /** 结算参考号模糊筛选 */
    reference?: string;
  };

  type Permission = {
    /** 权限唯一标识 */
    id?: string;
    /** 稳定权限编码，创建后不可修改 */
    code?: string;
    /** 权限名称 */
    name?: string;
    /** 资源类型，例如 menu 或 api */
    type?: string;
    /** 父级权限标识；顶级权限为空 */
    parentId?: string;
    /** 权限状态：active 启用、disabled 停用 */
    status?: string;
  };

  type PermissionRequest = {
    /** 每日核验次数上限；为空表示不设置上限 */
    dailyLimit?: number;
    /** 是否允许查看报告 */
    canViewReport: boolean;
    /** 是否允许下载报告 */
    canDownloadReport: boolean;
    /** 适用场景说明，可选，最多500字 */
    usageScene?: string;
  };

  type permissionsParams = {
    name?: string;
    code?: string;
    type?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  };

  type PermissionView = {
    /** 每日核验上限 */
    dailyLimit?: number;
    /** 是否可查看报告 */
    canViewReport?: boolean;
    /** 是否可下载报告 */
    canDownloadReport?: boolean;
    /** 权限状态 */
    status?: string;
    /** 适用场景；历史数据可能为空 */
    usageScene?: string;
    /** 创建时间；历史数据可能为空 */
    createdAt?: string;
  };

  type PersonalCertificationDraft = {
    applicantName: string;
    applicantPhone: string;
    identity?: string;
    documents?: CertificationFile[];
  };

  type PreviewRequest = {
    /** 从上级到下级排列的代理价格链 */
    tiers: PriceTierRequest[];
    /** 企业实际支付金额 */
    companyPaid: number;
  };

  type Price = {
    /** 代理编号；中台全局查询用于区分代理价格 */
    agentId?: string;
    /** 代理名称；中台全局查询用于区分代理价格 */
    agentName?: string;
    /** 产品编号 */
    productId?: string;
    /** 产品名称 */
    productName?: string;
    /** 供货单价，仅中台或该代理本人可见；企业端响应不包含此字段 */
    supplyPrice?: number;
    /** 销售单价或企业专属价 */
    salePrice?: number;
    /** 价格版本 */
    version?: number;
    /** 价格生效时间 */
    effectiveFrom?: string;
    /** 价格失效时间 */
    effectiveTo?: string;
    /** 是否命中企业专属价 */
    companySpecific?: boolean;
  };

  type PriceTierRequest = {
    /** 代理账号编号 */
    agentId: string;
    /** 该代理从上级获得的结算价 */
    supplyPrice: number;
    /** 该代理提供给下级的销售价 */
    salePrice: number;
  };

  type Product = {
    /** 产品编号 */
    id?: string;
    /** 产品业务编码 */
    code?: string;
    /** 产品名称 */
    name?: string;
    /** 产品分类 */
    category?: string;
    /** 目录展示价格，不用于订单计价 */
    displayPrice?: number;
    /** 核验内容说明 */
    content?: string;
    /** 必要资料说明 */
    requiredInputs?: string;
    /** 适用场景 */
    usageScene?: string;
    /** 预计耗时 */
    duration?: string;
    /** 状态 */
    status?: string;
    /** 创建时间 */
    createdAt?: string;
    /** 是否为示例产品 */
    isDemo?: boolean;
  };

  type ProductItem = {
    /** 产品编号 */
    productId?: string;
    /** 产品业务编码 */
    code?: string;
    /** 产品名称 */
    name?: string;
    /** 产品数量 */
    quantity?: number;
  };

  type ProductPage = {
    /** 当前页产品 */
    items?: Product[];
    /** 当前页码，从1开始 */
    page?: number;
    /** 每页条数，最大100 */
    pageSize?: number;
    /** 符合门户可见状态范围的产品总数 */
    total?: number;
    /** 当前门户可见范围内产品总数，不受筛选影响 */
    scopeTotal?: number;
  };

  type ProductRequest = {
    /** 产品业务编码 */
    code: string;
    /** 产品名称 */
    name: string;
    /** 产品分类 */
    category?: string;
    /** 目录展示价格，不用于订单计价 */
    displayPrice?: number;
    /** 核验内容说明 */
    content?: string;
    /** 必要资料说明 */
    requiredInputs?: string;
    /** 适用场景 */
    usageScene?: string;
    /** 预计耗时 */
    duration?: string;
    /** 产品状态：draft、pending、active 或 disabled */
    status: string;
  };

  type Quote = {
    /** 报价明细 */
    items?: QuoteLine[];
    /** 企业应付总金额 */
    totalAmount?: number;
  };

  type QuoteLine = {
    /** 产品ID */
    productId?: string;
    /** 产品名称 */
    productName?: string;
    /** 购买数量 */
    quantity?: number;
    /** 服务端核定企业单价 */
    unitPrice?: number;
    /** 该产品行应付金额 */
    lineAmount?: number;
  };

  type QuoteRequest = {
    /** 拟购买的产品和数量 */
    items: OrderLine[];
  };

  type RechargeEditRequest = {
    /** 充值金额（元） */
    amount: number;
    /** 付款方式 */
    paymentMethod: string;
    /** 银行流水号或付款凭证号 */
    paymentReference: string;
    /** 实际付款日期 */
    paymentDate: string;
    /** 付款凭证；服务端加密保存 */
    proof: string;
  };

  type RechargeRequest = {
    /** 目标企业编号；AGENT 代直接客户提交时必填，BUSINESS 请求忽略 */
    companyId?: string;
    /** 客户端为本次申请生成的UUID；重试沿用该值 */
    requestId: string;
    /** 充值金额（元），必须大于0 */
    amount: number;
    /** 付款方式，如对公转账 */
    paymentMethod: string;
    /** 银行流水号或付款凭证号 */
    paymentReference: string;
    /** 实际付款日期 */
    paymentDate: string;
    /** 付款凭证文本或凭证编号；服务端加密保存 */
    proof: string;
  };

  type RechargeView = {
    /** 充值申请编号 */
    id?: string;
    /** 企业编号；ADMIN 审核队列与代理树列表包含 */
    companyId?: string;
    /** 充值金额（元） */
    amount?: number;
    /** 状态：pending、confirmed、rejected */
    status?: string;
    /** 审核时间 */
    reviewedAt?: string;
    /** 所属企业名称 */
    companyName?: string;
    /** 企业联系人 */
    contactName?: string;
    /** 是否示例记录 */
    isDemo?: boolean;
    /** 付款方式 */
    paymentMethod?: string;
    /** 银行流水号或付款凭证号 */
    paymentReference?: string;
    /** 付款日期 */
    paymentDate?: string;
    /** 申请时间 */
    createdAt?: string;
    /** 已鉴权后解密的付款凭证内容 */
    proof?: string;
  };

  type RegisterRequest = {
    /** 注册登录账号 */
    loginName: string;
    /** 登录密码，长度12至128位且须包含字母和数字 */
    password: string;
    /** 用户显示名称 */
    displayName: string;
    /** 注册端类型：BUSINESS 企业端或 AGENT 代理端 */
    portal: string;
    companyProfile?: CompanyProfile;
    agentProfile?: AgentProfile;
  };

  type ReportCompleteRequest = {
    /** 报告标题；不传时使用产品名称加核验报告 */
    title?: string;
    /** 人工录入结论 */
    conclusion: string;
    /** 人工核验说明或数据来源 */
    source: string;
    /** 报告明细 */
    items: ReportItem[];
  };

  type ReportItem = {
    /** 明细编码 */
    itemCode: string;
    /** 核验结果 */
    result: string;
    /** 明细补充内容；AES-GCM加密保存 */
    detail?: string;
  };

  type ReportItemView = {
    /** 明细编码 */
    itemCode?: string;
    /** 核验结果 */
    result?: string;
    /** 敏感核验补充内容；需独立敏感查看权限 */
    detailPlaintext?: string;
  };

  type ReportPage = {
    /** 报告记录 */
    items?: ReportView[];
    /** 匹配记录总数 */
    total?: number;
    /** 当前主体可见范围内未受筛选影响的报告总数 */
    scopeTotal?: number;
    /** 页码，从1开始 */
    page?: number;
    /** 每页记录数 */
    size?: number;
  };

  type ReportView = {
    /** 报告ID */
    reportId?: string;
    /** 报告标题 */
    title?: string;
    /** 报告状态 */
    status?: string;
    /** 报告核验时间 */
    verifiedAt?: string;
    /** 关联订单ID */
    orderId?: string;
    /** 所属企业名称 */
    companyName?: string;
    /** 授权对象姓名；从当前有效授权密文解出，不返回证件信息 */
    subjectName?: string;
    /** 产品名称 */
    productName?: string;
    /** 报告结论 */
    conclusion?: string;
    /** 数据来源 */
    source?: string;
    /** 报告授权有效截止时间 */
    validUntil?: string;
    /** 报告创建时间 */
    createdAt?: string;
    /** 报告明细；敏感补充内容默认不解密 */
    items?: ReportItemView[];
  };

  type ReviewRequest = {
    /** 审核结果，仅支持人工通过或驳回 */
    status: string;
    /** 人工审核说明，不代表权威机构核验结果 */
    note?: string;
  };

  type Role = {
    /** 角色唯一标识 */
    id?: string;
    /** 稳定角色编码，创建后不可修改 */
    code?: string;
    /** 角色名称 */
    name?: string;
    /** 数据范围编码 */
    dataScope?: string;
    /** 角色状态：active 启用、disabled 停用 */
    status?: string;
    /** 是否允许成员管理流程委派该角色 */
    delegatable?: boolean;
    /** 允许委派给的门户编码白名单 */
    delegationPortals?: string[];
  };

  type rolesParams = {
    name?: string;
    code?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  };

  type RootSupplyPriceRequest = {
    /** 根代理供货单价，金额非负且最多两位小数 */
    supplyPrice: number;
  };

  type SensitiveValue = {
    /** 经主体鉴权、审计后解密的凭证内容 */
    value?: string;
  };

  type SettlementHistory = {
    /** 结算单编号 */
    id?: string;
    /** 代理编号 */
    agentId?: string;
    /** 代理名称 */
    agentName?: string;
    /** 结算金额（元） */
    amount?: number;
    /** 结算周期开始时间 */
    periodStart?: string;
    /** 结算周期结束时间 */
    periodEnd?: string;
    /** 结算周期标签 */
    periodLabel?: string;
    /** 结算参考编号 */
    reference?: string;
    /** 结算记录创建时间；历史记录可能为空 */
    createdAt?: string;
    /** 结算状态；pending=待结算，ready=可结算，completed=已结算，reversed=退款冲回 */
    status?: 'pending' | 'ready' | 'completed' | 'reversed';
    /** 关联订单编号，多个编号以逗号分隔 */
    orderIds?: string;
  };

  type SettlementItemView = {
    /** 结算收益明细编号 */
    id?: string;
    /** 收益记录编号 */
    incomeId?: string;
    /** 关联已完成订单编号 */
    orderId?: string;
    /** 本次结算金额（元） */
    amount?: number;
  };

  type SettlementRequest = {
    /** 本次结算代理编号 */
    agentId: string;
  };

  type SettlementView = {
    /** 结算单编号 */
    settlementId?: string;
    /** 代理编号 */
    agentId?: string;
    /** 纳入结算的已完成订单收益合计（元） */
    amount?: number;
    /** 纳入结算的收益笔数 */
    itemCount?: number;
  };

  type Subject = {
    /** 对象姓名 */
    name: string;
    /** 对象证件号码；服务端加密保存 */
    identityNumber: string;
    /** 对象联系电话；服务端加密保存 */
    phone?: string;
  };

  type Supplier = {
    /** 供应商 ID */
    id?: string;
    /** 供应商编码 */
    code?: string;
    /** 供应商名称 */
    name?: string;
    /** 供应商状态 */
    status?: string;
  };

  type SupplierRequest = {
    /** 供应商唯一编码 */
    code: string;
    /** 供应商名称 */
    name: string;
    /** 状态编码 active 或 disabled */
    status: string;
  };

  type suppliersParams = {
    /** 供应商名称，包含匹配 */
    name?: string;
    /** 状态：active 或 disabled */
    status?: string;
    /** 页码，从 1 开始，最大 1000000 */
    page?: number;
    /** 每页记录数，最大 100 */
    pageSize?: number;
  };

  type Template = {
    /** 通知模板 ID */
    id?: string;
    /** 模板编码 */
    code?: string;
    /** 消息渠道 */
    channel?: string;
    /** 通知模板正文 */
    content?: string;
    /** 模板状态 */
    status?: string;
  };

  type TemplateRequest = {
    /** 模板唯一业务编码 */
    code: string;
    /** 消息渠道 */
    channel: string;
    /** 通知模板正文 */
    content: string;
    /** 状态编码 active 或 disabled */
    status: string;
  };

  type templatesParams = {
    /** 模板编码，包含匹配 */
    code?: string;
    /** 状态：active 或 disabled */
    status?: string;
    /** 消息渠道，精确匹配 */
    channel?: string;
    /** 页码，从 1 开始，最大 1000000 */
    page?: number;
    /** 每页记录数，最大 100 */
    size?: number;
  };

  type Ticket = {
    /** 工单 ID */
    id?: string;
    /** 所属企业 ID */
    companyId?: string;
    /** 所属企业名称 */
    companyName?: string;
    /** 工单主题 */
    subject?: string;
    /** 问题标题 */
    name?: string;
    /** 工单问题类型 */
    type?: string;
    /** 优先级 */
    priority?: string;
    /** 工单状态 */
    status?: string;
    /** 创建时间 */
    createdAt?: string;
    /** 是否为示例数据 */
    isDemo?: boolean;
  };

  type TicketPage = {
    /** 当前页工单 */
    items?: Ticket[];
    /** 页码，从1开始 */
    page?: number;
    /** 每页条数 */
    size?: number;
    /** 筛选后总数 */
    total?: number;
    /** 当前门户范围内未筛选的工单总数 */
    scopeTotal?: number;
  };

  type TicketRequest = {
    /** 问题标题；兼容旧字段 subject */
    name?: string;
    /** 兼容旧字段：工单主题 */
    subject?: string;
    /** 工单问题类型 */
    type?: string;
    /** 工单优先级 */
    priority?: string;
  };

  type TicketStatusRequest = {
    /** 目标状态 processing、resolved 或 closed */
    status: string;
  };

  type UpdatePermission = {
    /** 权限名称 */
    name: string;
    /** 资源类型，例如 menu 或 api */
    type: string;
    /** 父级权限标识；顶级权限留空 */
    parentId?: string;
    /** 权限状态：active 启用、disabled 停用 */
    status: string;
  };

  type UpdateRole = {
    /** 角色名称 */
    name: string;
    /** 数据范围编码 */
    dataScope: string;
    /** 角色状态：active 启用、disabled 停用 */
    status: string;
    /** 是否允许按门户白名单委派；不传则保留原值 */
    delegatable?: boolean;
    /** 可委派门户白名单；不传保留，空列表清除 */
    delegationPortals?: string[];
  };

  type UpdateUser = {
    /** 账号显示名称；空值不允许，未传或 null 保留 */
    displayName?: string;
    /** 新的登录名；留空保留原值，脱敏值不能提交 */
    loginName?: string;
    /** 新邮箱；未传、null 或空白保留原密文，脱敏值不能提交 */
    email?: string;
    /** 新手机号；未传、null 或空白保留原密文，脱敏值不能提交 */
    phone?: string;
    /** 部门或项目；null 保留，空字符串清空 */
    department?: string;
    /** 账号备注；null 保留，空字符串清空 */
    notes?: string;
    /** 账号状态：active 启用、disabled 停用；null 保留 */
    status?: string;
    /** 新密码；未传或空白不改密码，填写后须为12至128位且同时含字母和数字 */
    password?: string;
    /** 替换为指定可委派角色；null 保留，空列表清空 */
    roleIds?: string[];
  };

  type User = {
    /** 账号唯一标识 */
    id?: string;
    /** 账号显示名称 */
    displayName?: string;
    /** 账号所属端：BUSINESS、AGENT 或 ADMIN */
    portalCode?: string;
    /** 账号状态：active 启用、disabled 停用 */
    status?: string;
    /** 所属企业标识；非企业账号时为空 */
    companyId?: string;
    /** 所属企业名称 */
    companyName?: string;
    /** 所属代理标识；非代理账号时为空 */
    agentId?: string;
    /** 所属代理名称 */
    agentName?: string;
    /** 账号创建时间 */
    createdAt?: string;
    /** 登录账号明文；用于账号识别和资料回显 */
    loginName?: string;
    /** 邮箱明文；仅列表查询响应，不可作为编辑值提交 */
    email?: string;
    /** 手机号明文；仅列表查询响应，不可作为编辑值提交 */
    phone?: string;
    /** 所属部门或项目 */
    department?: string;
    /** 账号备注 */
    notes?: string;
    /** 当前关联角色ID列表 */
    roleIds?: string[];
    /** 当前关联角色名称列表 */
    roleNames?: string[];
  };

  type usersParams = {
    /** 门户筛选：BUSINESS、AGENT 或 ADMIN；非中台不可筛选中台账号 */
    portal?: string;
    displayName?: string;
    loginName?: string;
    email?: string;
    companyName?: string;
    agentName?: string;
    department?: string;
    roleId?: string;
    status?: string;
    companyId?: string;
    page?: number;
    pageSize?: number;
  };

  type UserStatus = {
    /** 目标状态：active 恢复、disabled 停用 */
    status: string;
  };

  type WithdrawalBankAccountRequest = {
    /** 新收款银行账号；服务端加密保存 */
    bankAccount: string;
  };

  type WithdrawalRequest = {
    /** 客户端为本次申请生成的UUID；重试沿用该值 */
    requestId: string;
    /** 提现金额（元），必须大于0 */
    amount: number;
    /** 收款银行账号；服务端加密保存 */
    bankAccount: string;
  };

  type WithdrawalView = {
    /** 提现申请编号 */
    id?: string;
    /** 代理编号；管理端和代理树列表包含 */
    agentId?: string;
    /** 代理名称 */
    agentName?: string;
    /** 提现金额（元） */
    amount?: number;
    /** 状态：pending、approved、paid、rejected */
    status?: string;
    /** 审核时间 */
    reviewedAt?: string;
    /** 收款账户 */
    bankAccount?: string;
    /** 打款回单编号 */
    payoutReference?: string;
    /** 申请时间 */
    createdAt?: string;
  };

  type WriteRequest = {
    /** 字典键 */
    key: string;
    /** 显示名称 */
    name: string;
    /** 来源 */
    from: string;
  };
}
