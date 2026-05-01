<!-- 中文 --> [English](README.md) | **简体中文**

# @piying/valibot-visit

基于 [Valibot](https://github.com/fabian-hiller/valibot) 的 Schema 遍历与转换工具库。

提供了一套灵活的管道式 API，用于解析、遍历和转换 Valibot 验证 Schema，支持条件渲染、环境感知、虚拟分组等高级特性，适用于表单验证、API 校验、UI 动态生成等场景。

## ✨ 特性

- **Schema 遍历转换** — 将 Valibot Schema 深度解析为结构化数据
- **环境感知** — 支持基于环境的条件字段展示与配置
- **虚拟分组** — 支持 Intersect/Union/Variant 等组合类型的虚拟分组处理
- **可扩展 Handle** — 通过继承 `BaseSchemaHandle` 自定义处理逻辑
- **类型安全** — 完整的 TypeScript 类型支持
- **默认值提取** — 自动提取 Schema 中的默认值

## 📦 安装

```bash
npm install @piying/valibot-visit valibot
```

## 🚀 快速开始

### 基础用法

```typescript
import { convertCore } from '@piying/valibot-visit';
import { BaseSchemaHandle } from '@piying/valibot-visit';
import * as v from 'valibot';

class MyHandle extends BaseSchemaHandle<any> {}

const schema = v.pipe(
  v.string(),
  v.title('用户名'),
  v.description('请输入用户名'),
  v.metadata({ order: 1 }),
);

const result = convertCore(
  schema,
  (handle) => {
    return handle.props;
  },
  {
    handle: MyHandle,
  },
);

console.log(result);
// { title: '用户名', description: '请输入用户名', metadata: { order: 1 } }
```

### 自定义 Handle

继承 `BaseSchemaHandle` 可以实现自定义的字段配置生成逻辑：

```typescript
class FormHandle extends BaseSchemaHandle<any> {
  objectSchema(schema: v.ObjectSchema) {
    super.objectSchema(schema);
    // 自定义对象类型处理
  }

  stringSchema(schema: v.StringSchema) {
    super.stringSchema(schema);
    // 自定义字符串类型处理
  }
}
```

### 条件渲染（环境感知）

使用 `condition` 元数据实现基于环境的条件字段：

```typescript
import { condition } from '@piying/valibot-visit';

const schema = v.pipe(
  v.string(),
  condition({
    environments: ['admin', 'default'],
    actions: [v.title('管理员名称')],
  }),
);

// 仅在 admin 或 default 环境中展示
const result = convertCore(schema, (handle) => handle.props, {
  handle: FormHandle,
  environments: ['admin'],
});
```

### 虚拟分组

使用 `asVirtualGroup` 标记组合类型为虚拟分组：

```typescript
import { asVirtualGroup } from '@piying/valibot-visit';

const schema = v.pipe(v.object({ name: v.string() }), asVirtualGroup());
```

### 原始配置

使用 `rawConfig` 注入自定义配置函数：

```typescript
import { rawConfig } from '@piying/valibot-visit';

const schema = v.pipe(
  v.string(),
  rawConfig('myField', (field) => {
    field.config.customProp = 'custom value';
  }),
);
```

### Schema 工具集

库提供了 `schema` 命名空间导出，包含相交类型等高级 Schema 构造器：

```typescript
import { schema } from '@piying/valibot-visit';

const intersectSchema = schema.intersect([
  v.object({ k1: v.number() }),
  v.optional(v.object({ k2: v.number() })),
]);
```

## 📖 API 参考

### 核心函数

#### `convertCore(schema, fn, options)`

遍历 Valibot Schema 并通过自定义 Handle 进行转换。

| 参数      | 类型                    | 说明                   |
| --------- | ----------------------- | ---------------------- |
| `schema`  | `BaseSchema`            | Valibot Schema 或 Pipe |
| `fn`      | `(handle: Handle) => T` | 转换完成后的回调函数   |
| `options` | `ConvertOptions`        | 配置选项               |

#### `getDefaults(schema)`

从 Schema 中提取所有字段的默认值，递归处理对象和数组。

```typescript
import { getDefaults } from '@piying/valibot-visit';

const schema = v.object({
  name: v.optional(v.string(), 'default'),
  age: v.number(),
});

console.log(getDefaults(schema));
// { name: 'default' }
```

### 元数据操作（Actions）

| Action                          | 说明                                  |
| ------------------------------- | ------------------------------------- |
| `condition(value)`              | 条件元数据，根据环境决定是否生效      |
| `asControl(value?)`             | 标记字段是否作为独立控件（默认 true） |
| `asVirtualGroup(value?)`        | 标记组合类型为虚拟分组                |
| `defineType(value)`             | 定义自定义类型名称                    |
| `rawConfig(type, fn?, workOn?)` | 注入原始配置函数                      |
| `metadataList(value)`           | 批量元数据列表                        |

### Handle 生命周期钩子

`BaseSchemaHandle` 提供以下可重写的方法：

| 方法                       | 说明                                 |
| -------------------------- | ------------------------------------ |
| `begin(schema)`            | 遍历开始时调用                       |
| `initMetadata()`           | 初始化元数据                         |
| `metadata(item, target?)`  | 处理元数据                           |
| `validation(item)`         | 处理校验规则                         |
| `transformation(item)`     | 处理转换规则                         |
| `wrappedSchema(schema)`    | 处理包装类型（optional/nullable 等） |
| `beforeSchemaType(schema)` | 在识别 Schema 类型前调用             |
| `lazySchema(schema)`       | 处理 Lazy 类型                       |
| `arraySchema(schema)`      | 处理数组类型                         |
| `tupleSchema(schema)`      | 处理元组类型                         |
| `objectSchema(schema)`     | 处理对象类型                         |
| `recordSchema(schema)`     | 处理 Record 类型                     |
| `variantSchema(schema)`    | 处理 Variant 类型                    |
| `unionSchema(schema)`      | 处理 Union 类型                      |
| `intersectSchema(schema)`  | 处理 Intersect 类型                  |

## 🧪 开发

```bash
# 运行测试
npm test

# 生成覆盖率报告
npm run coverage

# 构建
npm run build

# 代码检查与格式化
npm run lint
```
