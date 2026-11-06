# 项目逐文件说明

## 1. 阅读范围

本文按当前仓库的实际文件解释“做什么、谁使用、什么时候改、注意什么”。业务源码、根配置、Mock 和自定义 Git hooks 逐项说明；依赖、构建产物和框架临时文件单独解释，不把 `node_modules` 中数万份第三方文件当成需要维护的项目源码。

文件会随着 Umi 插件、开发/生产模式和版本变化而增减。自动生成文件清单是定位用途的参考，不是要求每次生成结果完全一致。

标记约定：

- **手写**：项目维护的源码或配置，可以按需求修改。
- **协议生成**：文件有自动生成标记，应先确认生成来源，不能当普通业务文件直接覆写。
- **临时生成**：工具每次运行可能重建，不手动修改、不作为业务源码提交。
- **可选**：当前没有，只有需求明确时才考虑增加。

## 2. 总体目录与运行关系

```text
项目根目录/
├── .claude/                 项目级开发助手 Skill 与本机配置
├── .husky/                  Git 提交前、提交信息检查
├── .umirc.ts                Umi 编译期配置、路由引用、插件
├── config/
│   ├── router.ts            手写路由数组，由 .umirc.ts 导入
│   └── service.ts           多后端接口生成配置与路径白名单
├── scripts/                OpenAPI 校验、筛选、生成入口及测试
├── mock/                    开发环境接口模拟
├── src/
│   ├── access.ts            权限计算
│   ├── app.ts               启动初始化和运行时布局
│   ├── assets/              通过 import 使用的静态资源
│   ├── components/          跨页面复用组件
│   ├── constants/           共享常量
│   ├── models/              useModel 共享状态
│   ├── pages/               路由页面与页面私有组件
│   ├── services/            API 请求与响应类型
│   ├── utils/               通用纯工具函数
│   └── .umi/                Umi 自动生成的临时入口、类型、插件连接代码
├── package.json             依赖清单与项目命令
├── pnpm-lock.yaml           确切依赖解析结果
├── pnpm-workspace.yaml      当前主要配置依赖安装脚本授权
├── tsconfig.json            扩展 Umi 生成的 TypeScript 配置
├── typings.d.ts             引入框架全局类型
├── node_modules/            安装出的依赖，不手动维护
└── dist/                    生产构建产物，不手动维护
```

开发运行过程：

```text
pnpm install
  ├─ 解析 package.json + pnpm-lock.yaml
  ├─ 根据 pnpm-workspace.yaml 决定依赖脚本是否可以执行
  ├─ postinstall: max setup → 生成 Umi 临时文件
  └─ prepare: husky → 配置 Git hooks

pnpm dev
  ├─ 读取 .umirc.ts，连接插件、路由与开发 Mock
  ├─ 生成 src/.umi 内部入口
  ├─ 执行 src/app.ts 的初始化与运行时配置
  └─ 渲染 pages → components；页面通过 services 访问接口
```

`getInitialState` 为权限和运行时消费提供初始化结果；`src/models/global.ts` 是另一套按需共享的客户端状态，不应与初始化数据混为一谈。

## 3. 根目录文件

### `package.json` — 手写，项目清单

- 声明运行依赖、开发依赖和脚本；安装工具以它配合锁文件决定安装什么。
- 当前运行依赖是图标库、Pro Components、Umi Max、Ant Design；开发依赖包括 TypeScript、Husky、lint-staged、Prettier、格式化插件、`@umijs/openapi` 和 `tsx`。
- 新增直接使用的库时在对应依赖区声明，不假设其他包间接带来的依赖始终可用。
- `private: true` 防止误将项目发布到 npm；当前没有应用包名、`engines`、`packageManager` 声明。

当前脚本逐项说明：

| 脚本 | 实际命令 | 用途与注意点 |
| --- | --- | --- |
| `dev` | `max dev` | 启动开发服务，启用热更新、开发 Mock；以终端实际地址为准 |
| `start` | `npm run dev` | 当前只是转调 `dev`；可用 `pnpm start`，日常直接 `pnpm dev` 更清晰 |
| `build` | `max build` | 生成生产包到 `dist`；不是启动后端，也不等于完成浏览器验证 |
| `format` | `prettier --cache --write .` | 格式化整个项目，可能修改无关文件，慎用 |
| `setup` | `max setup` | 生成 Umi 临时文件和类型，适合首次安装后或缺少生成类型时运行 |
| `openapi` | `pnpm run openapi:service` | 按需接口生成命令的别名，不绕过白名单 |
| `openapi:service` | `tsx scripts/openapi.ts` | 读取 `config/service.ts` 的多后端配置，按路径生成各服务接口；会替换对应目录，先核对来源和现有改动 |
| `postinstall` | `max setup` | 安装完成后自动执行 Umi 代码生成 |
| `prepare` | `husky` | 安装/配置 Git hooks 的生命周期脚本 |

### `pnpm-lock.yaml` — 包管理器维护，依赖锁文件

- 记录依赖的精确版本、完整性校验和、peer 依赖组合、子依赖关系。
- 当前锁文件格式为 `9.0`；不要根据该格式数字推断正在运行的 pnpm 主版本。
- `package.json` 中的 `^` 允许一定范围的版本，锁文件则让同一仓库的安装结果可复现。
- 升级、增加或删除依赖时由 pnpm 更新；业务功能改动不应无故改动它。
- 不手改依赖哈希，不用删除锁文件作为安装报错的第一处理方式。

### `pnpm-workspace.yaml` — 手写，pnpm 项目设置

- 当前只有 `allowBuilds`，没有配置 `packages` 多包目录；文件名包含 workspace 不代表本项目已经是 monorepo。
- `esbuild: true` 允许 esbuild 安装脚本；`core-js`、`core-js-pure`、`es5-ext` 设为 `false`，明确拒绝其非必要脚本。
- `false` 不会卸载依赖；这里控制的是安装时脚本执行，不是运行时模块可用性。
- `set this to true or false` 是待选择占位文字，不能保留作最终值。
- 新依赖要执行脚本时重新审查，不能一律设为 `true`。

### `.npmrc` — 手写，包管理器配置

- 当前指定下载源为 `https://registry.npmmirror.com/`。
- 只影响包管理器请求，不是业务 API 地址，也不控制前端代理。
- 排查网络、证书、认证错误时读取；本次 `ERR_PNPM_IGNORED_BUILDS` 不是这个下载源导致的。
- 不提交认证 token；企业私有源认证应使用合适的本地/CI 凭证管理。

### `.umirc.ts` — 手写，Umi 编译期配置入口

| 当前字段 | 用途 | 修改时注意 |
| --- | --- | --- |
| `defineConfig` | 从 `@umijs/max` 获得配置类型提示 | 不是运行时 React 组件 |
| `antd: {}` | 启用 Ant Design 集成 | 主题等配置以当前插件支持项为准 |
| `access: {}` | 启用权限能力 | 与 `src/access.ts` 配套 |
| `model: {}` | 启用 `useModel` | 与 `src/models/` 配套 |
| `initialState: {}` | 启用启动初始化状态 | 与 `src/app.ts` 的 `getInitialState` 配套 |
| `request: {}` | 启用 Umi 请求能力 | 运行时拦截等在 `src/app.ts` 配置 |
| `layout.title` | 设置后台布局标题 | 当前为模板标题 `@umijs/max` |
| `routes` | 从 `config/router.ts` 导入显式路由表，可生成菜单 | 新页面在 `config/router.ts` 注册 |
| `npmClient` | 告诉 Umi 使用 pnpm | 不等于锁定 pnpm 精确版本 |
| `utoopack: {}` | 启用当前 Utoopack 构建配置 | 不未经验证改成另一套构建器 |

当前路由：`/` 重定向 `/home`；`/home` 对应 Home；`/access` 对应 Access；`/table` 对应 Table。`/access` 目前只演示按钮权限，没有配置整个页面的路由权限。

