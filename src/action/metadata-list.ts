import type { BaseMetadata } from 'valibot';

export interface MetadataListAction<TInput = unknown>
  extends BaseMetadata<TInput> {
  /**
   * The action type.
   */
  readonly type: 'metadataList';
  /**
   * The action reference.
   */
  readonly reference: typeof metadataList;

  readonly value: BaseMetadata<any>[];
}

export function metadataList<TInput>(
  value: BaseMetadata<any>[],
): MetadataListAction<TInput> {
  return {
    kind: 'metadata',
    type: 'metadataList',
    reference: metadataList,
    value: value,
  };
}
