import { Schema, SchemaOrPipe } from '../type';
import * as v from 'valibot';

export function* flatSchema(
  schemaOrPipe: SchemaOrPipe | Schema | v.PipeAction<any, any, v.BaseIssue<unknown>>
): Generator<
  Schema | v.BaseValidation<any, any, v.BaseIssue<unknown>> | v.BaseTransformation<any, any, v.BaseIssue<unknown>> | v.BaseMetadata<any>
> {
  if ('pipe' in schemaOrPipe) {
    for (const item of schemaOrPipe.pipe) {
      yield* flatSchema(item);
    }
  } else if ('wrapped' in schemaOrPipe) {
    yield schemaOrPipe;
    yield* flatSchema(schemaOrPipe.wrapped as any);
  } else {
    yield schemaOrPipe;
  }
}
