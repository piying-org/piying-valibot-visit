import {
  type BaseSchema,
  type BaseIssue,
  type LooseObjectSchema,
  type ObjectEntries,
  type ErrorMessage,
  type LooseObjectIssue,
  type LooseTupleSchema,
  type TupleItems,
  type LooseTupleIssue,
  type ObjectSchema,
  type ObjectIssue,
  type ObjectWithRestSchema,
  type ObjectWithRestIssue,
  type StrictObjectSchema,
  type StrictObjectIssue,
  type StrictTupleSchema,
  type StrictTupleIssue,
  type TupleSchema,
  type TupleIssue,
  type TupleWithRestSchema,
  type TupleWithRestIssue,
  type InferDefaults,
  getDefault,
  InferOutput,
} from 'valibot';
import { IntersectSchema, UnionSchema } from '../type';
type DefaultSchema =
  | BaseSchema<unknown, unknown, BaseIssue<unknown>>
  | LooseObjectSchema<ObjectEntries, ErrorMessage<LooseObjectIssue> | undefined>
  | LooseTupleSchema<TupleItems, ErrorMessage<LooseTupleIssue> | undefined>
  | ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>
  | ObjectWithRestSchema<ObjectEntries, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ObjectWithRestIssue> | undefined>
  | StrictObjectSchema<ObjectEntries, ErrorMessage<StrictObjectIssue> | undefined>
  | StrictTupleSchema<TupleItems, ErrorMessage<StrictTupleIssue> | undefined>
  | TupleSchema<TupleItems, ErrorMessage<TupleIssue> | undefined>
  | TupleWithRestSchema<TupleItems, BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<TupleWithRestIssue> | undefined>
  | IntersectSchema
  | UnionSchema;
function coreSchema<TSchema extends DefaultSchema>(schema: TSchema) {
  while ('wrapped' in (schema as any)) {
    schema = (schema as any).wrapped;
  }
  return schema as TSchema;
}
// @__NO_SIDE_EFFECTS__
export function getDefaults<const TSchema extends DefaultSchema>(schema: TSchema): InferOutput<TSchema> {
  const wrappedSchema = coreSchema(schema);
  // If it is an object schema, return defaults of entries
  if ('entries' in wrappedSchema) {
    const object: Record<string, unknown> = {};
    const defaultValue = getDefault(schema);
    for (const key in wrappedSchema.entries) {
      const result = (defaultValue as any)?.[key] ?? getDefaults(wrappedSchema.entries[key]);
      if (result !== undefined) {
        object[key] = result;
      }
    }
    return Object.keys(object).length ? object : (undefined as InferDefaults<TSchema>);
  }

  // If it is a tuple schema, return defaults of items
  if ('items' in wrappedSchema) {
    let list = [];
    for (let index = 0; index < wrappedSchema.items.length; index++) {
      const item = wrappedSchema.items[index];
      let result = getDefaults(item);
      if (result !== undefined) {
        list[index] = result;
      }
    }
    return list.length ? list : undefined;
  }
  if ('options' in wrappedSchema) {
    if (wrappedSchema.type === 'intersect') {
      // 假设一定是对象
      let obj = wrappedSchema.options.slice().reduce(
        (pre, item) => ({
          ...pre,
          ...getDefaults(item)!,
        }),
        {} as Record<string, unknown>
      ) as InferDefaults<TSchema>;
      return Object.keys(obj as any).length ? obj : undefined;
    }
    if (wrappedSchema.type === 'union' || wrappedSchema.type === 'variant') {
      for (const option of wrappedSchema.options) {
        const defaults = getDefaults(option);
        if (defaults !== undefined) {
          return defaults;
        }
      }
    }
  }
  // Otherwise, return default or `undefined`
  ////   @ts-expect-error
  return getDefault(schema);
}
