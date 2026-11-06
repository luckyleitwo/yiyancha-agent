# 代理端项目待办

## 初始化
- [x] 基于 `yiyancha-admin-umi` 的当前 Git 版本创建独立项目。
- [x] 初始化 Git 并绑定 `https://github.com/luckyleitwo/yiyancha-agent.git`。
- [x] 清理原页面，仅保留 Login，并移除旧页面路由。
- [x] 清空 `config/service.ts` 的 `apis`；现有登录依赖的生成代码暂时保留。
- [x] 离线安装依赖，`pnpm build` 构建通过。
- [ ] 确认代理端原型位置及首页路由；登录 portal 已调整为 `AGENT`，登录成功暂以消息提示。

## 代理端列表

按照用户提供的代理端接口对照表实施，仅使用列出的筛选参数和已明确的枚举。新增、详情及其他暂不实现的操作仅消息提示；不将结算台账误称为个人收益明细，不将有效价格列表误称为草稿台账。

- [ ] 企业客户 — GET `/api/v1/catalog/companies`（pageSize）
- [ ] 客户账号 — GET `/api/v1/identity/users`（pageSize，portal=BUSINESS）
- [ ] 可接入产品 — GET `/api/v1/catalog/products`（pageSize）
- [ ] 产品开通 — GET `/api/v1/catalog/openings`（pageSize）
- [ ] 销售定价 — GET `/api/v1/catalog/prices`（pageSize）；草稿 GET `/api/v1/catalog/company-price-drafts`（pageSize）
- [ ] 组合产品 — GET `/api/v1/catalog/bundles`（pageSize）
- [ ] 客户查询记录 — GET `/api/v1/agents/orders`（size）
- [ ] 客户充值记录 — GET `/api/v1/agents/recharges`（pageSize）
- [ ] 下级代理 — GET `/api/v1/catalog/agents`（pageSize）
- [ ] 分佣配置 — GET `/api/v1/catalog/agent-policies`（pageSize）
- [ ] 收益明细 — GET `/api/v1/finance/settlements`（pageSize，代理树结算台账）
- [ ] 结算与提现 — GET `/api/v1/finance/withdrawals`（pageSize）
- [ ] 客户报告 — GET `/api/v1/agents/reports`（size）
- [ ] 个人实名认证 — GET `/api/v1/governance/certifications`（size，subjectType=person）
- [ ] 合作协议 — GET `/api/v1/governance/contracts`（size）
- [ ] 安全与操作日志 — GET `/api/v1/identity/audit-logs`（pageSize）
- [ ] 构建及使用测试账号进行登录和各列表接口联调。

具体筛选字段和状态枚举以用户提供的代理端对照表为准；不得臆造未列明的枚举。
