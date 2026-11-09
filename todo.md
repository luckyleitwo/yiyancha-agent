# 代理端项目待办

## 初始化
- [x] 基于 `yiyancha-admin-umi` 的当前 Git 版本创建独立项目。
- [x] 初始化 Git 并绑定 `https://github.com/luckyleitwo/yiyancha-agent.git`。
- [x] 清理原页面，仅保留 Login，并移除旧页面路由。
- [x] 清空 `config/service.ts` 的 `apis`；现有登录依赖的生成代码暂时保留。
- [x] 离线安装依赖，`pnpm build` 构建通过。
- [x] 代理端原型路径已确认；登录 portal 已调整为 `AGENT`，登录后进入首页看板。

## 代理端列表

按照用户提供的代理端接口对照表实施，仅使用列出的筛选参数和已明确的枚举。新增、详情及其他暂不实现的操作仅消息提示；不将结算台账误称为个人收益明细，不将有效价格列表误称为草稿台账。

- [x] 企业客户（代码及构建完成，待真实接口联调） — GET `/api/v1/catalog/companies`（pageSize）
- [x] 客户账号（代码及构建完成，待真实接口联调） — GET `/api/v1/identity/users`（pageSize，portal 取登录缓存；与原对照表 BUSINESS 筛选不同，待联调确认）
- [x] 可接入产品（代码及构建完成，待真实接口联调） — GET `/api/v1/catalog/products`（pageSize）
- [x] 产品开通（代码及构建完成，待真实接口联调和浏览器验收） — GET `/api/v1/catalog/openings`（pageSize）
- [ ] 销售定价 — 当前有效价格列表代码及构建完成（GET `/api/v1/catalog/prices`，待联调与视觉验收）；企业专属价格草稿列表是否同页展示待确认（GET `/api/v1/catalog/company-price-drafts`）。
- [x] 组合产品（代码及构建完成，待真实接口联调和浏览器验收） — GET `/api/v1/catalog/bundles`（pageSize）
- [ ] 客户查询记录 — GET `/api/v1/agents/orders`（size）：列表代码及构建完成；代理端响应结构、状态枚举、真实接口联调与浏览器验收待确认。
- [ ] 客户充值记录 — GET `/api/v1/agents/recharges`（pageSize）：列表代码已实现，代理端响应结构、付款日期筛选格式与真实接口联调、浏览器验收待确认。
- [ ] 下级代理 — GET `/api/v1/catalog/agents`（pageSize，固定 descendantsOnly=true）：列表代码完成；状态枚举、真实接口联调与浏览器验收待确认。
- [ ] 分佣配置 — GET `/api/v1/catalog/agent-policies`（pageSize）：列表代码完成；真实接口联调与浏览器验收待完成。
- [ ] 收益明细 — GET `/api/v1/finance/ownSettlements`（pageSize，本人及下属代理结算单）：接口路径和响应结构已核对 OpenAPI；日期参数、真实账号联调与浏览器验收待验证。
- [ ] 结算与提现 — GET `/api/v1/finance/withdrawals`（pageSize）
- [ ] 客户报告 — GET `/api/v1/agents/reports`（size）
- [ ] 个人实名认证 — GET `/api/v1/governance/certifications`（size，subjectType=person）
- [ ] 合作协议 — GET `/api/v1/governance/contracts`（size）
- [ ] 安全与操作日志 — GET `/api/v1/identity/audit-logs`（pageSize）
- [ ] 构建及使用测试账号进行登录和各列表接口联调。

具体筛选字段和状态枚举以用户提供的代理端对照表为准；不得臆造未列明的枚举。
- [ ] 清理或迁移继承自中台、引用已删除页面和 mock 的旧测试；当前 `pnpm exec tsc --noEmit` 因这些旧测试报错，生产构建通过。

## 首页看板
- [x] 复用原中台首页组件与样式，按代理端原型调整；接入 `/api/v1/catalog/dashboard` 可用汇总字段。
- [ ] 结算金额、待办数量和业务趋势缺少已确认的汇总数据来源，当前以 `—` 或空状态显示，不使用模拟数字；待接口确认后接入。
- [ ] 已完成页面构建，待实际登录及接口联调、浏览器视觉验收。

## 目录与产品页面系分
- [x] 已有代理页面路由组件调整到 `src/pages/agent/`，原登录页保留。
- [ ] 产品开通、销售定价有效价格列表和组合产品已按要求实施；销售定价草稿范围待确认，详见 `页面系分-产品与定价.md`。

- [x] 按原型菜单分组整理代理端页面目录：工作空间、客户与产品、业务与收益；保留原 URL。

- [x] 页面分类已调整到 `src/pages/`，旧 `src/pages/agent/` 已清理。
