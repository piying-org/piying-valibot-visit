import type { BaseMetadata } from 'valibot';

export interface DefineNameAction<TInput = unknown>
  extends BaseMetadata<TInput> {
  /**
   * The action type.
   */
  readonly type: 'defineName';
  /**
   * The action reference.
   */
  readonly reference: typeof defineName;

  readonly value: string;
}

export function defineName<TInput>(value: string): DefineNameAction<TInput> {
  return {
    kind: 'metadata',
    type: 'defineName',
    reference: defineName,
    value: value,
  };
}
