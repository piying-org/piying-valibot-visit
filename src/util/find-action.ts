import { MetadataAction, SchemaOrPipe } from '../type';

export function schemaForEach(
  schema: SchemaOrPipe,
  fn: (schema: MetadataAction) => void,
) {
  if ('pipe' in schema) {
    schema.pipe.forEach((schema) => {
      schemaForEach(schema as SchemaOrPipe, fn);
    });
  } else if ('wrapped' in schema) {
    schemaForEach(schema.wrapped as SchemaOrPipe, fn);
  } else {
    fn(schema as any as MetadataAction);
  }
}
