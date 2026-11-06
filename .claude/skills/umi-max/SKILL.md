---
name: umi-max
description: 本仓库的 Umi Max 4 开发规范、逐文件职责与内容/体量限制。处理 Umi/UMI/umi max、后台管理页面、配置式路由、菜单、权限、initialState、页面 model、组件数据逻辑、useModel、实例 Hook、request、ProTable、ProForm、Mock、Less、pnpm 安装、文件边界、拆分及项目结构问题时使用；新增页面、接口、组件、修复问题或解释文件职责前，按本 Skill 检查现有实现。
---

# Umi Max 项目开发规范

## 1. 适用范围与阅读方式

这是当前仓库的项目级 Skill，不是 uni-app 教程，也不是对所有 Umi 项目都适用的框架强制约定。面向 Umi Max 4、React、TypeScript、Ant Design 5、Pro Components 和 pnpm。

执行任务时：

1. 先读取当前 `package.json`、`.umirc.ts` 和本次要改动的文件，确认版本、插件和实现没有变化。
2. 查阅 [逐文件说明](references/project-files.md)，判断应该改哪里，以及哪些文件不能手动修改。
3. 查阅 [开发流程与示例](references/development-guide.md) 中与当前任务有关的章节。
4. 只完成当前需求；不因为此文档列出了推荐目录，就批量建立空目录或重构模板。
5. 描述项目现状时以当前文件为准并说明差异；新增或整理代码遵守本文规范，不把旧结构当成新建示例，也不覆盖用户的新改动。

解释项目结构时，先讲“配置 → 页面 → 组件 → service → 接口类型 → Mock → 状态/权限”的调用关系，再按用户关注的文件展开。

## 2. 当前项目基线

| 项目 | 当前实现 | 开发要求 |
| --- | --- | --- |
| 框架 | `@umijs/max`，声明范围 `^4.7.29` | 框架能力优先从 `@umijs/max` 导入 |
| UI | `antd` 5、`@ant-design/pro-components` 2、`@ant-design/icons` 5 | 优先复用现有组件，避免引入另一套 UI 体系 |
| React | 当前锁文件解析到 React 18；根清单暂未直接声明 `react`/`react-dom` | 不把自动安装 peer 依赖当成其他库也可随意间接引用的理由 |
| 语言 | TypeScript 5 | 业务类型明确，不新增 `any`、`@ts-ignore` 掩盖错误 |
| 包管理 | pnpm；`.umirc.ts` 中 `npmClient: 'pnpm'` | 不混用 npm/yarn 安装，不随意重建锁文件 |
| 路由 | `config/router.ts`，由 `.umirc.ts` 导入 | 新建页面文件后还要注册路由 |
| 已启用插件 | `antd`、`access`、`model`、`initialState`、`request`、`layout` | `{}` 表示启用该插件，不表示没有效果 |
| 打包配置 | `.umirc.ts` 中有 `utoopack: {}` | 保留当前构建器，不未经检查就套用 webpack 专属配置 |
| 样式 | Less、CSS Modules 导入方式 | 页面样式优先局部作用域，复用 Ant Design 主题能力 |
| 接口 | `config/service.ts` 配置多后端按需生成；保留 demo 和旧 backend | 请求放 service，不散落在 JSX 内；不手改生成目录 |
| 格式化 | Prettier 2，80 列、单引号、尾逗号 | 以 `.prettierrc` 为准，只格式化本次改动文件 |

以上版本和目录是编写时的基线，不代表已经固定 `engines` 或 `packageManager`；当前 `package.json` 尚未声明这两项。

## 3. 文件职责与修改边界

