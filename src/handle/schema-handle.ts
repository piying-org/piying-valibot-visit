import { ConvertOptions } from '../context';
import * as v from 'valibot';
import {
  ConvertContext,
  IntersectSchema,
  MetadataAction,
  Schema,
  SchemaOrPipe,
  UnionSchema,
} from '../type';
import { convertSchema } from '../convert';
import { getDefaults } from '../util/get-defaults';
export type LazySchema = v.LazySchema<v.BaseSchema<unknown, unknown, any>>;
export type ArraySchema = v.ArraySchema<
  v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
  v.ErrorMessage<v.ArrayIssue> | undefined
>;
export type ObjectItemSchema = v.BaseSchema<
  unknown,
  unknown,
  v.BaseIssue<unknown>
>;
export type ObjectSchema =
  | v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined>
  | v.ObjectWithRestSchema<
      v.ObjectEntries,
      v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
      v.ErrorMessage<v.ObjectWithRestIssue> | undefined
    >
  | v.StrictObjectSchema<
      v.ObjectEntries,
      v.ErrorMessage<v.StrictObjectIssue> | undefined
    >
  | v.LooseObjectSchema<
      v.ObjectEntries,
      v.ErrorMessage<v.LooseObjectIssue> | undefined
    >;
export type TupleSchema =
  | v.TupleSchema<v.TupleItems, v.ErrorMessage<v.TupleIssue> | undefined>
  | v.TupleWithRestSchema<
      v.TupleItems,
      v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
      v.ErrorMessage<v.TupleWithRestIssue> | undefined
    >
  | v.LooseTupleSchema<
      v.TupleItems,
      v.ErrorMessage<v.LooseTupleIssue> | undefined
    >
  | v.StrictTupleSchema<
      v.TupleItems,
      v.ErrorMessage<v.StrictTupleIssue> | undefined
    >;
export type OptionalWrapSchema =
  | v.NullableSchema<
      v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
      v.Default<v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>, null>
    >
  | v.NullishSchema<
      v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
      v.Default<
        v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
        null | undefined
      >
    >
  | v.ExactOptionalSchema<
      v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
      v.Default<v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>, undefined>
    >
  | v.OptionalSchema<
      v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
      v.Default<v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>, undefined>
    >
  | v.UndefinedableSchema<
      v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
      v.Default<v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>, undefined>
    >;
export type NonOptionalWrapSchema =
  | v.NonNullableSchema<
      v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
      v.ErrorMessage<v.NonNullableIssue> | undefined
    >
  | v.NonNullishSchema<
      v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
      v.ErrorMessage<v.NonNullishIssue> | undefined
    >
  | v.NonOptionalSchema<
      v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
      v.ErrorMessage<v.NonOptionalIssue> | undefined
    >;
export type DefaultSchema = v.LiteralSchema<
  v.Literal,
  v.ErrorMessage<v.LiteralIssue> | undefined
>;
export type EnumSchema =
  | v.PicklistSchema<
      v.PicklistOptions,
      v.ErrorMessage<v.PicklistIssue> | undefined
    >
  | v.EnumSchema<v.Enum, v.ErrorMessage<v.EnumIssue> | undefined>;

export type VoidSchema =
  | v.VoidSchema<v.ErrorMessage<v.VoidIssue> | undefined>
  | v.NeverSchema<v.ErrorMessage<v.NeverIssue> | undefined>;
export type CustomSchema = v.CustomSchema<
  v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
  v.ErrorMessage<v.CustomIssue> | undefined
>;
export class BaseSchemaHandle<T extends BaseSchemaHandle<T>> {
  key?: string | number;

  children: T[] = [];
  parent?: T;
  // root?: T;
  type?: string;
  /** 标识为一个group组 */
  isGroup: boolean | undefined;
  /** 标识为一个普通控件 */
  isObjectControl = false;
  arrayChild?: T;
  defaultValue?: any;
  props?: Record<string, any>;
  /** 权重,排序时可能用到 */
  priority = 0;
  childrenAsVirtualGroup = false;
  /** wrapper用 */
  undefinedable = false;
  nullable = false;
  globalConfig;
  callSchemaHandle;
  callDefineSchema;
  sourceSchema!: v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;
  lazyWrapped?: BaseSchemaHandle<T>;
  context!: ConvertContext;
  afterSchemaTypeList: any[] = [];
  constructor(
    globalConfig: Omit<
      ConvertOptions<
        new (...args: ConstructorParameters<typeof BaseSchemaHandle<any>>) => T
      >,
      'name'
    > & {
      environments: string[];
    },
    callSchemaHandle?: T,
    callDefineSchema?: v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
    context?: ConvertContext,
  ) {
    this.globalConfig = globalConfig;
    this.callSchemaHandle = callSchemaHandle;
    this.callDefineSchema = callDefineSchema;
    if (callSchemaHandle) {
      this.context = callSchemaHandle.context;
    }
    if (context) {
      this.context = context;
    }
  }
  /** 定义开始 */
  begin(schema: SchemaOrPipe) {
    this.sourceSchema = schema;
  }
  /** 定义结束 */
  end(schema: SchemaOrPipe) {}

