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
- [x] 结算与提现 — GET `/api/v1/finance/withdrawals`（pageSize）：按确认范围完成列表、筛选、分页、刷新及消息提示入口；使用生成的 `ownWithdrawals`。相关 lint、格式、生产构建、model 模拟检查及隔离浏览器模拟响应验收通过，桌面/手机截图已查看；真实账号权限、日期边界及收款账户规则仍待联调，详见 `页面系分-结算与提现.md`。
账号中心尚未迁移的页面（2026-11-09 已实际打开代理端原型并核对导航，与 `public/config.js` 一致；具体页面和接口需分别分析）：

- [ ] 个人实名认证 — 原型 `#/agent/personal-certification`，接口及交互待核对。
- [ ] 企业认证 — 原型 `#/agent/company-certification`，接口及交互待核对。
- [ ] 合作协议 — 原型 `#/agent/contracts`，接口及交互待核对。
- [ ] 操作日志 — 原型 `#/agent/logs`，接口及交互待核对。
- [ ] 帮助中心 — 原型 `#/agent/help`，内容及交互待核对。

原 TODO 中“客户报告”并非代理端原型菜单，已移除；不能因接口存在而增加页面。原型源码明确限制代理端查看授权资料和查询报告。
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

## 2026-11-09 业务接口生成清理

- [x] 扫描全部页面请求，最后一个手写 `Recharges/service.ts` 已替换为生成的 `agents.agentRecharges`；分页、金额和数据范围按生成参数转换。
- [x] Orders、Settlements 继续直接消费生成接口；页面目录中不再有手写 service 或硬编码 HTTP 请求。旧中台 Mock service 未被当前页面引用，本轮不删除或编造真实协议替代。
- [x] 充值接口迁移相关 lint、格式、模拟检查和生产构建通过；完整类型检查仍被既有旧测试阻塞，真实账号与充值页面浏览器验收尚未执行。
