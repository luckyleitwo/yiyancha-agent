# 开发流程与示例

## 1. 开始任务前

按实际需求读取文件，不每次把全部参考文档和生成代码装入上下文：

| 任务          | 优先阅读                                                    |
| ------------- | ----------------------------------------------------------- |
| 新增页面      | `config/router.ts`、同类 `src/pages/`、相关 service         |
| 调整菜单/布局 | `config/router.ts`、`.umirc.ts`、`src/app.ts`               |
| 权限          | `src/app.ts`、`src/access.ts`、目标路由与按钮               |
| 接口对接      | `config/service.ts`、service、接口类型、目标页面、相关 Mock |
| 全局状态      | `src/models/`、`src/app.ts`、使用状态的组件                 |
| 表单          | 页面提交逻辑、表单 Props、请求 DTO                          |
| 安装/启动失败 | `package.json`、锁文件、`.npmrc`、workspace 配置、完整日志  |

先确认用户希望“解释、设计方案还是直接修改”，不把解释文件职责自动扩大成重构项目。

## 2. 本地命令

| 命令 | 做什么 | 注意 |
| --- | --- | --- |
| `node --version` | 查看实际 Node 版本 | 不凭框架名字猜版本兼容性 |
| `pnpm --version` | 查看实际 pnpm 版本 | 当前项目没有锁定包管理器版本 |
| `pnpm install --frozen-lockfile` | 按锁文件安装 | 清单与锁文件不一致时会失败；有意改依赖则由正常 pnpm 操作更新锁文件 |
| `pnpm setup` | 生成框架临时文件和类型 | 不修改 `.umi` 来替代此过程 |
| `pnpm openapi:service` | 按 `config/service.ts` 的多后端路径白名单生成接口 | `pnpm openapi` 是别名；会替换启用服务的生成目录，不是业务请求 |
| `pnpm dev` | 开发运行 | 以实际打印的 host、端口为准，不假设永远是 8000 |
| `pnpm build` | 生产构建 | 生成 dist；不等于已验证部署服务器回退和 API 代理 |
| `pnpm exec tsc --noEmit` | 类型检查 | 先确保生成的 tsconfig 已存在 |
| `pnpm exec max lint` | 代码与样式检查 | 独立于 TypeScript 编译 |
| `pnpm exec max lint --eslint-only` | 只查 JS/TS/React | 可用于缩小检查范围 |
| `pnpm exec max lint --stylelint-only` | 只查样式 | 不检查业务请求和 UI 行为 |
| `pnpm exec prettier --check <文件>` | 只检查指定文件格式 | 路径含空格时加引号 |
| `pnpm exec prettier --write <文件>` | 格式化指定文件 | 会写文件，限制在本次范围 |

当前没有单独 `test`、`typecheck`、`lint` scripts，不能把上面的 `pnpm exec ...` 改写成不存在的项目脚本。

## 3. 新增一个业务页面

以“用户管理”举例，下列是建议路径，不是已经存在的文件：

```text
src/pages/UserManagement/
├── index.tsx                 渲染、组件组合、绑定 model 动作和视图引用
├── model.ts                  复杂数据流程的请求编排、关联状态和业务动作
├── index.less                只有确实需要时才创建
└── components/
    └── UserForm/             一个组件一个目录，不平铺组件文件
        ├── index.tsx         页面专用新增/编辑表单，直接实现并默认导出
        ├── index.less        有自定义样式时创建
        └── useUserEditorModel.ts 需实例隔离的复杂逻辑；避开 pages 的 model.ts 扫描

src/services/userManagement/
├── index.ts                  手写 API 包装
└── types.ts                  该业务域的请求/响应类型

mock/userManagement.ts        需要本地模拟时才创建
```

实施顺序：

1. 确认列表字段、筛选项、分页协议、按钮权限、新增/编辑字段、删除规则。
2. 查找现有接口和类型，有可复用实现就复用，不再建立第二套同义接口。
3. 先明确状态与数据所有者：复杂页面优先页面 `model.ts`，复杂组件需实例隔离时用本地 Hook，简单状态可留在组件；再创建必要页面和组件，不造空 model 或通用平台。
4. 在 `config/router.ts` 的路由数组注册，由 `.umirc.ts` 导入，例如：

   ```ts
   {
     name: '用户管理',
     path: '/users',
     component: './UserManagement',
     access: 'canManageUsers',
   }
   ```

