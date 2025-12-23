import type { BaseMetadata } from 'valibot';

export interface DefineTypeAction<TInput = unknown>
  extends BaseMetadata<TInput> {
  /**
   * The action type.
   */
  readonly type: 'defineType';
  /**
   * The action reference.
   */
  readonly reference: typeof defineType;

  readonly value: string;
}

export function defineType<TInput>(value: string): DefineTypeAction<TInput> {
  return {
    kind: 'metadata',
    type: 'defineType',
    reference: defineType,
    value: value,
  };
}