  defineSchema(schema: SchemaOrPipe) {
    this.type = schema.type;
  }
  beforeSchemaType(schema: Schema) {}
  tupleSchema(schema: TupleSchema) {
    if (this.isObjectControl) {
      this.defaultValue = getDefaults(this.sourceSchema!);
      return;
    }
    this.tupleDefault(schema);
    for (let index = 0; index < schema.items.length; index++) {
      const item = schema.items[index];
      this.objectItemSchema(item, index);
    }
    if (schema.type === 'tuple_with_rest') {
      this.restSchema(schema.rest);
    }
    this.afterTupleSchema(schema);
  }
  tupleDefault(schema: TupleSchema) {}
  afterTupleSchema(schema: TupleSchema) {}

  objectSchema(schema: ObjectSchema) {
    if (this.isObjectControl) {
      this.defaultValue = getDefaults(this.sourceSchema!);
      return;
    }
    this.objectDefault(schema);
    this.isGroup ??= true;
    for (const key in schema.entries) {
      const entry = schema.entries[key] as SchemaOrPipe;
      this.objectItemSchema(entry, key);
    }
    if (schema.type === 'object_with_rest') {
      this.restSchema(schema.rest);
    }
    this.afterObjectSchema(schema);
  }
  objectDefault(schema: ObjectSchema) {}
  afterObjectSchema(schema: ObjectSchema) {}

  optionalWrapSchema(schema: OptionalWrapSchema) {
    switch (schema.type) {
      case 'undefinedable':
      case 'optional':
      // 应该没有赋值才用这个,目前不确定
      // eslint-disable-next-line no-fallthrough
      case 'exact_optional':
        this.undefinedable = true;
        break;
      case 'nullable':
        this.nullable = true;
        break;
      case 'nullish':
        this.nullable = true;
        this.undefinedable = true;
        break;
      default:
        break;
    }
  }
  nonOptionalSchema(schema: NonOptionalWrapSchema) {
    switch (schema.type) {
      case 'non_nullable':
        this.nullable = false;
        break;
      case 'non_nullish':
        this.nullable = false;
        this.undefinedable = false;
        break;
      case 'non_optional':
        this.undefinedable = false;
        break;

      default:
        break;
    }
  }
  wrappedSchema(schema: OptionalWrapSchema | NonOptionalWrapSchema) {
    if ('default' in schema) {
      this.optionalWrapSchema(schema);
      this.defaultValue = schema.default;
    } else {
      this.nonOptionalSchema(schema);
      delete this.defaultValue;
    }
  }
  recordSchema(
    key: v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
    value: v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
  ) {}
  defaultSchema(schema: DefaultSchema) {}
  enumSchema(schema: EnumSchema) {}
  voidSchema(schema: VoidSchema) {}
  customSchema(schema: CustomSchema) {}
  otherSchema(schema: v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>) {}
  afterSchemaType(schema: Schema) {
    this.afterSchemaTypeList.forEach((item) => {
      this.metadata(item, item.workOn);
    });
  }
  metadataDefaulthandle(
    metadata: MetadataAction,
    environments: string[],
    workOn: string,
  ) {}
  metadataHandle(
    metadata: MetadataAction,
    environments: string[],
    workOn: string,
  ) {
    if (
      this.globalConfig.environments !== environments &&
      this.globalConfig.environments.every(
        (item) => !environments.includes(item),
      )
    ) {
      return;
    }
    if (workOn === 'init' && 'workOn' in metadata && metadata.workOn) {
      this.afterSchemaTypeList.push(metadata as any);
      return;
    }
    switch (metadata.type) {
      case 'rawConfig': {
        metadata.value(this as any, this.globalConfig.context);
        break;
      }
      case 'title': {
        this.props ??= {};
        this.props['title'] = metadata.title;
        break;
      }
      case 'description': {
        this.props ??= {};
        this.props['description'] = metadata.description;
        break;
      }
      case 'metadata': {
        this.props ??= {};
        this.props['metadata'] = metadata.metadata;
        break;
      }
      case 'asControl': {
        this.isObjectControl = metadata.value;
        this.isGroup = false;
        break;
      }
      case 'asVirtualGroup': {
        this.isGroup = true;
        this.childrenAsVirtualGroup = metadata.value;
        break;
      }
      case 'condition': {
        metadata.value.actions.forEach((item) => {
          this.metadataHandle(item as any, metadata.value.environments, workOn);
        });
        break;
      }
      default:
        this.metadataDefaulthandle(metadata, environments, workOn);
        break;
    }
  }
  metadata(metadata: MetadataAction, workOn: string) {
    this.metadataHandle(metadata, this.globalConfig.environments, workOn);
  }

