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
} from 'valibot';

type Schema = SchemaWithoutPipe<
  | LooseObjectSchema<ObjectEntries, ErrorMessage<LooseObjectIssue> | undefined>
  | LooseObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<LooseObjectIssue> | undefined>
  | ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>
  | ObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<ObjectIssue> | undefined>
  | ObjectWithRestSchema<ObjectEntries, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined>
  | ObjectWithRestSchemaAsync<
      ObjectEntriesAsync,
      BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
      ErrorMessage<ObjectWithRestIssue> | undefined
    >
  | StrictObjectSchema<ObjectEntries, ErrorMessage<StrictObjectIssue> | undefined>
  | StrictObjectSchemaAsync<ObjectEntriesAsync, ErrorMessage<StrictObjectIssue> | undefined>
>;
type IntersectS = IntersectSchema<any, any>;
function isObject<T>(schema: any): schema is T {
  return (
    schema.type === 'object' || schema.type === 'loose_object' || schema.type === 'object_with_rest' || schema.type === 'strict_object'
  );
}
function isIntersect<T>(data: any): data is T {
  return data.type === 'intersect';
}
/** change object / intersect(object[]) */
export function changeObject<const TSchema extends Schema | IntersectS>(
  schema: TSchema,
  changeObj: {
    [K in keyof InferInput<TSchema>]?: (item: BaseSchema<any, any, any>) => BaseSchema<any, any, any>;
  }
): TSchema {
  if (isObject<Schema>(schema)) {
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
  } else if (isIntersect<IntersectS>(schema as any)) {
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