### `config/router.ts` — 手写，路由数组

- 由 `.umirc.ts` 导入；路由类型来自当前 `defineConfig` 的 `routes`，不建立第二个 Umi 配置入口。
- 维护页面路径、component、菜单名称、重定向及路由权限键，不放运行时请求或页面状态。

### `config/service.ts` — 手写，多后端接口生成配置

- 导出 `HttpMethod`、`ApiSelection`、`ServiceConfig` 类型及服务数组；每项包含 `name`、`serverPath`、`schemaPath`、`pathPrefix`、`namespace`、`apis`。
- `serverPath` 是默认请求 baseURL，`schemaPath` 是文档来源，`pathPrefix` 补全选择路径并决定文件分组起点；`apis` 按 `auth/logout` 这样的路径配置，多方法路径用对象指定 method。
- 服务目录名和命名空间必须独立；当前 yiyancha 选择 login、logout，输出到 `src/services/yiyancha/`，使用 `YiyanchaAPI`。空数组跳过，移除配置不会删除旧目录。
- 这里只放非秘密配置和类型，不保存 token、调用业务接口或增加 Umi 插件配置；详细用法见 README。

### `tsconfig.json` — 手写，TypeScript 配置入口

- 当前仅扩展 `./src/.umi/tsconfig.json`，使用 Umi 生成的路径别名和编译设置。
- 如果找不到被扩展文件，先 `pnpm setup`，不是直接新建一个空 `.umi/tsconfig.json`。
- 按需求增加编译选项时修改根配置，不改生成文件；不要关闭检查来掩盖业务类型问题。

### `typings.d.ts` — 手写，项目级框架类型入口

- 当前 `import '@umijs/max/typings'`，引入 Umi 的全局类型声明。
- `.d.ts` 不输出 JavaScript，不放请求、函数实现或运行时配置。
- 与 `src/services/demo/typings.d.ts` 不同：根文件负责框架环境，service 文件负责接口协议。

### `.eslintrc.js` — 手写，代码检查配置

- 继承 `@umijs/max/eslint`，检查 JS/TS/React 代码规范。
- 真有项目级规则差异才覆盖；不要全局关掉规则以容纳单处问题。
- 当前使用 ESLint 传统配置，不擅自迁移成另一套配置体系。

### `.stylelintrc.js` — 手写，样式检查配置

- 继承 `@umijs/max/stylelint`，检查 CSS/Less。
- 修改局部样式后可执行 `pnpm exec max lint --stylelint-only`；不假设 TypeScript 检查会发现样式问题。

### `.prettierrc` — 手写，格式化规则

- 当前规则：80 列、单引号、允许位置尾逗号、Markdown 不强制重排段落。
- `prettier-plugin-organize-imports` 可能整理/删除导入，`prettier-plugin-packagejson` 整理清单字段。
- 对 `.prettierrc` 本身明确使用 JSON 解析器。
- 格式化行为以这个文件为准，不在业务文件里局部另定风格。

### `.prettierignore` — 手写，格式化排除项

- 当前排除 `node_modules`、`.umi`、`.umi-production`。
- 与 `.gitignore` 用途不同：前者决定格式化范围，后者决定 Git 默认忽略范围。
- 不因此假设全量格式化绝不会碰 `dist` 或其他生成内容；优先只格式化明确的目标文件。

### `.lintstagedrc` — 手写，暂存区文件检查

| 文件范围       | 执行内容                                             |
| -------------- | ---------------------------------------------------- |
| Markdown、JSON | Prettier                                             |
| JS、JSX        | Umi ESLint 自动修复 + Prettier                       |
| CSS、Less      | Umi Stylelint 自动修复 + Prettier                    |
| TS、TSX        | Umi ESLint 自动修复 + TypeScript 解析模式的 Prettier |

- 由 `.husky/pre-commit` 调用，仅处理已暂存的匹配文件。
- 自动修复可能改变待提交内容，提交前要复查；不默认使用跳过 hooks 的参数。
- 这不是完整的类型检查或测试套件。

### `.gitignore` — 手写，Git 忽略规则

- 当前排除依赖、Umi 临时目录、`dist`、部分本地配置与构建缓存。
- 已排除 `.env.local`、`.umirc.local.ts`、`config/config.local.ts`，但不等于任意 `.env.*` 都被忽略。
- 新增包含凭证的本地文件前先核对忽略规则，不只看文件名猜测安全性。
- 对已被跟踪的文件，新增忽略规则不会自动取消跟踪。

### `README.md` — 手写，面向开发者的项目入口

- 当前包含模板介绍、多后端接口生成配置、路径选择规则、调用方式、失败保护、环境变量与测试命令，以及路由配置入口。
- 适合承载启动说明、业务概况与可验证的使用说明，不复制整份 Skill 或记录临时调查日志。

### `.mcp.json` — 开发工具配置，不属于 Umi 业务配置

- 用于开发助手连接 MCP 服务；不参与 Umi 路由、接口调用或前端构建配置。
- 修改它可能改变本机或团队的工具连接，需要独立明确需求。
- 不在项目规范中复制其中的认证值，不假设配置可以无条件对外公开。

## 4. Git hooks

### `.husky/pre-commit` — 手写

- 当前执行 `npx --no-install lint-staged --quiet`。
- Git commit 前运行暂存文件检查；`--no-install` 避免命令临时从网络下载工具。
- 修改检查范围优先编辑 `.lintstagedrc`，不要在 hook 中堆放业务逻辑。

### `.husky/commit-msg` — 手写

- 当前执行 `npx --no-install max verify-commit $1`，验证提交信息。
- 提交信息校验失败时按具体提示修改；不要默认跳过 hook。

### `.husky/_/` — Husky 临时生成

- `h` 是通用 hook 调度脚本，`husky.sh` 是生成的兼容入口，`.gitignore` 排除生成内容。
- 同名 `pre-commit`、`commit-msg` 以及 `pre-push`、`post-checkout`、`post-merge`、`pre-rebase` 等是 Git hook 转发入口。
- 它们负责调用项目自定义 hook，不代表每个转发入口都有项目业务检查。
- 不编辑这里来加规则；应编辑 `.husky/` 下对应的项目自定义文件。

## 5. 应用启动、权限与状态

### `src/app.ts` — 手写，运行时配置

- `getInitialState()` 当前异步返回 `{ name: '@umijs/max' }`，供初始化状态和权限等能力消费。
- `layout()` 返回运行时布局配置：当前设置远程 logo，以及 `menu.locale: false`，关闭菜单国际化名称解析。
- 未来接入当前用户、运行时请求配置时优先检查这里，不把浏览器用户状态写进 `.umirc.ts`。
- 当前 app 尚未接入真实登录流程、token 管理或全局请求错误策略；即使 backend service 已生成认证方法，也不能描述成“应用已实现登录”。

### `src/access.ts` — 手写，权限函数

- 接收初始化状态，返回可供 `useAccess()` / `<Access>` 和路由使用的权限键。
- 当前只有 `canSeeAdmin`，条件是存在初始化对象且 `name !== 'dontHaveAccess'`。
- 这是演示逻辑，不是在校验真实管理员角色；当前参数类型来自 `API.UserInfo`，后续应与真实初始化状态统一。
- 新权限在这里集中定义；后端仍需独立鉴权。

### `src/models/global.ts` — 手写，共享状态 Hook

- 从常量取得默认名称，通过 React `useState` 保存 `name`，返回 `{ name, setName }`。
- 默认导出的函数虽然名为 `useUser`，但模型识别名是文件名 `global`。
- 首页通过 `useModel('global')` 读取它；不是 Redux reducer，也不是自动持久化存储。
- 页面私有输入不放到这里；刷新浏览器后状态是否保留需要额外明确实现。

### `src/constants/index.ts` — 手写，共享常量