5. 若使用上面的 `access`，必须在 `src/access.ts` 真实返回 `canManageUsers`，并明确其基于什么初始化数据。没有权限需求时不照抄这个字段。
6. 完成页面加载、空列表、接口失败、提交中、防重复提交、成功刷新及权限不足状态。
7. 通过实际页面完成一次完整操作链，而不只验证路由能打开。

路由可以配置嵌套 `routes`、`redirect`、`layout` 等，但只在需求需要时使用。菜单隐藏与路由权限是不同概念，不能用“菜单不显示”替代访问限制。

### 3.1 组件统一按目录创建

这是本项目的新建规范，不是 Umi 框架的硬性要求。页面私有组件放 `src/pages/<Page>/components/<Component>/`，跨页复用组件放 `src/components/<Component>/`，均使用以下组织方式：

```text
components/
├── OrderDetails/
│   ├── index.tsx       实现 OrderDetails 并默认导出
│   ├── index.less      该组件的局部样式，按需
│   ├── model.ts        复杂数据逻辑，按需且先明确注册方式
│   └── types.ts        局部业务类型较多时才拆
└── Welcome/
    ├── index.tsx       纯展示组件只接收 Props
    └── index.less      没有自定义样式时也不必创建
```

- 一个独立组件一个 PascalCase 目录；入口统一 `index.tsx`，局部样式统一 `index.less`，数据逻辑优先同目录 `model.ts`。不得平铺 `OrderDetails.tsx`、`OrderDetails.less`、`Welcome.tsx`、`Welcome.less`；只有一个文件的组件也按目录创建。
- `index.tsx` 直接实现并默认导出具名组件；不默认新建 `OrderDetails.tsx` 再用 `index.ts` 转导出。调用方使用 `import OrderDetails from './components/OrderDetails'`；组件内部使用 `import styles from './index.less'`。
- `index.tsx` 负责 JSX、事件绑定、视图引用及 UI 反馈；`model.ts` 负责状态、请求编排与派生数据，不写 JSX、路由跳转和确认弹窗；接口路径和 HTTP 参数仍归 service。
- `src/components/<Component>/model.ts` 默认不自动注册，可导出本地 `useXxxModel` Hook，由组件直接导入以隔离实例；需要共享时才核对已有领域 model 或显式注册，不能直接猜 `useModel` 名称。
- `src/pages/<Page>/components/<Component>/model.ts` 会被扫描成共享 model；如果每个实例必须独立，改用**同一组件目录内**的 `useXxxModel.ts`，这是为避免框架自动注册而设的命名例外，不是允许组件散放。不要同时创建空 `model.ts`。
- 纯展示组件不强制创建 model；没有自定义样式不创建空 Less。已有页面 model 提供数据时，子组件优先用 Props，不复制一份数据源。
- 独立子组件继续放在所属组件的 `components/<Child>/index.tsx` 中；测试、类型、纯工具和资源按需就近存放，不让外部调用方依赖私有实现。
- 旧结构是现状，不是新建模板；仅在本次涉及整理时迁移，不能借此批量重构无关组件。迁移需同步所有导入、样式和资源路径、测试，以及路径变化影响的 model 命名空间。

具体 model 发现规则与生命周期见第 7 节；逐文件边界见 [project-files.md](project-files.md) 第 13.8 节。

## 4. service 与类型

### 4.1 先识别生成代码

当前 `src/services/demo/` 有 OneAPI 自动生成标记：

- 优先更新明确存在的接口生成源和生成流程。
- 当前 `pnpm openapi:service` 通过 `tsx scripts/openapi.ts` 运行，`pnpm openapi` 是别名。它读取 `config/service.ts` 的多后端数组，使用 `@umijs/openapi` 按路径白名单生成 `src/services/<name>/` 和独立 namespace；当前启用服务为 `yiyancha`，生成 login、logout 两个请求函数，旧 `backend` 目录保留但不随此配置更新。
- `serverPath` 是生成请求的默认 `baseURL`，`schemaPath` 是 Swagger / OpenAPI JSON 来源，`pathPrefix` 补全接口选择路径并作为生成文件的分组起点，不重复添加到请求路径。文件名按此前缀后的第一级路径（如 `auth/login`、`auth/logout` → `auth.ts`）而非 Swagger tags 生成；函数名仍按 `operationId`。字符串选择单方法路径，多方法路径用 `{ path, method }` 指定；空 `apis` 不读取文档、不清空旧输出。
- 文档读取或筛选失败不更新任何服务；先暂存所有生成结果，再逐个替换对应目录，单目录替换失败尝试恢复，不保证跨服务事务。成功后会移除该目录上次未再选择的函数，不能在生成目录中保留手写适配。
- `OPENAPI_SCHEMA_PATH` 只允许在恰好一个服务启用时覆盖文档来源。当前不使用 `.umirc.ts` 的 `openAPI` 配置；具体配置和测试命令见 README，不因普通页面或文档任务擅自访问内网或重新生成。
- 新手写业务接口可以放在独立业务目录，用 `types.ts` 显式导出类型。
- 对生成响应做业务适配时，放在外层手写模块，不给生成文件增加 UI 副作用。

