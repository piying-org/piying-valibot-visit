import * as v from 'valibot'
export function metadataPipe<
  const TItems extends readonly v.PipeItem<
    unknown,
    unknown,
    v.BaseIssue<unknown>
  >[],
>(...list: TItems): [] {
  return list as any;
}