- 当前只导出 `DEFAULT_NAME = 'Umi Max'`，由 global model 使用。
- 适合稳定业务枚举、静态配置，不适合会随请求变化的数据或秘密凭证。

### `src/utils/format.ts` — 手写，纯工具函数

- 当前导出 `trim(str: string)`，去掉字符串首尾空白；首页使用。
- 保持输入输出明确，不在格式化函数里发请求、读全局状态或弹通知。
- 不因为文件叫 format 就把所有无关帮助函数都堆进来。

### `src/assets/.gitkeep` — 手工占位文件

- Git 不跟踪空目录，此文件用于保留尚未放资源的 `assets` 目录。
- 它没有框架运行行为，也不是图片或资源清单。
- 后续资源可通过 `@/assets/...` 导入；不要把运行时上传的文件放进源码目录。

## 6. 页面文件

### `src/pages/Home/index.tsx` — 手写，首页

- `config/router.ts` 的 `/home` 指向这里，由 `.umirc.ts` 导入。
- 使用 `PageContainer` 作为页面容器，从 `global` model 读取 `name`，经 `trim()` 处理后传给 `Guide`。
- 用于演示“共享状态 → 工具函数 → 复用组件”的数据流，不负责接口请求或登录。

### `src/pages/Home/index.less` — 手写，首页局部样式

- 当前 `.container` 设置顶部 80px 内边距。
- 通过 `styles.container` 使用，不应顺手写成影响全站的通用 `.container` 覆盖。

### `src/pages/Access/index.tsx` — 手写，权限演示页

- `/access` 指向这里。
- 用 `useAccess()` 取得权限，再通过 `<Access accessible={access.canSeeAdmin}>` 控制按钮是否显示。
- 当前仅控制按钮，不表示整个路由已经受到限制；也不代表请求经过了后端鉴权。

### `src/pages/Table/index.tsx` — 手写，CRUD 模板演示页

- `/table` 指向这里，是列表、搜索、新增、编辑、选择行和详情展示的编排入口。
- 从 `services.UserController` 解构增删改查方法；使用 ProTable、FooterToolbar、ProDescriptions、Drawer。
- `actionRef` 用于刷新表格；局部状态控制新增/编辑弹窗、表单记录、选中行和详情行。
- 页面通过 `CreateForm` / `UpdateForm` 组合页面私有表单，不是通用 CRUD 组件库。

不能原样复制为生产实现的现状：

1. ProTable 请求结果只返回 `data`、`success`，未把后端 `total` 映射出来。
2. 排序/筛选参数使用 `@ts-ignore`，没有明确匹配 API 参数类型。
3. 标为“批量删除”的实现实际只取第一条有 ID 的记录，并在调用后无条件清空选择。
4. `gender` 列枚举键使用 `0/1`，接口类型和 Mock 使用 `MALE/FEMALE`，不一致。
5. 编辑提交从表单值读 `id`，但当前步骤表单没有明确保证 ID 随提交返回。
6. `row` 初始化和关闭都设为空，没有看到正常点击入口调用 `setRow(record)`，因此详情抽屉入口未完成。
7. “订阅警报”使用空链接，“批量审批”没有业务处理；都只是占位。
8. 请求完成后直接提示成功，尚未完整判断响应中的业务失败。

这些是阅读和后续开发时的提醒，不要求在与此页面无关的任务中顺手全部修复。

### `src/pages/Table/components/CreateForm.tsx` — 手写，新增弹窗容器

- 接收 `modalVisible`、`onCancel` 和 `children`，只负责 Modal 外壳。
- 表单字段和提交逻辑由父页面以 children 提供，当前放的是 `type="form"` 的 ProTable。
- `footer={null}` 让子表单负责提交区；取消由父页面关闭状态。
- 模板使用 `destroyOnClose`，新增实现应先核对当前 Ant Design 版本推荐 API，避免扩散弃用写法。

### `src/pages/Table/components/UpdateForm.tsx` — 手写，分步编辑表单

- 用 `StepsForm` 组织基本信息、规则属性、调度周期三步，通过 Modal 展示。
- 导出 `FormValueType` 和 `UpdateFormProps`，供父页面约定值与回调。
- `initialValues` 用于表单初始化，不保证切换记录后自动同步；重开、切换记录时要验证回填。
- 当前规则描述、目标、模板、周期等字段并非完整的用户 API 字段；模板 UI 与用户 service 不是完整业务闭环。
- 新增真正的编辑流程时要明确 ID 来源、字段映射、表单重置和成功/失败返回语义。

## 7. 复用组件

公共组件以 `src/components/` 当前实现和实际引用为准；新增组件按各自职责组织，避免把业务请求绑定到展示组件。

## 8. API service 与协议类型

这三个 demo 文件均带“由 OneAPI 自动生成，请勿手动修改”标记。当前多后端流程通过 `pnpm openapi:service`（别名 `pnpm openapi`）运行 `scripts/openapi.ts`，按 `config/service.ts` 中的路径白名单生成各服务目录；不要将 demo 和旧 backend 的历史生成来源与当前配置混为一谈，也不能仅凭脚本存在就声称本次已验证内网访问或生成成功。

### `scripts/openapi*.ts` — 手写，生成工具与测试

| 文件 | 职责 |
| --- | --- |
| `scripts/openapi.ts` | 加载服务配置、确定输出根目录、转交生成流程、报告错误并设置失败退出码 |
| `scripts/openapi-config.ts` | 校验服务名、命名空间、文档来源及请求地址等配置，防止目录越界、重复名称和覆盖 demo |
| `scripts/openapi-select.ts` | 精确匹配路径与方法白名单，按 `pathPrefix` 后的第一级路径确定文件分组，检查歧义、重名及重复 operationId，保留共享协议类型和路径级信息 |
| `scripts/openapi-generate.ts` | 读取文档、先筛选所有启用服务、按路径分组生成文件、隔离暂存、注入默认 baseURL、逐个替换目录与单目录失败恢复、清理临时文件 |
| `scripts/openapi-select.test.ts` | 路径筛选、分组文件名、方法选择、文档与服务配置校验测试 |
| `scripts/openapi-generate.test.ts` | 临时目录内验证按路径分组、多后端隔离、生成请求的 baseURL、重新生成与失败保护，不调用真实业务接口 |

- 支持 HTTP(S) 文档和本地 JSON；`OPENAPI_SCHEMA_PATH` 只能在恰好一个服务启用时覆盖来源。空服务列表或空 `apis` 不读取文档、不改旧输出。
- 下载/筛选失败不更新任何服务；所有服务生成结果就绪后逐个替换目录，单目录失败尝试恢复，不承诺跨服务事务。成功生成会移除该目录中上次未再选择的函数，不自动合并手写文件。
- 文件分组不再使用文档的中文 tags；`/api/v1/auth/login` 与 `/api/v1/auth/logout`（`pathPrefix: '/api/v1'`）都进入 `auth.ts`，请求函数名仍取 `operationId`。
- `serverPath` 注入生成请求包装的默认 baseURL；调用方传 headers 等选项时保留默认地址，显式 baseURL 可以覆盖。生成器不会配置代理、CORS、token 或页面登录流程。
- 不在生成输出中手写页面 model、业务适配或 UI 逻辑；这是开发工具链，不由页面运行时调用，也不因文档维护任务擅自触发。

### `src/services/demo/UserController.ts` — 协议生成，用户 API

- 从 `@umijs/max` 导入 `request`，包装具体 HTTP 接口；页面不需要重复拼 URL 和请求体。
- `options` 是请求选项扩展，不能把它当作任意用户输入透传。

| 函数 | HTTP 方法与路径 | 参数位置 | 用途 |
| --- | --- | --- | --- |
| `queryUserList` | `GET /api/v1/queryUserList` | `params`：keyword/current/pageSize | 查询用户列表 |
| `addUser` | `POST /api/v1/user` | `data`：UserInfoVO | 新增用户 |
| `getUserDetail` | `GET /api/v1/user/:userId` | 路径 userId；当前也透传 params | 获取用户详情 |
| `modifyUser` | `PUT /api/v1/user/:userId` | 路径 userId + `data` | 修改用户 |
| `deleteUser` | `DELETE /api/v1/user/:userId` | 路径 userId | 删除用户 |