### 4.2 请求分层

```text
页面/表单
  → 调用 model / 实例 Hook 的业务动作；简单请求可直接由 ProTable request 编排
  → model / 实例 Hook 调用 service 并管理归属于自己的状态
  → service 用 request 描述 HTTP 协议
  → 后端处理身份、权限、业务规则
  → service 返回真实协议结果，model / Hook 完成业务结果处理
  → 页面或约定的统一错误层给用户反馈
```

- GET 的关键词、页码等放 `params`。
- POST/PUT/PATCH 的 JSON 正文放 `data`，不是 `body: JSON.stringify(...)` 的 fetch 写法。
- 路径参数先验证必需值，再插入路径；不要用 `id || ''` 悄悄构造错误 URL。
- 复杂路径参数按后端约定进行编码；不要把未经处理的输入拼成任意路径片段。
- 函数名表达业务动作，如 `queryUsers`、`createUser`、`updateUser`，不要把所有调用都做成 `doRequest`。
- 错误码、空值、可选字段以真实协议为准，不自行发明后端不返回的字段。

### 4.3 两类失败

| 类型 | 示例 | 处理方式 |
| --- | --- | --- |
| HTTP/网络失败 | 超时、断网、401、403、500 | 按项目统一请求策略处理身份失效和网络错误 |
| 业务失败 | HTTP 200，但 `success: false` | 按后端错误协议判断，不能直接提示成功 |

若 service 返回包含 `success` 的响应，页面拿到 Promise resolve 并不等于保存成功。决定错误提示放在哪一层后避免重复提示，同时确保 loading 在失败路径也被解除。

### 4.4 类型的边界

- 列表项、创建 DTO、更新 DTO 可以不同，不用一个全可选类型承担所有场景。
- 页面 Props、表单值和 API DTO 分开建模，提交时明确映射。
- ID 的字符串/数字类型前后一致；不要利用非空断言或强制类型转换掩盖未取到 ID。
- 不对外部 JSON 只做一次 `as` 就声称已经验证结构；需要运行时校验时在系统边界实现。
- 不为了预防所有未知情况到处增加 fallback；先确定协议，缺字段导致的错误要能暴露。

## 5. ProTable 列表规范

### 5.1 三种列类型不要混用

- 表格列优先使用 `ProColumns<Row>`。
- 详情描述列使用 `ProDescriptionsItemProps<Row>`。
- 表单值使用自己的明确类型；若表格与详情复用字段配置，应保证类型与行为真正兼容。

当前 Table 模板将描述列类型复用到表格中，不能据此认定是所有新页面的推荐模式。

### 5.2 请求适配

ProTable 服务端分页的核心结果形状：

```ts
type TablePage<Row> = {
  data: Row[];
  success: boolean;
  total: number;
};
```

对接时逐项确认：

| ProTable 数据 | 后端映射要求                                          |
| ------------- | ----------------------------------------------------- |
| `current`     | 后端若使用从 0 开始的 page index，需要明确转换        |
| `pageSize`    | 与后端 size/limit 对应，遵守允许范围                  |
| 搜索字段      | 只传协议支持的字段；空值语义与后端一致                |
| sorter        | 映射列名和 ascend/descend，不直接丢给未声明支持的接口 |
| filter        | 按后端接受的数组、枚举或字符串格式转换                |
| `data`        | 列表记录，不是整个分页包装对象                        |
| `success`     | 真实业务成功状态                                      |
| `total`       | 全部匹配记录数量，不是这一页的 `list.length`          |

如果后端根本没有分页，明确使用不分页或前端分页方案；不要给服务端分页表格伪造总数。

