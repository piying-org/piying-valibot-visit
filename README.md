**English** | [中文](README.zh-CN.md)

# @piying/valibot-visit

A Schema traversal and transformation utility library based on [Valibot](https://github.com/fabian-hiller/valibot).

Provides a flexible pipe-based API for parsing, traversing, and transforming Valibot validation Schemas, supporting advanced features such as conditional rendering, environment awareness, and virtual grouping. Suitable for form validation, API verification, dynamic UI generation, and other scenarios.

## ✨ Features

- **Schema Traversal & Transformation** — Deeply parses Valibot Schemas into structured data
- **Environment Awareness** — Supports conditionally displaying fields and configurations based on environment
- **Virtual Grouping** — Supports virtual grouping for combination types like Intersect/Union/Variant
- **Extensible Handle** — Customize processing logic by extending `BaseSchemaHandle`
- **Type Safe** — Full TypeScript type support
- **Default Value Extraction** — Automatically extracts default values from Schemas

## 📦 Installation

```bash
npm install @piying/valibot-visit valibot
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { convertCore } from '@piying/valibot-visit';
import { BaseSchemaHandle } from '@piying/valibot-visit';
import * as v from 'valibot';

class MyHandle extends BaseSchemaHandle<any> {}

const schema = v.pipe(
  v.string(),
  v.title('Username'),
  v.description('Please enter your username'),
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
// { title: 'Username', description: 'Please enter your username', metadata: { order: 1 } }
```

### Custom Handle

Extending `BaseSchemaHandle` allows you to implement custom field configuration generation logic:

```typescript
class FormHandle extends BaseSchemaHandle<any> {
  objectSchema(schema: v.ObjectSchema) {
    super.objectSchema(schema);
    // Custom object type handling
  }

  stringSchema(schema: v.StringSchema) {
    super.stringSchema(schema);
    // Custom string type handling
  }
}
```

### Conditional Rendering (Environment Awareness)

Use `condition` metadata to implement environment-based conditional fields:

```typescript
import { condition } from '@piying/valibot-visit';

const schema = v.pipe(
  v.string(),
  condition({
    environments: ['admin', 'default'],
    actions: [v.title('Admin Name')],
  }),
);

// Only displayed in admin or default environments
const result = convertCore(schema, (handle) => handle.props, {
  handle: FormHandle,
  environments: ['admin'],
});
```

### Virtual Grouping

Use `asVirtualGroup` to mark combination types as virtual groups:

```typescript
import { asVirtualGroup } from '@piying/valibot-visit';

const schema = v.pipe(v.object({ name: v.string() }), asVirtualGroup());
```

### Raw Configuration

Use `rawConfig` to inject custom configuration functions:

```typescript
import { rawConfig } from '@piying/valibot-visit';

const schema = v.pipe(
  v.string(),
  rawConfig('myField', (field) => {
    field.config.customProp = 'custom value';
  }),
);
```

### Schema Utilities

The library provides a `schema` namespace export containing advanced Schema constructors such as intersect:

```typescript
import { schema } from '@piying/valibot-visit';

const intersectSchema = schema.intersect([
  v.object({ k1: v.number() }),
  v.optional(v.object({ k2: v.number() })),
]);
```

## 📖 API Reference

### Core Functions

#### `convertCore(schema, fn, options)`

Traverses a Valibot Schema and transforms it through a custom Handle.

| Parameter   | Type                    | Description                       |
| ----------- | ----------------------- | --------------------------------- |
| `schema`    | `BaseSchema`            | Valibot Schema or Pipe            |
| `fn`        | `(handle: Handle) => T` | Callback function after transform |
| `options`   | `ConvertOptions`        | Configuration options             |

#### `getDefaults(schema)`

Extracts default values for all fields from a Schema, recursively handling objects and arrays.

```typescript
import { getDefaults } from '@piying/valibot-visit';

const schema = v.object({
  name: v.optional(v.string(), 'default'),
  age: v.number(),
});

console.log(getDefaults(schema));
// { name: 'default' }
```

### Metadata Operations (Actions)

| Action                          | Description                                           |
| ------------------------------- | ----------------------------------------------------- |
| `condition(value)`              | Conditional metadata, determines activation by env    |
| `asControl(value?)`             | Marks field as independent control (default: true)    |
| `asVirtualGroup(value?)`        | Marks combination type as virtual group               |
| `defineType(value)`             | Defines custom type name                              |
| `rawConfig(type, fn?, workOn?)` | Injects raw configuration function                    |
| `metadataList(value)`           | Batch metadata list                                   |

### Handle Lifecycle Hooks

`BaseSchemaHandle` provides the following overridable methods:

| Method                   | Description                                      |
| ------------------------ | ------------------------------------------------ |
| `begin(schema)`          | Called at start of traversal                     |
| `initMetadata()`         | Initializes metadata                             |
| `metadata(item, target?)`| Processes metadata                               |
| `validation(item)`       | Processes validation rules                       |
| `transformation(item)`   | Processes transformation rules                   |
| `wrappedSchema(schema)`  | Handles wrapped types (optional/nullable, etc.)  |
| `beforeSchemaType(schema)`| Called before identifying Schema type            |
| `lazySchema(schema)`     | Handles Lazy types                               |
| `arraySchema(schema)`    | Handles array types                              |
| `tupleSchema(schema)`    | Handles tuple types                              |
| `objectSchema(schema)`   | Handles object types                             |
| `recordSchema(schema)`   | Handles Record types                             |
| `variantSchema(schema)`  | Handles Variant types                            |
| `unionSchema(schema)`    | Handles Union types                              |
| `intersectSchema(schema)`| Handles Intersect types                          |

## 🧪 Development

```bash
# Run tests
npm test

# Generate coverage report
npm run coverage

# Build
npm run build

# Lint and format code
npm run lint
```