- 多个 `userId` 在当前生成类型里是可选值，不意味着真实后端允许缺 ID；调用前应保证有效。
- 业务适配可放在生成文件外；协议变更优先更新生成源，而不是手改后等待下次被覆盖。

### `src/services/demo/index.ts` — 协议生成，service 聚合入口

- 导入 `UserController` 命名空间并导出 `{ UserController }`。
- Table 页面使用 `import services from '@/services/demo'` 后访问其方法。
- 不把页面状态、弹窗或 UI 提示加进这个聚合文件。

### `src/services/demo/typings.d.ts` — 协议生成，全局 API 类型

| 类型 | 用途 |
| --- | --- |
| `PageInfo` | 通用分页字段，含 current/pageSize/total/list |
| `PageInfo_UserInfo_` | 用户列表分页结构，list 为 UserInfo 数组 |
| `Result` | 通用业务响应包装 |
| `Result_PageInfo_UserInfo__` | 用户分页列表响应包装 |
| `Result_UserInfo_` | 单用户响应包装 |
| `Result_string_` | 字符串数据响应包装 |
| `UserGenderEnum` | `'MALE' \| 'FEMALE'` 性别枚举 |
| `UserInfo` | 用户展示字段：id、name、nickName、email、gender |
| `UserInfoVO` | 新增/编辑请求字段：name、nickName、email |
| `definitions_0` | 当前生成器产出的 `null` 类型占位，不是业务模型 |

- 使用 `declare namespace API` 提供全局类型，不需要把它当运行时对象 import。
- `UserInfo.id` 当前是可选字符串，而 Mock 使用数字，后续对接应统一。
- 这些类型说明编译期结构，不会在运行时自动校验接口 JSON，也不会自动把数字 ID 转成字符串。

### 当前 yiyancha 生成接口文件

| 文件 | 当前用途 | 内容限制 |
| --- | --- | --- |
| `src/services/yiyancha/index.ts` | 聚合当前生成的 `auth` 路径分组 | 只保留生成导出，不加状态、UI 或业务编排 |
| `src/services/yiyancha/auth.ts` | 当前白名单的 login、logout 请求及默认 baseURL 包装 | 生成器维护，不手写登录态、token、跳转或错误提示 |
| `src/services/yiyancha/typings.d.ts` | `YiyanchaAPI` 全局协议类型，保留完整共享类型 | 不夹带页面 Props、model 状态或运行时逻辑 |

### 保留的 backend 生成接口文件

以下文件由上一版单后端流程产出，当前 yiyancha 配置不会更新或删除它们。它们是协议层，不代表对应页面、model、认证状态或后端环境已完成联调：

| 文件 | 当前用途 | 内容限制 |
| --- | --- | --- |
| `src/services/backend/index.ts` | 聚合下列请求分组 | 只保留生成导出，不加状态、UI 或业务编排 |
| `src/services/backend/typings.d.ts` | `BackendAPI` 命名空间中的协议类型 | 只保留生成声明，不夹带页面 Props、model 状态或运行时逻辑 |
| `src/services/backend/dailifenyong.ts` | 代理差价收益试算接口包装 | 只描述生成协议，收益展示/流程状态交给业务 model，不能手改生成结果 |
| `src/services/backend/xitong.ts` | 系统存活检查接口包装 | 不在这里执行页面挂载请求或加入 UI 提示 |
| `src/services/backend/xitongzidi.ts` | 字典项查询接口包装 | 字典缓存归明确的 model/查询层，不在生成文件隐藏缓存或状态 |
| `src/services/backend/zhanghaoyurenzheng.ts` | 登录、退出、当前账号、登录记录、权限和注册请求 | 不在生成文件保存 token、重定向或初始化 model；接入流程由应用层明确编排 |
| `src/services/backend/zhongtaijiaosequanxianguanli.ts` | 角色权限和账号角色替换请求 | 只描述 HTTP 协议，权限表单及其业务状态归对应页面/model |

全部继承“不可手改生成结果”的限制，免于手写 service/类型的体量评估线；生成后的文案或协议变化应更新生成来源，手写适配放到不会被覆盖的目录。

## 9. Mock

### `mock/userAPI.ts` — 手写，开发接口模拟

- 定义两条内存用户数据，以路由映射函数调用 `res.json()` 返回响应。
- 当前只实现 `GET /api/v1/queryUserList` 和 `PUT /api/v1/user/`。
- 列表接口不处理分页、关键词、排序和筛选，也没有返回 `total`。
- PUT 路由未带动态用户 ID，且只返回成功，并未真正修改数组；不能假定与 `PUT /api/v1/user/:userId` 的 service 完全匹配。
- 新增、详情、删除没有对应 Mock，因此当前模板不能据此宣称完整 CRUD 已可用。
- 新增业务 Mock 时保持路径、HTTP 方法、ID 类型、枚举、分页和业务错误格式与真实接口一致。
- Mock 仅服务于开发调试，不能作为生产 API 或真实权限控制。

## 10. Umi 临时生成文件

全部属于 `src/.umi/`，不手动维护。以下按用途逐项说明常见生成文件；当前生成阶段不一定同时存在所有条目。

### 顶层与 core

| 文件（相对 `src/.umi/`） | 用途 |
| --- | --- |
| `appData.json` | Umi 生成的应用元信息，辅助框架/工具掌握配置、路由等信息；具体字段随版本变化 |
| `umi.ts` | 生成的浏览器应用入口，连接 polyfill、路由、插件、history 与 React 渲染器 |
| `exports.ts` | 启用插件的公共能力汇总出口，通常供框架别名接入；某些阶段尚未生成 |
| `tsconfig.json` | 框架生成的 TypeScript 选项、别名等配置，由根 tsconfig 扩展 |
| `typings.d.ts` | 框架/插件生成的类型声明与模块补充 |
| `testBrowser.tsx` | 为浏览器渲染测试提供应用壳与 memory history；存在它不代表已经配置了测试命令 |
| `core/route.tsx` | 将配置路由转成运行时路由及组件映射 |
| `core/EmptyRoute.tsx` | 框架用于无直接页面组件等场景的空路由承载组件 |
| `core/plugin.ts` | 创建并注册运行时插件管理器 |
| `core/history.ts` | 创建并导出路由历史相关能力 |
| `core/historyIntelli.ts` | 根据路由树生成导航类型提示，辅助 history 的类型推导 |
| `core/pluginConfig.ts` | 生成插件组合后的配置类型 |
| `core/pluginConfigJoi.d.ts` | 插件配置校验体系所需的类型声明 |
| `core/defineApp.ts` | 某些生成阶段的 defineApp 相关连接/类型入口；没有生成时不要自行补文件 |
| `core/polyfill.ts` | 接入框架需要的兼容性补充 |
| `core/terminal.ts` | 开发模式把 terminal 日志能力连接到 Umi 开发服务，不是业务 API |
| `core/helmet.ts` | 页面 head/Helmet 能力导出 |
| `core/helmetContext.ts` | Helmet 上下文连接 |

### plugin-access

| 文件                        | 用途                                   |
| --------------------------- | -------------------------------------- |
| `plugin-access/context.ts`  | 权限上下文定义                         |
| `plugin-access/index.tsx`   | Access 组件、useAccess 等权限消费能力  |
| `plugin-access/runtime.tsx` | 将权限计算和 Provider 接入运行时组件树 |
| `plugin-access/types.d.ts`  | 权限结果的类型声明                     |

### plugin-antd