### 5.3 刷新、选择与删除

- `actionRef.current?.reload()` 用于保存成功后的刷新；是否重置页码与筛选由用户操作语义决定。
- 表格删除最后一页最后一项后，验证分页是否回到有效页。
- 多选状态与真实删除成功结果保持一致，失败不能无条件清空并显示成功。
- 批量接口存在时传全部 ID；只有单条接口时要确认是否允许循环调用、如何处理部分失败，不擅自假装原子批量操作。
- 删除按钮应有确认与提交中状态，避免重复触发。
- 查看详情的点击入口需要真实更新当前行或请求详情；仅渲染一个永远关闭的 Drawer 不算完成。

## 6. 表单与弹窗

### 6.1 新增与编辑

- 新增默认值来自明确业务规则，不用上一条编辑记录的残留值。
- 编辑从当前记录或详情接口回填，明确 ID 保存在父页面还是表单字段中。
- 对“切换记录、取消后重开、提交失败重试”逐项验证，不假设 `initialValues` 会自动响应每次 Props 更新。
- 表单验证只是用户体验，后端仍要验证字段和权限。
- 请求失败保留输入；成功才提示、关闭并刷新列表。

### 6.2 使用组件约定

- 已有简单包装能满足时使用现有组件，不为每种弹窗再加多层转发。
- ProForm `onFinish`、StepsForm `onFinish` 和普通回调的返回语义以实际组件版本为准，不能只看名称假设一致。
- 校验 modal 销毁/隐藏行为，使用当前版本支持的 API；不要从不同 Ant Design 主版本混抄 Props。
- 日期组件的对象值需要按后端协议转换后提交，不把日期库对象直接当作规范 JSON 字符串。
- 异步操作的 loading 在成功和失败路径都结束；不在请求尚未完成时关闭页面造成假成功。

## 7. 初始化、权限与共享状态

### 7.1 初始化状态链路

```text
src/app.ts:getInitialState
  → @@initialState
  → src/access.ts 计算权限
  → 路由 access / 页面 useAccess / Access 控制展示
```

当前 `getInitialState` 返回的只是模板名称。若接入真实当前用户：

1. 明确初始化状态类型，统一 app、access 和消费方的结构。
2. 按真实登录协议加载当前用户和权限。
3. 区分未登录、无权限、接口不可用，不把所有异常解释成“没有权限”。
4. 登录/退出后按框架能力更新或刷新初始化状态，避免菜单权限使用旧数据。
5. 后端对每个请求独立校验，不相信浏览器传来的角色或权限标记。

这些是新增认证能力时的流程，不表示当前仓库已经实现。

### 7.2 选择状态与数据逻辑的位置

| 场景 | 优先位置 | 消费方式 |
| --- | --- | --- |
| 复杂页面：关联筛选、请求编排、派生数据、批量操作 | `src/pages/<Page>/model.ts` | `useModel('<Page>.model')`，默认按路径命名 |
| 页面内有多个独立业务子域 | `src/pages/<Page>/models/<domain>.ts` | `useModel('<Page>.<domain>')`，避免模型互相循环依赖 |
| 多页面共享同一份业务状态 | `src/models/<domain>.ts` | `useModel('<domain>')` |
| 业务组件确实要共享状态 | 使用已注册的对应领域 model，或显式注册的组件 model | 由业务容器消费 model，展示组件优先接收 Props |
| 复杂组件的每个实例都需要独立状态 | 未注册的 `src/components/<Component>/model.ts`；页面私有组件用 `<Component>/useXxxModel.ts` 避开自动扫描 | 直接导入并调用本地 Hook，每次调用独立，不使用共享 useModel |
| 简单且独立的开关、输入或展示 | 组件局部 `useState` / 表单实例 | 不强制创建 model |
| 应随 URL 保留的筛选条件 | 路由 query 与负责该流程的 model/页面 | 明确谁是来源，避免双向 effect 循环 |
| 当前用户、权限初始化信息 | `@@initialState` | 不再复制到另一份用户 model |
| 简单列表的记录与 loading | ProTable request | 不重复在 model 保存同样的数据 |
| 固定枚举与纯格式计算 | constants / utils 或 model 的直接派生值 | 不用 effect 同步本可直接计算的数据 |

抽离依据是逻辑复杂度和状态归属，不是一定要跨组件复用，也不是等到页面超过 300 行才处理；本项目采用“复杂页面优先页面 model”的约定，但不为纯展示页面建立空 model。

