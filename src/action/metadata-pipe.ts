import * as v from 'valibot';
/**
 * @deprecated 使用metadataList代替
 */
export function metadataPipe<
  const TItems extends readonly v.PipeItem<
    unknown,
    unknown,
    v.BaseIssue<unknown>
  >[],
>(...list: TItems): [] {
  return list as any;
}
