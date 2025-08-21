import {
  SchemaWithoutPipe,
  LooseObjectSchema,
  ObjectEntries,
  ErrorMessage,
  LooseObjectIssue,
  LooseObjectSchemaAsync,
  ObjectEntriesAsync,
  ObjectSchema,
  ObjectIssue,
  ObjectSchemaAsync,
  ObjectWithRestSchema,
  BaseSchema,
  BaseIssue,
  ObjectWithRestIssue,
  ObjectWithRestSchemaAsync,
  BaseSchemaAsync,
  StrictObjectSchema,
  StrictObjectIssue,
  StrictObjectSchemaAsync,
  InferInput,
  _getStandardProps,
  IntersectSchema,
  ObjectKeys,
  SchemaWithOmit,
  omit,
  SchemaWithPipe,
  PipeItem,
  pipe,
} from 'valibot';

type Schema = SchemaWithoutPipe<
  | LooseObjectSchema<ObjectEntries, ErrorMessage<LooseObjectIssue> | undefined>
  | LooseObjectSchemaAsync<
      ObjectEntriesAsync,
      ErrorMessage<LooseObjectIssue> | undefined
    >
  | ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>
  | ObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<ObjectIssue> | undefined>
  | ObjectWithRestSchema<
      ObjectEntries,
      BaseSchema<unknown, unknown, BaseIssue<unknown>>,
      ErrorMessage<ObjectWithRestIssue> | undefined
    >
  | ObjectWithRestSchemaAsync<
      ObjectEntriesAsync,
      | BaseSchema<unknown, unknown, BaseIssue<unknown>>
      | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
      ErrorMessage<ObjectWithRestIssue> | undefined
    >
  | StrictObjectSchema<
      ObjectEntries,
      ErrorMessage<StrictObjectIssue> | undefined
    >
  | StrictObjectSchemaAsync<
      ObjectEntriesAsync,
      ErrorMessage<StrictObjectIssue> | undefined
    >
>;
type IntersectS = IntersectSchema<any, any>;
function isObject(schema: any): schema is Schema {
  return (
    schema.type === 'object' ||
    schema.type === 'loose_object' ||
    schema.type === 'object_with_rest' ||
    schema.type === 'strict_object'
  );
}
function isIntersect(data: any): data is IntersectS {
  return data.type === 'intersect';
}
/** change object / intersect(object[]) */
export function changeObject<const TSchema extends Schema | IntersectS>(
  schema: TSchema,
  changeObj: {
    [K in keyof InferInput<TSchema>]?: (
      item: BaseSchema<any, any, any>,
    ) => BaseSchema<any, any, any>;
  },
): TSchema {
  if (isObject(schema)) {
    const entries = { ...schema.entries };
    for (const key in changeObj) {
      if (changeObj[key] && (schema.entries as any)[key]) {
        const element = changeObj[key]((schema.entries as any)[key]);
        entries[key] = element;
      }
    }
    return {
      ...schema,
      entries,
      get '~standard'() {
        return _getStandardProps(this);
      },
    };
  } else if (isIntersect(schema as any)) {
    const options = [...schema.options];
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      options[i] = changeObject(option, changeObj);
    }
    return {
      ...schema,
      options,
      get '~standard'() {
        return _getStandardProps(this);
      },
    };
  }
  throw new Error('not object or intersect');
}

type ObjectPartRemove<
  TSchema extends ObjectSchema<any, any>,
  Tkeys extends string[],
> = Tkeys extends []
  ? TSchema
  : Tkeys extends [infer First, ...infer Rest]
    ? First extends keyof TSchema['entries']
      ? ObjectPartRemove<
          SchemaWithOmit<TSchema, [First]>,
          Rest extends string[] ? Rest : []
        >
      : TSchema
    : TSchema;
type ObjectListRemove<
  TSchemaList extends readonly any[],
  Tkeys extends string[],
> = TSchemaList extends []
  ? []
  : TSchemaList extends [infer First, ...infer Rest]
    ? First extends ObjectSchema<any, any>
      ? [ObjectPartRemove<First, Tkeys>, ...ObjectListRemove<Rest, Tkeys>]
      : First extends IntersectSchema<any, any>
        ? [IntersectRemove<First, Tkeys>, ...ObjectListRemove<Rest, Tkeys>]
        : ObjectListRemove<Rest, Tkeys>
    : TSchemaList;

type IntersectRemove<Schema, Tkeys extends string[]> =
  Schema extends IntersectSchema<infer List, infer Message>
    ? IntersectSchema<ObjectListRemove<List, Tkeys>, Message>
    : Schema extends ObjectSchema<any, any>
      ? ObjectPartRemove<Schema, Tkeys>
      : Schema;
type IntersectRemove2<Schema, Tkeys extends string[]> =
  Schema extends SchemaWithPipe<infer PipeList>
    ? PipeList extends [infer PipeSchema, ...infer PipeActionList]
      ? IntersectRemove<PipeSchema, Tkeys> extends IntersectSchema<any, any>
        ? PipeActionList extends PipeItem<any, any, any>[]
          ? SchemaWithPipe<
              readonly [IntersectRemove<PipeSchema, Tkeys>, ...PipeActionList]
            >
          : SchemaWithPipe<readonly [IntersectRemove<PipeSchema, Tkeys>]>
        : Schema
      : Schema
    : IntersectRemove<Schema, Tkeys>;
type ObjectListSchemaKeys<TSchemaList extends readonly any[]> =
  TSchemaList extends [infer Schema, ...infer Rest]
    ? [
        ...(Schema extends ObjectSchema<any, any>
          ? ObjectKeys<Schema>
          : Schema extends IntersectSchema<any, any>
            ? IntersectKeys<Schema>
            : []),
        ...ObjectListSchemaKeys<Rest>,
      ]
    : [];
type AnyTuple<T extends readonly string[]> = {
  [K in keyof T]: T[number];
};
type IntersectKeys<Schema extends IntersectSchema<any, any>> = AnyTuple<
  ObjectListSchemaKeys<Schema['options']>
>;
export type IntersectSchema2 =
  | IntersectSchema<any, any>
  | SchemaWithPipe<[IntersectSchema<any, any>]>;

export function omitIntersect<
  const TSchema extends IntersectSchema2,
  const TKeys extends IntersectKeys<TSchema>,
>(schema: TSchema, keys: TKeys): IntersectRemove2<TSchema, TKeys> {
  const options: any[] = [];
  for (let index = 0; index < schema.options.length; index++) {
    const item = schema.options[index];
    if (isObject(item)) {
      if ('pipe' in item) {
        const pipeList = item.pipe as unknown as any[];
        options.push(
          pipe(omit(pipeList[0], keys as any) as any, ...pipeList.slice(1)),
        );
      } else {
        options.push(omit(item, keys as any));
      }
    } else if (isIntersect(item)) {
      options.push(omitIntersect(item, keys));
    }
  }
  if ('pipe' in schema) {
    return pipe(
      {
        ...(schema as any).pipe[0],
        options: options,
        get '~standard'() {
          return _getStandardProps(this);
        },
      },
      ...schema.pipe.slice(1),
    ) as any;
  }
  return {
    ...schema,
    options,
    get '~standard'() {
      return _getStandardProps(this);
    },
  } as any;
}