### 7.3 model 发现规则与命名空间

以下已按当前安装的 Umi 插件实现核对，未来升级后重新验证：

| 文件路径 | 是否默认自动发现 | 默认 useModel 名称 |
| --- | --- | --- |
| `src/models/global.ts` | 是 | `global` |
| `src/pages/Table/model.ts` | 是 | `Table.model` |
| `src/pages/Table/models/query.ts` | 是 | `Table.query` |
| `src/pages/Table/components/Editor/model.ts` | 是，因为位于 pages 扫描树内 | `Table.components.Editor.model` |
| `src/components/Editor/model.ts` | 否 | 未注册，不能直接猜名称使用 |
| `src/pages/Table/components/Editor/useEditorModel.ts` | 否，且不在 models 目录内 | 作为普通 Hook 直接导入 |

- 扫描范围是 `src/models/**/*`、`src/pages/**/models/**/*`、`src/pages/**/model.*` 中支持的 `.ts/.tsx/.js/.jsx` 文件，声明/测试文件会被排除。
- 注册 model 需要默认导出有效的 Hook 函数；类型文件、常量、辅助实现尽量放在扫描目录外，不依赖 AST 识别结果来侥幸避开注册。
- 默认命名空间由相对路径去掉 pages/models 等保留目录后推导，保留业务目录的大小写；函数名不决定 useModel 的名称。
- 显式 `extraModels`、`preferSourceNamespace` 等配置会影响注册/名称，先看当前配置与 `src/.umi/plugin-model/model.ts` 和类型；此生成文件只读。
- 新命名空间不能与现有模型重复；不要创建同名全局与页面模型后用类型断言绕过冲突。
- 组件实例 Hook 放在组件旁，避免命名为 `pages/**/model.ts` 或放进 `models/` 后意外变成共享模型。
- 不把自动注册 model 的默认 Hook 直接 import 后再调用来“隔离实例”，否则 Provider 已执行一份、调用方又执行一份，可能产生双份状态和请求。

### 7.4 model 层允许与禁止的内容

**允许：**

- 通过 React Hook 管理本业务状态、loading/error、筛选条件、选中记录和流程状态。
- 调用 service 完成请求编排、字段转换、保存/删除等业务动作，处理业务结果并提供明确返回值。
- 提供 UI 所需的派生值、动作和必要数据；简单派生值直接计算，昂贵计算确有必要时才缓存。
- 提供 `load`、`save`、`remove`、`reset` 等有业务语义的动作；复杂状态变更优先封装动作而不是向所有消费者暴露内部结构。

**禁止：**

- JSX、表格列的 render、Modal 确认框、页面跳转、依赖 DOM 的视图引用，以及导入页面/组件制造反向依赖。
- 直接拼写 HTTP 请求协议绕过 service；把全站无关业务塞进一个页面 model。
- 同时维护互相同步的多份列表、表单或当前用户状态；只为复制派生值而增加 useEffect。
- 在 model 与页面分别弹同一条错误提示；默认由 UI/既定统一错误层负责提示。
- 无条件执行所有页面请求、多个 useModel 消费者各自重复初始化或在卸载时互相 reset。

页面保留渲染、列配置、确认交互与视图引用；model 处理复杂数据流程；service 处理 HTTP 协议；这是职责分离，不要求通过逐层转发制造没有价值的空函数。

model 和实例 Hook 都参考 200 行体量评估线。多个独立业务流程可拆成页面 `models/` 或纯辅助模块，但不能把同一事务随意切开导致状态循环依赖；拆出的实例 Hook 必须具备清晰参数和返回值，而不是整页代码换个文件存放。

### 7.5 页面 model 与消费示例

下面仅演示组织方式，不表示这些文件已经创建；请求动作按实际 service 协议补齐，不虚构接口。

`src/pages/UserManagement/model.ts`：

```ts
import { useCallback, useState } from 'react';

export default function useUserManagementModel() {
  const [keyword, setKeyword] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const reset = useCallback(() => {
    setKeyword('');
    setSelectedIds([]);
  }, []);

  return {
    keyword,
    setKeyword,
    selectedIds,
    setSelectedIds,
    canDelete: selectedIds.length > 0,
    reset,
  };
}
```

页面或业务容器通过 Umi 消费，不直接调用上面的默认 Hook：

