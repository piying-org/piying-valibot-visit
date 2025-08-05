import { expect } from 'chai';
import { convertCore } from '../src/convert';
import { BaseSchemaHandle } from '../src/handle/schema-handle';
import * as v from 'valibot';
describe('hello', () => {
  class TestHandle extends BaseSchemaHandle<any> {}
  it('hello', () => {
    let a = v.string();
    let result = convertCore(
      a,
      (item) => {
        return item;
      },
      {
        handle: TestHandle,
      }
    );
    expect(result.type).eq('string');
  });
});