| 需求 | 首先检查/修改的位置 | 不应该做的事 |
| --- | --- | --- |
| 新页面、菜单、路由权限 | `config/router.ts`、`src/pages/<Page>/index.tsx`、`src/access.ts` | 只新建页面、不注册路由；直接改生成路由 |
| 启动时用户信息、运行时布局 | `src/app.ts` | 在编译期配置中发请求获取当前用户 |
| 全局共享的客户端状态 | `src/models/` | 所有表单输入和弹窗开关都塞进全局 model |
| 复杂页面的数据逻辑 | `src/pages/<Page>/model.ts` 或 `models/` | 把请求编排、关联状态与派生计算全部塞在页面；误认为页面目录的 model 自动具备路由作用域 |
| 复杂组件的实例私有逻辑 | 组件目录内未注册的 `model.ts`；页面私有组件用 `useXxxModel.ts` 避开扫描 | 用共享 useModel 导致多个组件实例串状态；误认为 src/components 下 model.ts 会自动注册 |
| API 请求与响应类型 | `config/service.ts`、`scripts/openapi*.ts`、`src/services/` | 页面中硬编码请求；擅改自动生成协议 |
| 页面专用组件 | `src/pages/<Page>/components/<Component>/index.tsx` | 将多个组件 TSX/Less 平铺在 components 下；只用一次就提到全局 components |
| 多页面共享组件 | `src/components/<Component>/index.tsx` | 平铺组件文件；组件内部绑定某个页面的路由和请求，使其无法复用 |
| 接口本地模拟 | `mock/` | 假设 Mock 会打进生产环境或代替真实后端 |
| 通用常量、纯函数 | `src/constants/`、`src/utils/` | 工具函数混入 UI 提示或隐式网络请求 |
| 编译、类型、插件异常 | `.umirc.ts`、`pnpm setup` 输出、依赖版本 | 直接修改 `src/.umi*`、`node_modules` 或 `dist` |
| 依赖脚本授权 | `pnpm-workspace.yaml` | 使用占位字符串；无差别放行所有依赖脚本 |

逐一文件说明、生成文件的用途和可选扩展目录见 [project-files.md](references/project-files.md)；该文档第 13 节逐文件规定“允许内容、禁止内容、体量与拆分时机”，改文件前必须核对对应条目。

## 4. 必须遵守的规范

### 4.1 配置与路由

- `.umirc.ts` 是当前项目的编译期配置入口；`src/app.ts` 是运行时配置入口，二者不能混用。
- 当前路由数组维护在 `config/router.ts`，由 `.umirc.ts` 的 `routes` 使用；不假设“放进 `pages` 就自动出现菜单”。
- 路由 `component: './Home'` 对应 `src/pages/Home`；目录大小写必须一致，避免只在 Windows 正常。
- `name` 是菜单/页面名称，`access` 对应 `src/access.ts` 返回的权限键，`redirect` 是路由重定向。
- 带参数路由必须和 service 的必需 ID 校验一致；不要让空值拼接出 `/undefined`。
- 内部跳转使用 Umi 导出的 `Link`、`history` 等路由能力；不要使用空 `href` 作为操作按钮。
- 不在已有 `.umirc.ts` 的同时无故新建 `config/config.ts`，形成两套难以辨认的配置来源。

### 4.2 页面、组件与 model 层

- 复杂页面优先将请求编排、关联状态、派生数据、DTO 映射和业务操作抽到就近的 `src/pages/<Page>/model.ts`，通过 `useModel` 消费；不以“跨页面共享”作为抽取 model 的前提，也不等到页面超行数才拆。
- 页面 `index.tsx` 主要负责渲染、组合组件、绑定事件和必要的视图引用；HTTP 协议仍留在 service，复杂表单/弹窗的 UI 拆进页面 `components`。
- 组件复杂逻辑也应抽离到组件目录内，默认使用 `model.ts`，但先明确状态所有权与注册方式：共享状态通过已注册 model 消费；`src/components` 下未注册的 `model.ts` 可作为本地 Hook 直接导入。页面私有组件需实例隔离时，使用同目录 `useXxxModel.ts`，避开自动扫描；简单展示和独立开关可留在组件内。
- 当前版本自动扫描 `src/models/**`、`src/pages/**/models/**` 和 `src/pages/**/model.ts` 等支持扩展名；`src/components/<Component>/model.ts` 默认不会自动注册，不能仅凭文件名承诺 `useModel` 可用。
- 默认命名空间来自路径：`src/models/global.ts` 对应 `global`，`src/pages/Table/model.ts` 对应 `Table.model`，`src/pages/Table/models/query.ts` 对应 `Table.query`；以实际生成的模型表/类型为准，不能用 Hook 函数名猜名称。
- 页面目录中的 model 只是按页面归属组织，仍由应用级 Provider 执行、共享；不自动随路由切换重置，也不保证进入该页面才运行其 effect，禁止在每个页面 model 中无条件挂载请求。
- 按实际路由进入/用户操作触发加载，明确缓存、reset、请求竞态与离页行为；同一 model 的多个消费者不各自重复加载或相互清空状态。
- 组件实例 Hook 用明确参数接收记录 ID 等输入；不要将自动注册的 model 默认 Hook 又直接调用一遍，造成共享实例与局部实例重复执行；页面私有实例 Hook 避免命名为会被扫描的 `model.ts`。
- 同一份列表数据及 loading 只确定一个所有者：简单列表可由 ProTable request 管理；复杂流程由 model 编排时不再复制一套互相同步的列表状态。
- 复用组件用明确 Props，异步提交写明返回类型；表格使用稳定业务主键，不以数组下标代替业务 ID。
- `@@initialState` 存放启动初始化信息，不再创建相互竞争的当前用户副本；model 不放 JSX、表格 render 列、Modal 确认框、页面跳转或重复错误提示，UI 行为由消费方处理。
- model/实例 Hook 的体量评估线为 200 行；按真实业务职责拆分，不为简单逻辑创建空 model，也不为压缩页面行数把整页机械搬进 Hook。
- model 决策表、命名空间、生命周期和示例见 [开发流程与示例](references/development-guide.md) 第 7 节。

