import * as v from 'valibot';
import { expect } from 'chai';
import { BaseSchemaHandle, convertCore } from '../src';
describe('defaultValue', () => {
  class TestHandle extends BaseSchemaHandle<any> {}
  it('object', () => {
    const define = v.optional(
      v.object({
        key1: v.string(),
      }),
      { key1: '1' }
    );
    let result = convertCore(define, (item) => item, {
      handle: TestHandle,
    });
    expect(result.defaultValue).deep.eq({ key1: '1' });
  });
});
