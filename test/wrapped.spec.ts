import { expect } from 'chai';
import { convertCore } from '../src/convert';
import { BaseSchemaHandle, NonOptionalWrapSchema, OptionalWrapSchema } from '../src/handle/schema-handle';
import * as v from 'valibot';
import { SchemaOrPipe } from '../src';
describe('wrapped', () => {
  let list:any[] = [];
  class TestHandle extends BaseSchemaHandle<any> {
    override wrappedSchema(schema: OptionalWrapSchema | NonOptionalWrapSchema): void {
      list.push(schema);
    }
  }
  it('wrapped', () => {
    let a = v.pipe(v.optional(v.nullable(v.string())));
    let result = convertCore(
      a,
      (item) => {
        return item;
      },
      {
        handle: TestHandle,
      }
    );
    expect(list.map((item ) => item.type)).deep.eq(['nullable','optional'])
  });
});