| 文件 | 用途 |
| --- | --- |
| `plugin-antd/runtime.tsx` | 把 Ant Design 的运行时配置、Provider 等接入应用 |
| `plugin-antd/runtimeConfig.d.ts` | Ant Design 运行时配置扩展类型 |
| `plugin-antd/types.d.ts` | 插件公共类型 |

### plugin-initialState

| 文件 | 用途 |
| --- | --- |
| `plugin-initialState/@@initialState.ts` | 框架提供的初始化状态模型，连接 getInitialState 与状态更新能力 |
| `plugin-initialState/Provider.tsx` | 初始化状态加载及上下文包装 |
| `plugin-initialState/runtime.tsx` | 把初始化 Provider 接入运行时 |
| `plugin-initialState/runtimeConfig.d.ts` | getInitialState 等运行时扩展的类型 |

### plugin-layout

| 文件 | 用途 |
| --- | --- |
| `plugin-layout/index.ts` | 布局插件类型或公共出口；部分阶段可能只是生成占位 |
| `plugin-layout/Layout.tsx` | 根据配置、路由和运行时参数生成后台布局 |
| `plugin-layout/Layout.css` | 生成布局的配套样式 |
| `plugin-layout/Logo.tsx` | 布局 logo 展示逻辑 |
| `plugin-layout/rightRender.tsx` | 顶栏右侧内容的生成连接 |
| `plugin-layout/Exception.tsx` | 布局内的异常或无权限展示辅助 |
| `plugin-layout/icons.tsx` | 路由菜单图标映射 |
| `plugin-layout/runtime.tsx` | 将布局能力注册到应用运行时 |
| `plugin-layout/runtimeConfig.d.ts` | 运行时 layout 配置类型 |
| `plugin-layout/types.d.ts` | 布局配置和相关公共类型 |

### model 与 request 插件

| 文件 | 用途 |
| --- | --- |
| `plugin-model/model.ts` | 扫描、连接业务 model 及框架内置 model |
| `plugin-model/index.tsx` | useModel 与共享模型的上下文实现 |
| `plugin-model/runtime.tsx` | 将 model Provider 接入应用 |
| `plugin-request/request.ts` | 根据运行时配置创建/包装 request 能力 |
| `plugin-request/index.ts` | request、useRequest 等插件能力出口，具体导出以当前版本为准 |
| `plugin-request/runtimeConfig.d.ts` | 请求运行时配置的类型扩展 |
| `plugin-request/types.d.ts` | request 插件相关公共类型 |

`src/.umi-production/`、`src/.umi-test/` 是其他运行模式的同类临时目录。若生成类型失效，从源码/插件配置定位后运行 `pnpm setup`；不要在这里直接打补丁。

## 11. 依赖、产物与开发工具文件

| 路径 | 用途与维护边界 |
| --- | --- |
| `node_modules/` | pnpm 安装出的依赖入口与链接；不手改源码或提交 |
| `node_modules/.pnpm/` | 依赖的虚拟存储目录，可同时包含多个 esbuild 版本；多个版本本身不是报错 |
| `node_modules/.pnpm-workspace-state-v1.json` | pnpm 记录的本机工作区安装状态，不是项目业务配置 |
| `dist/index.html` | 构建后的 HTML 入口，只有对应构建实际产生时才存在 |
| `dist/` 内 JS/CSS/资源文件 | 生产构建结果，文件名可能带哈希；通过 `pnpm build` 更新 |
| `.git/` | Git 内部元数据，不手改以“修复项目配置” |
| `.claude/settings.local.json` | 当前本机开发助手配置；不是 Umi 配置，不在本 Skill 的任务中更改权限或 hooks |
| `.claude/skills/umi-max/SKILL.md` | 本 Skill 的入口、触发描述和核心执行规范 |
| `.claude/skills/umi-max/references/project-files.md` | 当前逐文件说明，解释文件职责和维护边界 |
| `.claude/skills/umi-max/references/development-guide.md` | 页面、接口、权限、状态、Mock、验证的具体流程 |

`.mfsu/`、`.swc/`、`.turbopack/` 等路径出现在忽略规则中，不表示当前都已经启用或存在。

### JetBrains IDE 项目文件

以下文件属于编辑器设置，不参与 Umi 运行；有团队约定时可以共享项目级设置，本次不修改它们：

| 文件 | 当前用途 |
| --- | --- |
| `.idea/.gitignore` | 忽略 IDE 的 shelf、workspace.xml、HTTP 请求历史和本地数据源等内容；不等于忽略整个 `.idea` |
| `.idea/codeStyles/Project.xml` | 项目级代码风格：JS/TS 单引号、分号、多行尾逗号、2 空格等；其中存在 Vue 风格配置也不代表这是 Vue 项目 |
| `.idea/codeStyles/codeStyleConfig.xml` | 让 IDE 使用该项目的代码风格，而不是只用个人全局设置 |
| `.idea/modules.xml` | 注册本项目对应的 `.iml` 模块文件 |
| `.idea/prettier.xml` | IDE 的 Prettier 集成，当前配置为自动检测模式；具体格式仍以 `.prettierrc` 为准 |
| `.idea/vcs.xml` | 将项目根目录关联到 Git 版本控制 |
| `.idea/yiyancha-admin-umi.iml` | IDE 的 Web 模块描述、内容根和继承环境配置，不是应用依赖或 TypeScript 编译入口 |

## 12. 当前不存在的可选扩展

以下不是当前项目事实，也不是必须补齐的脚手架：

| 可选路径 | 有明确需求时的用途 | 先决条件 |
| --- | --- | --- |
| `src/layouts/` | 自定义页面布局 | 先确认现有 layout 插件配置无法满足 |
| `src/hooks/` | 复用的业务 Hook | 已有真实重复逻辑，不为抽象而抽象 |
| `src/locales/` | 国际化文案 | 需要启用/配置相应能力，当前菜单 locale 为 false |
| `src/global.less` | 确有全局范围需求的样式 | 先确认局部 CSS Modules 或主题配置无法满足 |
| `public/` | 按原路径提供的公共静态文件 | 不放秘密文件；与 assets 导入处理方式不同 |
| `src/services/<手写业务域>/` | 新业务域的手写 service/类型 | 避开 `config/service.ts` 声明的生成目录及保留的 demo/backend，保持领域边界 |
| `src/types/` | 多模块共享业务类型 | 不把每个局部 Props 都提升到这里 |
| `tests/` 或就近测试文件 | 自动化测试 | 先确认并配置测试框架和脚本，不能只创建文件就声称可运行 |

## 13. 逐文件内容限制与拆分规则

### 13.1 如何理解“限制”

以下“允许/禁止”是本项目的内容归属规范；“体量评估线”是维护建议，不是 Umi Max 的技术上限，也不是当前已经启用的自动检查。只有实际修改对应 ESLint/脚本/CI 并验证后，才能宣称工具会强制执行；本次只更新 Skill，不修改这些工具配置。

统一口径：

- 行数按 Prettier 格式化后的物理行计算，包含注释和空行，不通过压行、删除必要换行规避。
- 到评估线时先检查职责、重复和依赖方向；一个清晰的 220 行组件可能比四个没有独立职责的小文件更合理。
- 不追溯要求所有旧文件立即达标，不将无关重构混入当前需求；增加新复杂度时才处理相关边界。
- 生成代码、锁文件、静态数据清单、IDE 描述和构建产物不按手写业务代码的行数拆分。
- 表格中的“不可手改”是指正常业务开发不直接编辑生成内容；需要改变生成行为，应调整生成源/配置并重新生成。

