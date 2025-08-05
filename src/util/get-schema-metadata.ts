import { Schema } from '../type';
import { schemaForEach } from './find-action';

export function getSchemaMetadata(schema: Schema) {
  let title: string | undefined;
  let description: string | undefined;
  let metadata: Record<string, unknown> | undefined;

  schemaForEach(schema, (item) => {
    if (item.kind === 'metadata') {
      switch (item.type) {
        case 'title':
          title = item.title;
          break;
        case 'metadata':
          metadata = item.metadata as Record<string, unknown>;
          break;
        case 'description':
          description = item.description;
          break;
        default:
          break;
      }
    }
  });

  return { title, description, metadata };
}