### 4.2.1 组件目录与文件命名（新建组件必须遵守）

页面私有组件与全局共享组件都采用**一个组件一个 PascalCase 目录**：

```text
components/
└── ComponentName/
    ├── index.tsx       组件实现与默认导出
    ├── index.less      组件局部样式（需要时创建）
    └── model.ts        组件数据逻辑（需要时创建，先检查注册与状态归属）
```

- 禁止把 `Welcome.tsx`、`Welcome.less`、`Tasks.tsx`、`Tasks.less` 等多个组件直接平铺在 `components/` 下；应分别放入 `Welcome/index.tsx`、`Welcome/index.less` 与 `Tasks/index.tsx`、`Tasks/index.less`。
- `index.tsx` 直接实现组件，不默认采用 `ComponentName.tsx` 加 `index.ts` 转导出的双入口；调用方按目录导入，如 `import Welcome from './components/Welcome'`，样式从 `./index.less` 导入。
- `types.ts`、纯工具、实例 Hook、测试和资源按需放进所属组件目录；独立子组件继续按 `components/<Child>/index.tsx` 组织，不将私有实现散放到父级 components 中。
- `model.ts` 命名不是共享或隔离的保证：`pages/**/model.ts` 会自动注册为共享模型；实例隔离例外使用同目录 `useXxxModel.ts`，不得为凑目录结构注册一份无人使用的 model。
- 不创建空 Less、空 model 或仅占位的文件。旧代码在本次涉及组件整理时一并迁移导入、样式路径和测试；未涉及的旧模板不批量重构，也不作为新组件的结构范例。
- 目录示例与文件职责见 [开发流程与示例](references/development-guide.md) 第 3.1 节和 [逐文件说明](references/project-files.md) 第 13.8 节。

### 4.3 请求、表格与表单

- 后台业务列表默认使用 `ProTable`；先参考同类页面（例如企业客户管理）的列定义、搜索、筛选、分页、工具栏和刷新，不因 Mock 数据或列表简单而改用普通 `Table`。仅在用户明确指定或有经核实且需说明的组件能力限制时例外。
- 列表有导出需求时先检查同类页面和现有导出工具；默认与企业客户管理保持一致，复用 `src/utils/exportExcel.ts` 导出 `.xlsx`，使用当前已提交的筛选条件导出全部匹配记录而非仅当前页，并处理导出中、防重复及失败反馈。用户或协议明确指定其他格式时遵循其要求，不自行改成 CSV。
- 状态等固定业务取值先依据现有协议或原型定义具名枚举，集中放所属模块的 `constants.ts`；筛选项从枚举派生，不在多处重复散写字符串。正式后端协议尚未确定时明确这是本地约定，接入时核对并映射，不能把原型枚举当成正式协议。
- service 使用 `request`，GET 查询放 `params`，JSON 请求体放 `data`；以接口协议为准。
- 区分 HTTP/网络失败与业务失败。HTTP 200 不代表业务成功；若响应使用 `success`，必须按真实协议判断。
- 不同时在全局拦截器、service、页面三层重复弹出同一错误提示。
- ProTable 的服务端分页需要返回 `{ data, success, total }`；`total` 是后端总数，不是当前页数组长度。
- 将排序、筛选明确映射成后端接受的参数；禁止照搬模板中的 `@ts-ignore`。
- 新建、编辑成功后才关闭表单并刷新表格；失败时保留用户输入。
- 编辑必须保留目标记录 ID；不要假设未渲染为表单项的 ID 会自动包含在提交值中。
- 删除要确认；批量删除必须实际处理全部选中 ID，不能只删除第一条却提示批量成功。
- “新增失败”等用户文案与真实动作一致；取消操作不应触发请求。

