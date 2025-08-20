import type { BaseMetadata } from 'valibot';
import { BaseSchemaHandle } from '../handle/schema-handle';
type RawFn<T extends BaseSchemaHandle<any>> = (field: T, context?: any) => void;

export interface RawConfigAction<
  Type extends string,
  TInput = unknown,
  SCHEMA_HANDLE extends BaseSchemaHandle<any> = any,
> extends BaseMetadata<TInput> {
  readonly type: Type;

  readonly reference: typeof rawConfig;

  readonly value: RawFn<SCHEMA_HANDLE>;
  workOn?: 'afterSchemaType';
}
export type RawConfigActionCommon<
  TInput,
  SCHEMA_HANDLE extends BaseSchemaHandle<any> = any,
> = RawConfigAction<string, TInput, SCHEMA_HANDLE>;
export type RawConfig<
  Type extends string,
  SCHEMA_HANDLE extends BaseSchemaHandle<any>,
> = <TInput>(
  value: RawFn<SCHEMA_HANDLE>,
  workOn?: 'afterSchemaType',
) => RawConfigAction<Type, TInput>;
export type RawConfigCommon<SCHEMA_HANDLE extends BaseSchemaHandle<any>> =
  RawConfig<string, SCHEMA_HANDLE>;
export function createRawConfig<
  Type extends string,
  SCHEMA_HANDLE extends BaseSchemaHandle<any> = any,
>(type: Type) {
  return <TInput>(
    value: RawConfigAction<Type, TInput, SCHEMA_HANDLE>['value'],
    workOn?: 'afterSchemaType',
  ): RawConfigAction<Type, TInput, SCHEMA_HANDLE> => {
    return {
      kind: 'metadata',
      type: type,
      reference: rawConfig,
      value: value,
      workOn,
    };
  };
}

export const rawConfig = createRawConfig('rawConfig');