```ts
import { useModel } from '@umijs/max';

export function useUserManagementFilters() {
  return useModel('UserManagement.model', (model) => ({
    keyword: model.keyword,
    setKeyword: model.setKeyword,
  }));
}
```

上面的 `useModel` 必须放在 React 组件或自定义 Hook 的顶层，不能在模块顶层、条件分支、事件处理器中调用；selector 只挑选消费方需要的值，不在 selector 中执行请求或 setState。另一个消费者可以只选择 `canDelete`，避免为无关数据订阅整个模型。

实例隔离场景则使用 `import { useUserEditorModel } from './useUserEditorModel'` 后在组件顶层调用 `useUserEditorModel(recordId)`，每个组件实例各自持有状态；仅复用逻辑，不共享数据，文件需要实际导出该 Hook 才能使用。

### 7.6 生命周期、加载与重置

- 在当前生成结构中，注册模型由应用级 Provider 的 Executor 执行；即使文件位于某个页面目录，它也不是自动路由作用域的 Provider。
- 放进 model 的挂载 effect 或自动运行请求可能在页面未打开时就执行；页面 model 默认暴露加载动作，由明确的路由进入点/用户动作触发，或采用已核实的手动请求模式。
- 同一 namespace 的消费者共享同一份结果，不因调用两次 useModel 变成两个独立实例；不应在每个消费组件都发起同一初始化请求。
- 进入页面时明确策略：保留筛选/缓存，还是由页面所有者重置；离页不默认销毁模型。不可在任意子组件卸载时无条件清空共享状态。
- reset 必须清理同一流程的相关状态，并防止旧请求在 reset 后回写；输入快速变化、记录切换、重试等场景按实际需要使用取消或请求标识处理竞态。
- 若用 effect 触发 load/reset，相关动作依赖应稳定，明确何时运行和清理；不能遗漏依赖，也不能靠禁用 Hook lint 掩盖重复请求。
- 身份退出/切换时按真实需求清理相关业务缓存，避免上一身份的数据继续显示；不把安全边界交给前端缓存判断。

### 7.7 与 ProTable、表单的协作

- 简单表格由 ProTable request 管理数据与 loading；model 可以提供查询条件和业务动作，不再额外保存一份相同列表。
- 复杂表格可以让 ProTable 的 request 调用 model 的查询动作，由动作负责参数映射/业务编排并返回表格结果；仍由 ProTable 持有列表，model 不重复镜像。
- 若选择由 model 完全持有 records/loading/pagination，则使用受控表格数据，不再保留另一条独立 request 数据链；二者择一。
- Form 实例可继续持有输入值；model 保存明确需要的业务流程状态，避免表单每次输入又 effect 同步到第二份 model 草稿。
- 多个编辑器同时打开且输入相互独立时，使用实例 Hook 或局部表单；不能仅靠共享模型的一个 currentId 覆盖所有实例。
- 验证保存成功后刷新、失败保留输入、取消后重开、返回页面的状态策略，以及两个组件实例同时存在时是否串状态。

## 8. Mock 的正确使用

补 Mock 前先对齐 service 的路径和类型，不以“页面不报错”为唯一目标：

- HTTP 方法和动态路径参数一致，例如 `PUT /api/v1/user/:userId`。
- ID、枚举与 TypeScript 接口一致；当前模板中的数字 ID/字符串 ID 差异不能继续扩散。
- 列表实现分页时返回真实过滤后总数，再按页切片。
- 新增、修改、删除若展示成功，应真实改变开发用内存数据，或者明确告知这是仅响应示例。
- 覆盖业务失败、空列表、找不到记录；不要给所有调用无条件返回成功。
- 重启开发服务后内存数据重置是正常现象，不把它当成持久化数据库。
- 对接后端时确认请求命中的是 Mock 还是代理目标；当前 `.umirc.ts` 没有配置业务代理。
- 开发代理/Mock 不会自动跟随 dist 部署，生产 API 地址、跨域、认证和网关需要独立验证。

## 9. 样式与可访问性

- 页面优先 `PageContainer`，表单和表格优先现有 Ant Design/Pro Components。
- 局部样式通过 Less Modules 引用；`src/assets` 通过 import 引入静态资源。
- 对纯操作使用按钮或语义清晰的操作组件；内部导航使用 Link，不用 `<a href="">` 占位。
- 必填提示、错误提示与字段关联；不能只用颜色表达成功、失败或权限状态。
- 图标按钮提供可识别名称，表单支持键盘操作，弹窗关闭后关注焦点是否合理。
- 页面在常见窗口宽度下没有关键按钮溢出、表格不可访问或弹窗内容被截断。
- 未经明确需求不引入图表库、额外状态管理库或新的 CSS 框架。

