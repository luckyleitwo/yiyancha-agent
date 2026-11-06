# README

`@umijs/max` 模板项目，更多功能参考 [Umi Max 简介](https://umijs.org/docs/max/introduce)

## 导出 Excel

浏览器中可使用 `@/utils/exportExcel` 导出 `.xlsx`。调用方负责获取需要导出的完整数据、处理加载状态及错误提示：

```ts
import { exportExcel } from '@/utils/exportExcel';

const users = [{ name: '张三', phone: '13800000000', count: 0 }];

await exportExcel({
  fileName: '用户列表', // 可包含或省略 .xlsx
  sheetName: '用户', // 可省略，默认为 Sheet1
  columns: [
    { header: '姓名', value: (row) => row.name, width: 20 },
    { header: '手机号', value: (row) => row.phone, width: 20 },
    { header: '数量', value: (row) => row.count, numFmt: '0' },
  ],
  data: users,
});
```

列的 `value` 支持返回字符串、数字、布尔值、日期或空值；需要自定义展示的枚举等字段可在 `value` 中转换。字符串按文本写入，不会作为公式执行。工具不负责请求数据；分页列表如需导出全部记录，应先获取全部符合条件的数据。数据量较大时建议由后端生成文件。

## 多后端、按需生成接口

### 1. 配置后端和接口

在 `config/service.ts` 的外层数组中，每个对象对应一个后端服务。当前配置：

```ts
const services: ServiceConfig[] = [
  {
    name: 'yiyancha',
    proxyTarget:
      process.env.UMI_APP_YIYANCHA_DEV_PROXY_TARGET ||
      'http://192.168.1.219:8080',
    environments: {
      test: process.env.UMI_APP_YIYANCHA_TEST_URL ?? '',
      production: process.env.UMI_APP_YIYANCHA_PROD_URL ?? '',
    },
    schemaPath: 'http://192.168.1.219:8080/v3/api-docs',
    pathPrefix: '/api/v1',
    namespace: 'YiyanchaAPI',
    apis: ['auth/login', 'auth/logout', 'auth/me', 'catalog/dashboard'],
  },
];
```

| 字段 | 作用 |
| --- | --- |
| `name` | 生成目录名和请求的服务标识，例如 `yiyancha`；服务间不能重复 |
| `proxyTarget` | 本地开发代理目标，代理路径由 `name` 自动生成；开发时必填 |
| `environments` | 测试和正式环境的公开请求地址；空字符串或省略表示同源 |
| `schemaPath` | Swagger / OpenAPI JSON 地址或本地 JSON 文件路径，与实际请求地址独立 |
| `pathPrefix` | 为 `apis` 补全公共路径，并决定文件分组的起点；可留空。不会再次添加到文档的原始请求路径 |
| `namespace` | 独立的类型命名空间，例如 `YiyanchaAPI`；以大写字母开头，各服务不能重复，也不能使用 demo 的 `API` |
| `apis` | 需要生成的接口路径白名单，不再填写 `operationId` |

增加后端时，在外层数组追加同样结构的对象，例如另一个服务使用独立的 `name: 'order'`、`namespace: 'OrderAPI'`，并填写实际的文档地址和开发代理目标。在同一个服务对象的 `environments` 中配置测试和正式环境地址。每个后端仅更新自己的目录，允许拥有相同的接口路径和函数名。

### 2. 选择接口

当 `pathPrefix` 为 `/api/v1`：

```ts
apis: [
  'auth/logout', // 精确匹配 /api/v1/auth/logout
  { path: 'users', method: 'GET' },
  { path: 'users', method: 'POST' },
];
```

- 字符串路径只能对应一个 HTTP 方法。同一路径存在多个方法时，必须使用 `{ path, method }` 明确选择。
- 路径参数按文档填写，例如 `users/{userId}`；不要填具体 ID 或查询参数。
- 接口按路径和方法精确匹配，不使用后缀模糊匹配。函数名仍来自文档的 `operationId`。
- **生成文件名按路径分组，而不是按 Swagger 的 tags 分组**：取 `pathPrefix` 后的第一级路径。`/api/v1/auth/login` 和 `/api/v1/auth/logout` 均写入 `src/services/yiyancha/auth.ts`，`index.ts` 导出 `auth`。例如 `users/{userId}` 写入 `users.ts`。
- 分组名需以英文字母开头，可包含英文字母、数字，以及分隔单词的 `-` 或 `_`；`index`、`typings` 等保留文件名不可作为分组，同名归一化后冲突会报错。`pathPrefix` 为空时，完整路径的第一级即分组名。
- 支持 GET、POST、PUT、PATCH、DELETE，选择其他 HTTP 方法会报错。
- 外层空数组、或服务的 `apis: []`：跳过生成，不访问对应文档，也不清空已有目录。
- 路径不存在、方法不匹配、重复选择或所选 `operationId` 重复时会报错。

### 3. 执行生成

```bash
pnpm openapi:service
```

`pnpm openapi` 是同一命令的别名，不绕过白名单。生成入口是 `scripts/openapi.ts`，使用独立的 `@umijs/openapi`，不依赖 `max openapi` 或 `.umirc.ts` 的 `openAPI` 字段。

先读取并筛选所有启用服务的文档，再暂存生成结果；文档读取或筛选失败不会更新任何已有服务目录。成功后逐个替换对应服务目录；替换单个目录失败时尝试恢复该目录，不承诺多个目录替换的跨服务事务。

**成功生成会重建对应的服务目录，移除上次生成但本次未选中的请求函数。不要在生成目录中手写代码。** 共享协议类型保留，避免嵌套引用缺失；业务适配放在生成目录之外。

移除某项服务配置不会自动删除它过去的输出目录。原有 `src/services/backend/` 和 `src/services/demo/` 也不会被新配置自动删除或覆盖。

### 4. 使用生成的接口

```ts
import { login, logout } from '@/services/yiyancha/auth';
```

生成请求保留文档中的 `/api/v1/auth/login`，并将服务名通过 `src/services/request.ts` 交给 `src/app.ts` 请求拦截器。拦截器按环境及服务名选择 `baseURL`；调用方显式提供 `baseURL` 时优先使用调用方的值。响应拦截器目前原样返回，不修改业务数据或统一弹错。生成过程只读取文档，不调用业务接口。

### 请求环境与代理

请求和代理地址均在 `config/service.ts` 按服务配置；`src/constants/api.ts` 只接收构建时生成的公开地址映射，不需要再为每个服务手写配置。当前服务支持以下环境变量：

| 变量 | 含义 |
| --- | --- |
| `UMI_APP_YIYANCHA_DEV_PROXY_TARGET` | 可选，本地开发代理目标；不设置时使用服务配置中的默认地址 |
| `UMI_APP_YIYANCHA_TEST_URL` | 测试环境后端地址，空字符串表示同源 |
| `UMI_APP_YIYANCHA_PROD_URL` | 正式环境后端地址，空字符串表示同源 |

| 命令 | 环境 | 请求方式 |
| --- | --- | --- |
| `pnpm dev` | 开发 | 浏览器请求 `/yiyancha/api/...`，Umi 去掉 `/yiyancha` 后转发至 `proxyTarget` |
| `pnpm build:test` | 测试 | 使用测试地址；为空时走当前站点的 `/api/...` |
| `pnpm build:prod` 或 `pnpm build` | 正式 | 使用正式地址；为空时走当前站点的 `/api/...` |

开发模式优先使用代理，即使指定 `UMI_APP_ENV=test` 也不会直接请求测试地址。开发时代理目标必须是有效的 HTTP(S) 地址；未知的非空 `UMI_APP_ENV` 会报错，避免静默回退到正式环境。服务地址支持 HTTP(S) URL 或空字符串，不允许嵌入认证信息、查询参数或片段。调用方显式传入 `baseURL`（包括空字符串）时仍优先使用调用方设置。

Umi 4.7.29 先读取进程环境，再加载根目录 `.env`、`.env.local`，后加载的文件值会覆盖同名值；`.env.local` 不提交，可用于本机覆盖。上述地址在构建时确定，变更后需重启开发服务或重新构建，不能存放密钥。直连跨域时需服务端允许 CORS，HTTPS 页面不能直接访问不安全的 HTTP 接口；同源模式要求部署站点配置 API 网关。Umi 开发代理不会随构建产物部署。

不带服务标识的请求（例如现有 `/api/state` 等 Mock 路径）继续使用原来的同源路径，不会被自动转发到上述后端。

### 5. 本地文档与环境变量

可以直接把各服务的 `schemaPath` 设置为本地 JSON 文件路径；相对路径基于执行命令的工作目录。

兼容保留 `OPENAPI_SCHEMA_PATH` 环境变量，但它只能在恰好一个服务的 `apis` 非空时覆盖该服务的文档来源。多个服务启用时使用这个变量会报错，应分别配置各服务的 `schemaPath`。

Git Bash / Linux / macOS：

```bash
OPENAPI_SCHEMA_PATH=./openapi.json pnpm openapi:service
```

PowerShell：

```powershell
$env:OPENAPI_SCHEMA_PATH = './openapi.json'
pnpm openapi:service
```

## 路由配置

路由数组维护在 `config/router.ts`，由 `.umirc.ts` 导入；其他 Umi 配置保留在 `.umirc.ts`。

## 生成逻辑测试

```bash
pnpm exec tsx --test scripts/api-environments.test.ts scripts/openapi-select.test.ts scripts/openapi-generate.test.ts tests/service-runtime.test.ts
```

测试包含环境地址、代理配置、统一请求入口、路径筛选、配置校验、多后端隔离、重新生成和失败保护，不调用真实业务接口。
