import type { BaseMetadata } from 'valibot';

export interface VirtualGroupAction<TInput = unknown>
  extends BaseMetadata<TInput> {
  /**
   * The action type.
   */
  readonly type: 'asVirtualGroup';
  /**
   * The action reference.
   */
  readonly reference: typeof asVirtualGroup;

  readonly value: boolean;
}
/** 只有交集类型使用
 * 使用后类型会变为intersect-group
 * 子级为虚拟group
 * 子级必须全部是group
 *
 */
export function asVirtualGroup<TInput>(
  value = true,
): VirtualGroupAction<TInput> {
  return {
    kind: 'metadata',
    type: 'asVirtualGroup',
    reference: asVirtualGroup,
    value: value,
  };
}