| 类别 | 体量评估线 | 合理拆分方向 |
| --- | --- | --- |
| 页面、`src/app.ts`、编译配置中的手写逻辑 | 300 行 | 复杂数据流程优先页面 model，独立 UI 拆组件、实例隔离逻辑拆本地 Hook；大路由表在确认框架支持后独立组织 |
| 业务组件、model、实例 Hook、手写 service、单个 Less 文件 | 200 行 | 按状态所有权、交互区域、业务域、API Controller、组件样式边界拆分 |
| 纯工具、常量、手写业务类型 | 150 行 | 按格式化/金额/日期、枚举所属业务、请求/响应领域拆分 |
| 纯导出 `index.ts` | 30 行 | 先检查是否混入实现，再按真实业务域整理公共出口 |
| `src/access.ts` | 150 行 | 纯权限辅助函数与领域权限分组；保留明确权限入口，不分散到页面写多套判断 |
| Skill 入口 | 建议不超过 300 行 | 核心规则留入口，细节下沉已有 references，不降低关键规则可发现性 |
| Markdown 参考文档 | 不设代码行数线 | 按主题/标题组织，避免为每个源码文件再建一份文档 |

### 13.2 根配置与工具文件

| 文件 | 允许写入 | 禁止写入/行为 | 体量或维护边界 |
| --- | --- | --- | --- |
| `package.json` | 直接依赖、开发依赖、真实可用的 scripts、必要包元数据 | JSX、业务接口数据、明文凭证；无需求升级/删除依赖、伪造尚未配置的检查脚本 | 声明清单，不按代码行数拆；每次依赖变更核对锁文件 |
| `pnpm-lock.yaml` | 由 pnpm 写入依赖解析和校验结果 | 手改哈希/依赖来源，插入业务配置；为解决业务错误清空锁文件 | 包管理器维护，不拆分 |
| `pnpm-workspace.yaml` | pnpm 支持的项目设置、经审查的脚本允许/拒绝值 | API 地址、业务权限、密钥、占位字符串；无差别开启全部脚本 | 声明配置，不引入执行逻辑；无多包需求不扩成 monorepo |
| `.npmrc` | 下载源、包管理器支持的非秘密选项、环境凭证引用 | 可提交的明文 token、业务 API 配置、前端路由、绕过证书验证作为默认修复 | 保持最小配置；认证与可共享设置分离 |
| `.umirc.ts` | 编译配置、路由数组引用、插件开关、构建参数 | React 页面/Hook、登录请求、运行时用户数据、service 实现、后端秘密；当前不支持的 openAPI 插件配置 | 手写逻辑参考 300 行；路由由 config/router.ts 维护，保持单一有效入口 |
| `config/router.ts` | 显式路由数组、菜单信息、重定向和权限键 | 请求、页面状态、另建 Umi 配置入口 | 路由数据按真实分组组织，不为行数机械切分 |
| `config/service.ts` | 多后端生成配置、路径白名单及其类型 | 凭证、业务请求、React 状态、生成器实现或 Umi 配置 | 声明配置；服务目录名、namespace、协议来源和请求地址必须明确 |
| `tsconfig.json` | 继承关系、项目需要的编译选项和路径映射 | 函数/请求/业务数据；为消除报错批量关闭检查；复制整份生成配置 | JSON 声明，不按代码行数拆，保留框架继承关系 |
| `typings.d.ts` | 框架类型引入、确有全局必要的环境/模块类型声明 | 可执行实现、网络请求、与全局无关的页面 Props；声明不存在的模块来掩盖缺依赖 | 手写声明参考 150 行；局部类型下沉到所属模块 |
| `.eslintrc.js` | 继承规则、确有理由的项目级覆盖 | 业务处理、请求、凭证；无需求全局禁用规则或降低检查力度 | 保持最小配置；单处问题优先改代码 |
| `.stylelintrc.js` | 样式检查继承和必要规则 | 具体页面 CSS、UI 运行逻辑；为了单处样式错误关闭全局检查 | 保持最小配置，不改成样式文件 |
| `.prettierrc` | 统一格式、解析器覆盖、已有格式化插件配置 | API、运行逻辑、业务数据；按个人偏好无需求全仓换风格 | 不设代码行数线，新增规则要考虑全仓影响 |
| `.prettierignore` | 不应格式化的生成/第三方文件模式 | 格式化参数、Git 权限；为逃避检查忽略全部业务源码 | 只写路径模式，核对误匹配 |
| `.lintstagedrc` | 暂存文件匹配和必要检查命令 | 发布/推送、破坏性清理、访问生产资源、下载执行未知脚本 | 检查链保持短且可解释；新增命令需确认依赖和实际作用 |
| `.gitignore` | 本机文件、生成产物、缓存、秘密文件模式 | 通过忽略源码隐藏改动；把它当作已提交秘密的清理工具 | 规则精确，避免误忽略业务文件和必需的锁文件 |
| `README.md` | 可验证的项目介绍、启动/部署入口说明 | 凭证、未验证的“已实现能力”、重复整份 Skill、临时分析日志 | 无硬行数线；本次未要求时不顺手改它 |
| `.mcp.json` | 明确授权的开发工具服务声明、合适的环境变量引用 | Umi 配置、业务请求；明文共享凭证；未经请求增加服务器或改变工具访问范围 | 独立工具配置边界，不因页面任务修改 |
| `scripts/openapi.ts` | 加载配置、调用生成流程、处理退出状态 | 业务请求、React 状态、页面逻辑 | 保持入口简短，不混入校验、筛选和目录安装实现 |
| `scripts/openapi-config.ts`、`scripts/openapi-select.ts` | 纯配置校验、协议及路径筛选 | 文件写入、页面/model/UI、隐式网络请求 | 按真实职责维护；纯工具参考 150 行 |
| `scripts/openapi-generate.ts` | 文档读取、隔离生成、默认请求地址注入、目录替换恢复和清理 | 页面 model、React Hook、UI 提示、执行协议中的代码、在生成文件掺入手写业务 | 开发工具参考 200 行，变更需验证输入输出；不因普通页面任务生成或覆盖人工改动 |
| `scripts/openapi-*.test.ts` | 配置/筛选测试、临时目录生成集成测试、替身请求行为校验 | 调用真实登录/写入业务接口、改项目生成输出、依赖内网服务 | 使用 Node test 经 tsx 执行，清理自行创建的临时目录 |
| `.husky/pre-commit` | 本地必要检查的调用入口 | 自动 push、发布、访问生产服务；跳过检查或堆积大段业务脚本 | 简短调用链，复杂检查归独立已声明工具 |
| `.husky/commit-msg` | 将提交信息交给校验工具 | 自动改写/推送提交，隐藏校验失败，放置业务逻辑 | 保留参数传递和正确退出状态 |

### 13.3 应用、页面、组件和业务文件

