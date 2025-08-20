import type * as v from 'valibot';
import {
  ConditionAction,
  GroupControlAction,
  RawConfigAction,
  VirtualGroupAction,
} from './action';
import { BaseSchemaHandle } from './handle/schema-handle';

export type Schema =
  | v.AnySchema
  | v.UnknownSchema
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
  | v.NullSchema<v.ErrorMessage<v.NullIssue> | undefined>
  | v.UndefinedSchema<v.ErrorMessage<v.UndefinedIssue> | undefined>
  | v.StringSchema<v.ErrorMessage<v.StringIssue> | undefined>
  | v.BooleanSchema<v.ErrorMessage<v.BooleanIssue> | undefined>
  | v.NumberSchema<v.ErrorMessage<v.NumberIssue> | undefined>
  | v.LiteralSchema<v.Literal, v.ErrorMessage<v.LiteralIssue> | undefined>
  | v.PicklistSchema<
      v.PicklistOptions,
      v.ErrorMessage<v.PicklistIssue> | undefined
    >
  | v.EnumSchema<v.Enum, v.ErrorMessage<v.EnumIssue> | undefined>
  | v.VariantSchema<
      string,
      v.VariantOptions<string>,
      v.ErrorMessage<v.VariantIssue> | undefined
    >
  | v.UnionSchema<
      v.UnionOptions,
      v.ErrorMessage<v.UnionIssue<v.BaseIssue<unknown>>> | undefined
    >
  | v.IntersectSchema<
      v.IntersectOptions,
      v.ErrorMessage<v.IntersectIssue> | undefined
    >
  | v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined>
  | v.VoidSchema<v.ErrorMessage<v.VoidIssue> | undefined>
  | v.NeverSchema<v.ErrorMessage<v.NeverIssue> | undefined>
  | v.ObjectWithRestSchema<
      v.ObjectEntries,
      v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
      v.ErrorMessage<v.ObjectWithRestIssue> | undefined
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
    >
  | v.StrictObjectSchema<
      v.ObjectEntries,
      v.ErrorMessage<v.StrictObjectIssue> | undefined
    >
  | v.LooseObjectSchema<
      v.ObjectEntries,
      v.ErrorMessage<v.LooseObjectIssue> | undefined
    >
  | v.RecordSchema<
      v.BaseSchema<string, string | number | symbol, v.BaseIssue<unknown>>,
      v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
      v.ErrorMessage<v.RecordIssue> | undefined
    >
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
    >
  | v.ArraySchema<
      v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
      v.ErrorMessage<v.ArrayIssue> | undefined
    >
  | v.LazySchema<v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>
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
    >
  | v.CustomSchema<
      v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
      v.ErrorMessage<v.CustomIssue> | undefined
    >;

export type SchemaOrPipe =
  | Schema
  | v.SchemaWithPipe<
      // @ts-ignore // TODO: Remove comment
      readonly [
        Schema,
        ...(Schema | v.PipeAction<any, any, v.BaseIssue<unknown>>)[],
      ]
    >;
export type MetadataAction =
  | v.DescriptionAction<unknown, string>
  | v.TitleAction<unknown, string>
  | v.MetadataAction<undefined, any>
  | RawConfigAction<'rawConfig', unknown>
  | GroupControlAction<unknown>
  | ConditionAction<unknown>
  | VirtualGroupAction<unknown>;

export type IntersectSchema = v.IntersectSchema<
  v.IntersectOptions,
  v.ErrorMessage<v.IntersectIssue> | undefined
>;
export type UnionSchema =
  | v.VariantSchema<
      string,
      v.VariantOptions<string>,
      v.ErrorMessage<v.VariantIssue> | undefined
    >
  | v.UnionSchema<
      v.UnionOptions,
      v.ErrorMessage<v.UnionIssue<v.BaseIssue<unknown>>> | undefined
    >;

export interface ConvertContext {
  lazyMap: WeakMap<v.BaseSchema<any, any, any>, BaseSchemaHandle<any>>;
}
