import type { BaseMetadata } from 'valibot';

export interface GroupControlAction<TInput = unknown>
  extends BaseMetadata<TInput> {
  /**
   * The action type.
   */
  readonly type: 'asControl';
  /**
   * The action reference.
   */
  readonly reference: typeof asControl;

  readonly value: boolean;
}

export function asControl<TInput>(value = true): GroupControlAction<TInput> {
  return {
    kind: 'metadata',
    type: 'asControl',
    reference: asControl,
    value: value,
  };
}