| 文件 | 允许写入 | 禁止写入/行为 | 体量或拆分时机 |
| --- | --- | --- | --- |
| `src/app.ts` | getInitialState、运行时 layout/request 等框架支持的扩展及必要编排 | 大段页面 JSX、表单字段、业务列表列配置、每个业务接口实现、编译配置 | 300 行评估；请求实现下沉 service，独立运行时辅助按职责组织 |
| `src/access.ts` | 从初始化状态计算布尔/函数权限、必要的纯权限辅助调用 | 发请求、修改 initialState、持久化 token、弹提示、写 UI、使用示例名称当真实管理员证明 | 150 行评估；按权限域抽纯函数，不产生网络副作用 |
| `src/models/global.ts` | 真正共享的状态、更新动作、与该状态相关的必要 Hook；需要异步时调用 service | JSX、路由表、页面列配置、弹窗私有输入、重复保存另一份当前用户、硬编码请求实现 | 200 行评估；按共享状态所属业务域拆，不能变成全站杂物仓库 |
| `src/constants/index.ts` | 稳定默认值、共享常量、必要枚举出口 | useState、request、动态当前用户、凭证、导入页面/model 导致副作用 | 150 行评估；按业务域分组，纯出口参考 30 行 |
| `src/utils/format.ts` | 字符串及同类格式化纯函数、必要类型导入 | React Hook、JSX、request、message、访问页面/model、隐式修改外部状态 | 150 行评估；出现不同领域时按日期/金额等真实职责拆 |
| `src/assets/.gitkeep` | 保留空目录所需的空占位 | 配置、代码、base64 资源、密钥和真实用户文件 | 保持空占位，不按代码行数拆 |
| `src/pages/Home/index.tsx` | 首页容器、页面局部状态、读取 model、组合页面组件 | 定义全局 model、在 JSX 中拼请求实现、放其他页面逻辑、将页面当共享组件反向导入 | 300 行评估；独立交互区域拆到 Home/components |
| `src/pages/Home/index.less` | Home 局部布局/展示样式 | JS/接口数据、全站 reset、无边界覆盖所有 `.ant-*`、其他页面样式 | 200 行评估；与组件边界一起拆，不按任意行数切样式 |
| `src/pages/Access/index.tsx` | 权限演示页、消费 useAccess、权限不同状态的页面展示 | 再实现另一套权限来源、用隐藏按钮冒充后端鉴权、写死管理员绕过 | 300 行评估；复杂示例拆页面私有组件 |
| `src/pages/Table/index.tsx` | 表格/列的展示配置、消费 model 动作、必要视图引用、组织弹窗和详情；简单流程可用 ProTable request | 直接定义 HTTP 协议、生成 DTO、长篇表单 JSX、复杂关联状态与请求编排、占位功能冒充已实现 | 300 行评估；后续涉及复杂数据流程时优先就近 Table/model.ts，独立 UI 拆组件，不因此任务无关地重构现有模板 |
| `src/pages/Table/components/CreateForm.tsx` | 新增弹窗外壳、Props、children、取消/可见状态回调 | 自行请求列表、管理全局权限、修改父组件状态变量、混入其他页面新增流程 | 200 行评估；保持当前容器职责，改变所有权先调整 Props/调用方 |
| `src/pages/Table/components/UpdateForm.tsx` | 本页编辑字段、校验、回填、步骤、提交/取消回调、表单值类型 | 自行查全局用户、隐藏提交目标 ID 来源、直接刷新外部列表、硬编码后端请求、承载别的业务表单 | 200 行评估；步骤存在独立交互时才拆组件，提交 DTO 映射归明确的编排层 |
| `src/components/Guide/Guide.tsx` | 基于 name Props 的欢迎展示、组件私有交互 | 读取特定页面/model、发业务请求、修改路由、依赖 Table 或 Home 的内部文件 | 200 行评估；仍保持纯展示职责，不为扩功能扩成通用后台壳 |
| `src/components/Guide/Guide.less` | Guide 局部样式 | 页面布局、全站主题重置、其他组件样式、无边界全局覆盖 | 200 行评估；跟随真实子组件拆 |
| `src/components/Guide/index.ts` | Guide 的默认/必要类型导出 | JSX、状态、request、初始化副作用、内部实现堆积 | 纯出口参考 30 行，默认只做公开导出 |
| `src/services/demo/UserController.ts` | 通过真实生成流程输出的方法、路径、参数、返回类型 | 手写页面逻辑、message、model、路由、副作用适配；正常开发直接手改生成结果 | 协议生成，不套 200 行线；适配放独立手写 service，生成规则从源调整 |
| `src/services/demo/index.ts` | 生成器输出的 Controller 聚合导出 | 页面状态、请求编排、缓存、提示、副作用；手写改动等待下次覆盖 | 生成出口不按手写 30 行线强拆 |
| `src/services/demo/typings.d.ts` | 生成协议对应的 namespace、DTO、响应与枚举类型 | 函数实现、JSX、页面 Props、运行时校验逻辑；修改类型伪装后端支持字段 | 生成类型不套 150 行线，不手拆破坏生成器输出 |
| `mock/userAPI.ts` | 与 service 同协议的路由响应、明确的开发数据和必要内存变更 | 真实敏感数据、生产凭证、调用生产服务、无协议依据假成功、前端页面逻辑 | 路由处理逻辑参考 200 行；按业务域拆，静态测试数据不机械按行切分 |

对于新建的手写 `src/services/<domain>/*.ts`：允许描述 HTTP 协议、输入/输出类型和协议需要的轻量转换；禁止导入 `antd`、页面、model 和弹 UI 提示，参考 200 行，按业务域/Controller 拆。适配生成代码的手写文件必须放在不会被生成器覆盖的位置，先核对实际输出目录，不能仅凭文件名猜测安全。

对于新建的手写 `types.ts`：允许局部业务 DTO 和共享类型导出，禁止运行时实现，参考 150 行；不在“全局类型”中重复声明已生成的同名 API 类型。

### 13.4 IDE、Skill 与本机配置

| 文件 | 允许内容 | 禁止内容或修改边界 |
| --- | --- | --- |
| `.idea/.gitignore` | IDE 个人状态、临时请求历史等排除模式 | 业务忽略规则的另一套隐蔽入口；批量隐藏源码 |
| `.idea/codeStyles/Project.xml` | 与团队格式一致的 IDE 项目风格 | 修改业务配置、凭证；与 Prettier 制造相互覆盖的格式规则 |
| `.idea/codeStyles/codeStyleConfig.xml` | IDE 是否启用项目风格的选择 | 应用运行参数、请求地址、脚本 |
| `.idea/modules.xml` | 模块文件引用 | 后端服务信息、依赖清单、个人绝对路径泄漏 |
| `.idea/prettier.xml` | IDE 的 Prettier 检测/集成 | 代替 `.prettierrc` 定义另一套团队格式、添加自动发布动作 |
| `.idea/vcs.xml` | 项目 VCS 映射 | Git 凭证、自动 push/清理脚本 |
| `.idea/yiyancha-admin-umi.iml` | Web 模块和内容根等 IDE 元信息 | 业务依赖、运行时代码、个人密钥或本机敏感路径 |
| `.claude/settings.local.json` | 经明确请求配置的本机助手设置 | 因为普通代码需求自行放宽权限、增加 hooks 或更改安全策略；本 Skill 不授权修改 |
| `.claude/skills/umi-max/SKILL.md` | 触发描述、关键规则、按需阅读索引 | 整份源码、完整依赖锁文件、凭证、过时状态承诺、隐藏的权限放行指令；建议 300 行内 |
| `.claude/skills/umi-max/references/project-files.md` | 文件职责、逐文件限制、生成文件边界 | 把推荐写成框架强制限制、把尚无文件写成已存在、复制敏感配置值 |
| `.claude/skills/umi-max/references/development-guide.md` | 已核对命令、按任务流程、正确/错误边界和验证要求 | 冒充已完成的测试结果、不可用的脚本、任务无关的长期计划或临时调查日志 |

### 13.5 生成文件的统一限制

第 10 节每个具体生成文件均继承下表规则，不因内容是 TS/TSX/CSS 而改成可维护源码：

| 文件范围 | 允许发生的变更 | 禁止写入 | 正确入口 |
| --- | --- | --- | --- |
| `src/.umi/` 第 10 节所有文件，以及 `.umi-production` / `.umi-test` | 对应工具根据源码、插件和模式重新生成 | 手写业务、临时错误修补、改生成类型来掩盖编译错误、固定本机路径 | 根配置、src/app.ts、真实业务源码、依赖/插件版本及 setup/build |
| `src/services/<name>/` 配置声明的生成目录，以及保留的 backend 协议文件 | OpenAPI 生成器基于已核对文档输出；旧 backend 不随当前 yiyancha 配置更新 | 手写 model、页面/组件、token 存储、UI 提示或缓存；通过改生成类型伪装协议变更 | config/service.ts、scripts/openapi\*.ts、协议来源、生成目录之外的手写 service 与业务 model |
| `.husky/_/` 内 hook 转发器、`h`、`husky.sh`、生成忽略规则 | Husky 安装和准备过程生成 | 自定义业务检查、绕过校验、发布脚本 | `.husky/pre-commit`、`.husky/commit-msg` 等项目自定义 hook |
| `node_modules/`、`.pnpm/` 和内部状态文件 | 包管理器安装、链接、重建 | 手修第三方包当作可复现解决方案、项目配置、业务代码 | package.json、pnpm 配置及必要的正式依赖修复机制 |
| `dist/` 内 HTML、JS、CSS、资源文件 | 正式构建产生 | 手改线上业务补丁后不更新源码、凭证、源码级运行配置 | 项目源码与构建/部署配置 |
| `.git/` 内文件 | Git 自身管理 | 为解决应用错误手改 Git 元数据 | 正常 Git 命令；破坏性操作必须单独授权 |

