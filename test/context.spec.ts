import { expect } from 'chai';
import { convertCore } from '../src/convert';
import { BaseSchemaHandle, NonOptionalWrapSchema, OptionalWrapSchema } from '../src/handle/schema-handle';
import * as v from 'valibot';
import { condition, rawConfig, SchemaOrPipe } from '../src';
describe('context', () => {
  class TestHandle extends BaseSchemaHandle<any> {}

  it('default', () => {
    let inputContext = { value: '111' };
    let isEq = false;
    let a = v.pipe(
      v.string(),
      rawConfig((sh, context) => {
        expect(context).eq(inputContext);
        isEq = true;
      })
    );
    let result = convertCore(
      a,
      (item) => {
        return item;
      },
      {
        handle: TestHandle,
        context: inputContext,
      }
    );
    expect(isEq).eq(true);
  });
});
