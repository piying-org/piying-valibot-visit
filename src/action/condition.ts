import type { BaseMetadata } from 'valibot';
import { GroupControlAction } from './group-control';

export interface ConditionAction<TInput = unknown> extends BaseMetadata<TInput> {
  /**
   * The action type.
   */
  readonly type: 'condition';
  /**
   * The action reference.
   */
  readonly reference: typeof condition;

  readonly value: {
    environments: string[];
    actions: (BaseMetadata<TInput>)[];
  };
}

export function condition<TInput>(value: ConditionAction<TInput>['value']): ConditionAction<TInput> {
  return {
    kind: 'metadata',
    type: 'condition',
    reference: condition,
    value: value,
  };
}
