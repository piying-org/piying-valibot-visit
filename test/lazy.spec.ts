import { expect } from 'chai';
import { convertCore } from '../src/convert';
import { BaseSchemaHandle } from '../src/handle/schema-handle';
import * as v from 'valibot';
describe('lazy', () => {
  class TestHandle extends BaseSchemaHandle<TestHandle> {}
  it('hello', () => {
    let a = v.object({ k1: v.lazy(() => b) });
    let aL = a as any;
    let b = v.object({ k2: v.lazy(() => aL as v.BaseSchema<any, any, any>) });
    let result = convertCore(
      a,
      (item) => {
        return item;
      },
      {
        handle: TestHandle,
      }
    );
    expect(result.type).eq('object');
    expect(result.children[0].key).eq('k1');
    expect(result.children[0].type).eq('lazy');
    expect(result.children[0].lazyWrapped).ok;
    expect(result.children[0].lazyWrapped?.type).eq('object');
    expect(result.children[0].lazyWrapped?.children[0].key).eq('k2');
  });
  it('reference self', () => {
    let a = v.object({ children: v.lazy(() => v.array(a)), name: v.string() });

    let result = convertCore(
      a,
      (item) => {
        return item;
      },
      {
        handle: TestHandle,
      }
    );
    expect(result.type).eq('object');
    expect(result.children[0].key).eq('children');
    expect(result.children[0].type).eq('lazy');
    expect(result.children[0].lazyWrapped).ok;
    expect(result.children[0].lazyWrapped?.type).eq('array');
    expect(result.children[0].lazyWrapped?.arrayChild).ok;
  });
});
