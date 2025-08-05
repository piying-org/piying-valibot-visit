import * as v from 'valibot';
import { Schema, SchemaOrPipe } from '../type';
import { schemaForEach } from './find-action';
// 可以进行倒序优化?
function findAsControlAction(schema: SchemaOrPipe) {
  let asControlEnable = false;
  schemaForEach(schema, (schema) => {
    if (schema.kind === 'metadata' && schema.type === 'asControl') {
      asControlEnable = schema.value;
    }
  });
  return asControlEnable;
}
export function getSchemaByIssuePath(
  schema: Schema,
  list: NonNullable<v.BaseIssue<unknown>['path']>,
): Schema | undefined {
  list = list.slice() as any;
  while (list.length) {
    const pathItem = list[0];
    const isAsControl = findAsControlAction(schema);
    if (isAsControl) {
      return schema;
    }
    switch (schema.type) {
      case 'object':
      case 'object_with_rest':
      case 'loose_object':
      case 'strict_object':
        {
          schema = schema.entries[pathItem.key as string] as Schema;
        }

        break;
      case 'array': {
        schema = schema.item as Schema;
        break;
      }
      case 'tuple':
      // 目前没有rest这种方式
      // eslint-disable-next-line no-fallthrough
      case 'tuple_with_rest':
      case 'loose_tuple':
      case 'strict_tuple': {
        schema = schema.items[pathItem.key as number] as Schema;
        break;
      }
      case 'intersect':
      case 'variant':
      case 'union': {
        for (let index = 0; index < schema.options.length; index++) {
          const option = schema.options[index];
          const subResult = getSchemaByIssuePath(option as Schema, list);
          if (subResult) {
            return subResult;
          }
        }

        break;
      }

      case 'nullable':
      case 'nullish':
      case 'exact_optional':
      case 'optional':
      case 'undefinedable':
      case 'non_nullable':
      case 'non_nullish':
      case 'non_optional': {
        const wrapped = schema.wrapped;
        const result = getSchemaByIssuePath(schema.wrapped as Schema, list);
        if (result === wrapped) {
          return wrapped as Schema;
        } else {
          return result;
        }
      }
      default:
        return schema;
    }
    if (!schema) {
      return undefined;
    }
    list.shift();
  }

  return schema;
}