## 10. 常见问题排查

| 现象 | 先查 | 不要直接做 |
| --- | --- | --- |
| `ERR_PNPM_IGNORED_BUILDS` | workspace 的 allowBuilds、pnpm 版本、脚本源码 | 认定是内网限制、删除锁文件、放行全部脚本 |
| 找不到 `src/.umi/tsconfig.json` | 安装后 max setup 是否成功 | 手写生成文件 |
| 新页面 404/菜单没有出现 | routes、component 相对路径、大小写、权限、开发服务是否更新 | 假设 pages 目录自动注册 |
| `useModel` 找不到模型 | model 插件、文件默认导出、模型文件名、生成结果 | 直接改 plugin-model 生成代码 |
| 按钮/菜单不显示 | 初始化状态、权限键是否存在、路由 access、具体布尔结果 | 前端写死管理员绕过 |
| 请求 404 | 实际 URL、HTTP 方法、Mock 动态路由、代理和环境 | 只改 TypeScript 类型 |
| 修改/删除找不到记录 | 记录 ID 来源、字段类型、路径插值 | 用空字符串掩盖 ID 丢失 |
| 分页只有一页 | data/total/current/pageSize 映射、Mock 是否返回总数 | 把当前页 length 当总数 |
| 保存后仍是旧数据 | 业务是否真正成功、列表刷新、Mock 是否更新数据 | 无条件强制刷新整个页面 |
| 编辑显示上一次的记录 | initialValues、表单实例、重置时机、记录切换 | 无依据堆叠 setTimeout |
| Windows 可用，Linux 构建失败 | 路径大小写、文件是否提交、依赖是否直接声明 | 修改 CI 跳过失败步骤 |
| 构建通过但刷新子路径 404 | 部署服务器对 SPA history 路由的回退 | 在生成 route 文件里改路径 |
| 浏览器请求跨域失败 | API origin、开发代理、后端 CORS、凭证策略 | 在前端加入无效的服务端 CORS 响应头 |

## 11. 交付检查清单

### 所有代码改动

- 修改范围与需求一致，没有额外格式化全仓库或改动依赖版本。
- 按 [逐文件说明](project-files.md) 第 13 节核对本次文件允许/禁止内容、依赖方向和体量评估线；超线时说明是否需要按职责拆分，不为达标机械切文件。
- 文件内容归属和体量目前由开发/审查检查，未自动接入 lint/CI；不把文档建议描述成已生效的技术阻断。
- 新增导入来自已声明/明确可用的依赖，路径大小写与真实文件一致。
- 新组件按 `<Component>/index.tsx`、按需 `index.less`、`model.ts` 组织，没有多个组件平铺或无必要的转导出入口；实例 Hook 在同一组件目录内且不会意外注册。
- 移动组件已同步导入、样式、资源、测试和 model 命名空间，没有为凑结构创建空文件。
- 没有把生成文件、凭证或本机状态当作业务源码修改。
- 按范围运行类型、lint、构建；失败时说明错误是否原有，不虚报通过。

### 页面/表单改动

- 路由、菜单、权限、加载、空数据、错误提示都经过实际验证。
- 新增、编辑、取消、重开、重复提交行为正确。
- 复杂页面的数据逻辑已按职责抽到 model，需实例隔离的组件使用本地 Hook；模型名称与当前注册结果一致。
- 验证进入/离开/重进页面、两个消费者共享、两个组件实例隔离、旧请求回写与 reset 行为，没有重复请求或双份数据源。
- 列表分页/筛选/排序符合协议，保存后刷新，删除覆盖部分失败场景。
- 控制台与 Network 中没有新错误；无法启动或没有浏览器能力时明确说明未完成 UI 验证。

### Skill/文档改动

- frontmatter 的 name、description 清晰，引用的 Markdown 文件真实存在。
- 逐文件说明与当前仓库相符，可选目录没有写成已经存在。
- 示例没有冒充已实现接口、登录、测试框架或部署能力。
- 检查本次 Markdown 的格式及相对链接，不因此顺手修改页面、配置或权限。
