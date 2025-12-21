import { expect } from 'chai';
import { convertCore } from '../src/convert';
import { BaseSchemaHandle } from '../src/handle/schema-handle';
import * as v from 'valibot';
import { SchemaOrPipe } from '../src/type';
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
      },
    );
    expect(result.type).eq('string');
  });

  it('additionalData', () => {
    let data;
    class TestHandle extends BaseSchemaHandle<any> {
      begin(schema: SchemaOrPipe): void {
        data = this.globalConfig.additionalData;
      }
    }
    let a = v.string();
    let result = convertCore(
      a,
      (item) => {
        return item;
      },
      {
        handle: TestHandle,
        additionalData: { value: 1 },
      },
    );
    expect(data).deep.eq({ value: 1 });
  });
});