### 13.6 允许的依赖方向

```text
页面 → 页面私有组件 / 共享组件 / 页面 model / 实例 Hook / utils / constants / 业务类型
简单 ProTable request → service（仅简单请求，不在页面堆复杂编排）
业务组件容器 → 所属领域的已注册 model 或实例 Hook / 展示组件
展示组件 → UI 库 / 自身样式 / Props / 纯 utils / 明确的类型
model / 实例 Hook → React Hook / service / utils / constants / 业务类型
手写 service → request / 协议类型 / 必要纯转换 / 生成的 service
access → 初始化状态类型 / 纯权限辅助
utils → 其他纯工具 / 类型 / 必要且无业务副作用的工具库
constants → 静态值 / 类型
纯导出入口 → 所属模块的公开导出
```

禁止 `service → 页面/model/UI`、`utils/constants → 页面/model/service`、共享组件反向引用页面私有实现，以及模块互相导入形成循环。上图表示分层规则，不要求每个文件把箭头所列依赖全部引入；纯展示组件如 Guide 也不能据此增加业务请求。

新增页面私有 Hook 时仍然由它承担明确的实例数据逻辑，不把原页面整段搬进去后只留下一个空壳组件。若确有例外需求，先说明真实约束与影响，再选择最小调整，不用循环依赖或全局副作用强行打通。

### 13.7 页面 model、领域 model 与实例 Hook 的文件限制

以下为按需采用的路径规范，当前并未要求创建这些示例文件；现有 `src/models/global.ts` 的实际说明保持不变：

| 文件/模式 | 允许内容 | 禁止内容 | 注册与体量边界 |
| --- | --- | --- | --- |
| `src/pages/<Page>/model.ts` | 页面复杂关联状态、service 请求编排、业务动作、DTO 映射、派生值、明确 reset | JSX、表格 render 列、Modal/UI 提示、页面/组件导入、复制全局当前用户、无条件挂载请求 | 自动发现，默认 `<Page>.model`；共享而非路由隔离，参考 200 行 |
| `src/pages/<Page>/models/<domain>.ts` | 页面中独立业务域的状态与动作 | 按函数数量机械切分、模型互相循环依赖、在此放常量/测试伪装成 model | 自动发现，默认 `<Page>.<domain>`；辅助/类型文件尽量移出扫描目录，参考 200 行 |
| `src/models/<domain>.ts` | 多页面确实共享的业务状态、动作及 service 编排 | 单个组件实例的输入草稿、所有页面的弹窗状态、重复初始化用户、UI 依赖 | 自动发现，默认 `<domain>`；不能变成全站状态杂物仓库，参考 200 行 |
| `src/components/<Component>/model.ts` | 未注册时导出本地实例 Hook，管理组件独立状态与数据逻辑；明确注册后才作为共享 model | 假定放在组件旁就会自动注册；既注册又直接调用导致双实例；用共享状态承载本应独立的草稿 | 默认不扫描；未注册时组件直接导入 Hook，共享时核对注册结果；参考 200 行 |
| `src/pages/<Page>/components/<Component>/model.ts` | 确实需要共享且明确归属的组件业务状态 | 把 pages 下的该路径误当作私有 Hook，直接调用默认函数制造第二份实例 | 位于 pages 扫描树，默认名称含 `.components.<Component>.model`；参考 200 行 |
| 组件旁 `useXxxModel.ts`，且不在 models 扫描目录内 | 接收 ID/Props 参数、每次调用独立的状态与数据逻辑、service 编排、必要清理 | JSX、导入父页面、全局可变状态、用 useModel 共享草稿却宣称隔离、复制完整页面 | 不作为框架 model 注册，直接导入 Hook；参考 200 行，不必跨组件复用才可抽离 |
| 复杂页面 `index.tsx` | 消费 model 的所需字段/动作、渲染、事件与视图引用、UI 提示 | model/service 的完整实现、重复业务状态与请求源、借口未超行数而不拆复杂流程 | 参考 300 行；先按职责拆，再考虑行数 |

`useModel('Table.model')`、`useModel('Table.query')` 等名称应以实际生成表为准，不能使用默认导出函数名代替。消费者使用 `useModel` 共享；实例 Hook 使用直接导入独立调用，两者不可混用。

生命周期、请求触发、防重复初始化、reset 及 ProTable 单一数据源的具体规则见 [开发流程](development-guide.md) 第 7.3—7.7 节；修改 model 时必须同时验证这些行为，不能仅凭“页面代码变短”判断拆分完成。

### 13.8 新建组件的目录与逐文件边界

页面私有组件统一放 `src/pages/<Page>/components/<Component>/`，跨页复用组件统一放 `src/components/<Component>/`。**一个组件一个 PascalCase 目录，入口 `index.tsx`、样式 `index.less`、数据逻辑 `model.ts`。** 后两项按需创建；页面私有实例 Hook 依第 13.7 节避开自动注册，使用同目录 `useXxxModel.ts`。

| 文件/模式 | 允许内容 | 禁止内容/行为 | 体量或维护边界 |
| --- | --- | --- | --- |
| `<Component>/index.tsx` | 直接实现并默认导出组件、Props、JSX、事件、视图引用、消费 model/Hook 或父级数据 | 大段请求协议、重复业务状态；将实现放 `<Component>.tsx` 再增加无必要的 index 转发层 | 组件参考 200 行，不是纯导出入口的 30 行；调用方按目录导入 |
| `<Component>/index.less` | 仅该组件的 CSS Modules 样式 | 依赖兄弟组件私有 Less；无边界覆盖全站；无样式仍建空文件 | 参考 200 行；入口从 `./index.less` 导入 |
| `<Component>/model.ts` | 状态、请求编排、业务动作、派生值 | JSX、路由跳转、确认框；不检查扫描规则就假定共享/隔离；为凑结构创建空 model | 参考 200 行；区分 pages 下共享注册与 src/components 下未注册的本地 Hook，详见 13.7 |
| `<Component>/useXxxModel.ts` | pages 下确需实例隔离时的本地复杂逻辑 | 将例外 Hook 散放父级 components；再创建空 model.ts；导入自动注册模型后重复调用 | 同目录命名例外，不放 models 扫描目录；参考 200 行 |
| `<Component>/types.ts`、纯工具、测试、资源 | 该组件确需独立的类型/纯函数、验证和静态资源 | 无需求预建空壳；外部组件依赖私有实现 | 按需就近放置；手写类型/纯工具参考 150 行，测试和资源按实际职责组织 |
| `<Component>/components/<Child>/index.tsx` | 有独立职责的内部子组件 | 将独立子组件平铺到父级；为缩短行数机械拆空壳 | 子组件继续使用同一目录规范 |

- 禁止 `components/Foo.tsx`、`components/Foo.less`、`components/Bar.tsx`、`components/Bar.less` 的平铺结构；应为 `components/Foo/index.tsx`、`components/Foo/index.less` 等。
- 既有 `Guide/Guide.tsx` 加 `index.ts` 等旧组织方式不作为新建规范；本节与旧路径示例不一致时，新建组件按本节执行，不为规范更新批量重构无关旧文件。
- 迁移组件目录时同步导入、Less/资源相对路径、测试与受路径影响的 model 命名空间；页面公用状态仍归页面 model，不因目录内允许 model 就复制数据。
- 完整目录示例与实施方式见 [development-guide.md](development-guide.md) 第 3.1 节。