  validation(item: v.BaseValidation<any, any, v.BaseIssue<unknown>>) {}
  transformation(item: v.BaseTransformation<any, any, v.BaseIssue<unknown>>) {}

  lazySchema(schema: LazySchema): void {
    let sh = this.context.lazyMap.get(schema);
    if (sh) {
      this.lazyWrapped = sh as T;
    } else {
      const loaded = schema.getter(undefined);
      sh = new this.globalConfig.handle(
        this.globalConfig,
        this as unknown as T,
        loaded,
      );
      this.context.lazyMap.set(schema, sh);
      this.lazyWrapped = sh as T;
      convertSchema(loaded as any, sh);
    }
  }
  arraySchema(schema: ArraySchema): void {
    if (this.isObjectControl) {
      return;
    }
    const sh = new this.globalConfig.handle(
      this.globalConfig,
      this as unknown as T,
      schema,
    );
    sh.parent = this as any as T;
    this.arrayChild = sh as T;
    convertSchema(schema.item as SchemaOrPipe, sh);
  }

  objectItemSchema(
    childSchema: ObjectItemSchema,
    index: number | string,
  ): void {
    const sh = new this.globalConfig.handle(
      this.globalConfig,
      this as unknown as T,
      childSchema,
    );
    sh.key = index;
    sh.setParent(this as unknown as T);
    convertSchema(childSchema as SchemaOrPipe, sh);
  }
  restSchema(schema: v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>) {}
  anySchema(schema: v.AnySchema | v.UnknownSchema) {}

  undefinedSchema(
    schema:
      | v.NullSchema<v.ErrorMessage<v.NullIssue> | undefined>
      | v.UndefinedSchema<v.ErrorMessage<v.UndefinedIssue> | undefined>,
  ) {}
  basicSchema(
    schema:
      | v.StringSchema<v.ErrorMessage<v.StringIssue> | undefined>
      | v.BooleanSchema<v.ErrorMessage<v.BooleanIssue> | undefined>
      | v.NumberSchema<v.ErrorMessage<v.NumberIssue> | undefined>,
  ) {}
  intersectSchema(schema: IntersectSchema): void {
    if (this.isObjectControl) {
      this.defaultValue = getDefaults(this.sourceSchema!);
      return;
    }
    this.intersectBefore(schema);
    schema.options.forEach((option, index) => {
      this.logicItemSchema(option, index, 'intersect');
    });
  }

  intersectBefore(schema: IntersectSchema) {
    if (this.childrenAsVirtualGroup) {
      this.type = 'intersect-group';
    }
  }
  logicItemSchema(
    schema: v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
    index: number,
    type: 'intersect' | 'union',
  ) {
    const sh = new this.globalConfig.handle(
      this.globalConfig,
      this as unknown as T,
      schema,
    );
    sh.setParent(this as unknown as T);
    convertSchema(schema as SchemaOrPipe, sh);
  }
  unionSchema(schema: UnionSchema): void {
    if (this.isObjectControl) {
      this.defaultValue = getDefaults(this.sourceSchema!);
      return;
    }
    this.unionBefore(schema);

    schema.options.forEach((option, index) => {
      this.logicItemSchema(option, index, 'union');
    });
  }
  unionBefore(schema: UnionSchema) {}

  setParent(parent: T) {
    this.parent = parent;
    parent!.children ??= [];
    parent!.children.push(this as any);
  }
}