### 4.4 权限与安全

- 权限集中在 `src/access.ts`，页面用 `useAccess` / `Access`，路由用 `access` 配置。
- 当前模板通过 `name !== 'dontHaveAccess'` 演示权限，不是生产级管理员判断；不把它复制成正式权限方案。
- 前端权限仅控制页面体验，后端仍必须校验身份、角色/权限及数据范围。
- 不把管理员密钥、数据库口令、服务端 API secret 放进源码、前端环境变量或 `.mcp.json` 的可提交明文中。
- 前端构建变量会进入浏览器包；开发代理配置不会自动变成生产代理。
- 未经明确需求不改变现有登录态存储方式；不把敏感 token 写入日志或 Mock 数据。

### 4.5 类型、样式与工具链

- 业务文件默认不新增 `eslint-disable`、`@ts-ignore`、宽泛 `Record<string, any>`。
- 自动生成类型中的宽泛定义是现状，不是新手写业务代码的模板。
- `typings.d.ts` 是声明文件，不含可执行逻辑；局部业务类型不要无理由提升为全局命名空间。
- Less 使用 `import styles from './index.less'`；尽量避免覆盖整个站点的 `.ant-*` 样式。
- 日期、金额、枚举、空值展示使用明确的业务格式；不要用 `value || '-'` 把合法的 `0` 误当空值。
- 优先采用当前版本支持的 Ant Design/Pro Components API；模板旧用法不等于推荐用法。
- 只在非显而易见的约束处补一句原因注释，不新增解释每行代码的大段注释。

### 4.6 单文件内容与体量限制

- 修改前按 [逐文件说明](references/project-files.md) 第 13 节检查该文件允许/禁止的内容，不仅检查它的目录位置。
- 页面主要做渲染与事件绑定，组件承担明确展示/交互职责，service 描述接口协议，model 管理业务状态与复杂数据流程，实例私有逻辑抽本地 Hook，utils 保持纯函数，导出入口不隐藏业务副作用。
- 禁止反向依赖：service 不导入页面/UI，utils 和 constants 不导入页面/model；生成文件不承载手写适配或页面逻辑。
- 本项目采用体量评估线：页面/运行时配置 300 行、业务组件/model/手写 service/样式 200 行、纯工具/常量/手写类型 150 行、纯导出入口 30 行；超过时评估真实职责是否应拆分，而不是机械按行切文件。
- 行数按格式化后的物理行计算，含空行和注释；这些是项目维护建议，不是 Umi 限制，也没有自动接入 lint/CI；锁文件、生成协议/框架代码、依赖、构建产物与纯数据清单不套用代码体量线。
- 已有文件超过评估线不等于本次必须重构；仅在本次触及相关复杂度时，按真实职责就近拆分，不建立空壳文件或为凑行数压缩代码。
- 新增文件必须能说明归属职责、允许依赖、禁止依赖和验证方式；不要靠文件名 `index.ts` 把请求、状态和渲染全部混在一起。

## 5. 安装与脚本授权

当前已确认的项目策略：

```yaml
allowBuilds:
  core-js: false
  core-js-pure: false
  es5-ext: false
  esbuild: true
```

- `false` 只禁止该依赖的安装脚本，不会删除该依赖，也不会阻止业务代码导入它。
- `esbuild` 的脚本准备、校验本机可执行程序；其他三项在当前已检查版本中只是输出提示信息。
- 这是针对当前版本的判断，升级后应重新检查脚本，不能保证任意未来版本完全相同。
- `ERR_PNPM_IGNORED_BUILDS` 表示依赖脚本没有明确获批，不是 npm 账号授权或内网访问错误。
- 新增未知安装脚本时先检查用途、版本和源码，再决定是否批准；不要用全局放行或永久 `ignore-scripts` 掩盖问题。
- 不为了处理脚本授权删除锁文件、升级框架或切换镜像源。

## 6. 按任务执行

### 新增或修改页面

1. 阅读现有同类页面、路由和 service，确认需求涉及的菜单、权限、接口。
2. 先确定数据逻辑和状态的所有者：复杂页面优先页面 model，需实例隔离的复杂组件使用本地 Hook，简单状态可内置；按需增加页面、组件、service 和类型，不创建空文件。
3. 配置路由；若受限，连同权限键和无权限行为一起完成。
4. 覆盖加载、空数据、接口失败、提交中、成功刷新和取消操作，以及多实例隔离、重进页面 reset/缓存和请求竞态。
5. 按第 7 节检查，UI 改动必须实际打开页面验证。

### 新增或修改组件

1. 先确定是页面私有还是跨页复用；分别放入 `src/pages/<Page>/components/<Component>/` 或 `src/components/<Component>/`。
2. 按第 4.2.1 节创建 `index.tsx`、按需 `index.less` 和 `model.ts`，不平铺组件，也不创建空文件；实例隔离按扫描规则使用同目录本地 Hook。
3. 入口负责 UI，数据逻辑归 model/实例 Hook，HTTP 协议归 service；调用方按目录导入，不依赖组件私有文件。
4. 移动已有组件时同步导入、Less、资源路径、测试与 model 命名空间；验证多实例隔离及原有交互。

### 新增或修改接口

1. 先确认真实协议：路径、方法、参数、响应、分页、错误码和身份凭证。
2. 检查目标文件是否带自动生成标记；`pnpm openapi:service`（别名 `pnpm openapi`）通过 `scripts/openapi.ts` 读取 `config/service.ts` 的多后端数组，按路径白名单生成 `src/services/<name>/`，各服务使用独立 namespace 和默认请求 baseURL。demo 与旧 backend 的生成来源不要与当前流程混为一谈。
3. 区分 `serverPath`（请求地址）、`schemaPath`（协议来源）、`pathPrefix`（筛选路径前缀及文件分组起点）；生成文件名取此前缀后的第一级路径，如 `auth/login`、`auth/logout` 同在 `auth.ts`，与 Swagger tags 无关。空 `apis` 跳过该服务，成功生成会替换该服务目录；具体配置和失败保护见 README。
4. 不编造生成命令，不直接覆写标记为自动生成的协议；需要时使用独立手写 service 或在其外适配。
5. 更新类型、调用方和对应 Mock，避免实现与模拟接口不一致。
6. 对必需 ID、分页映射、业务失败和取消操作进行验证。

### 排查问题

1. 先拿到命令、工作目录、版本和完整错误，复现最小场景。
2. 区分安装、代码生成、类型、构建、浏览器运行和 API 失败，不跨层盲改。
3. 优先改源码与配置，生成内容通过 `pnpm setup` 或构建重新产生。
4. 不覆盖用户未提交修改；不通过禁用 lint、跳过 hooks 或清空依赖作为默认解决方式。

详细流程、示例和排查表见 [development-guide.md](references/development-guide.md)。

## 7. 验证与交付

按改动范围选择必要检查；没有运行的检查不能宣称通过：

```bash
pnpm install --frozen-lockfile
pnpm setup
pnpm exec tsc --noEmit
pnpm exec max lint
pnpm build
pnpm dev
```

- 仅改文档/Skill：检查 Markdown、内部链接、文件清单和命令准确性，不为此无故运行全站构建或修改业务代码。
- 缺少 `src/.umi/tsconfig.json` 时先执行 `pnpm setup`，再进行类型检查。
- 可以对指定文件执行 lint；当前支持 `pnpm exec max lint "src/pages/Home/**/*.{ts,tsx,less}"`。
- `pnpm format` 会格式化整个仓库，不默认运行；使用 `pnpm exec prettier --check <本次文件>` 检查更合适。
- 当前没有配置 `test`、`lint`、`typecheck` npm scripts，不编造 `pnpm test`、`pnpm lint` 或 `pnpm typecheck` 已可用。
- UI 改动需启动开发服务并在浏览器验证正常流程、错误/空状态、权限、表单校验和刷新回显；仅类型检查或构建通过不算 UI 验证完成。
- 仓库现有问题与本次引入的问题分开说明；不能为了让检查变绿顺手大改无关模板。
- 收尾说明改了哪些文件、运行了什么检查、哪些验证尚未完成；不自动提交或推送。
