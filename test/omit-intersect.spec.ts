import { expect } from 'chai';
import { convertCore } from '../src/convert';
import {
  BaseSchemaHandle,
  NonOptionalWrapSchema,
  OptionalWrapSchema,
} from '../src/handle/schema-handle';
import * as v from 'valibot';
import { condition, SchemaOrPipe } from '../src';
import { changeObject, omitIntersect } from '../src/util/change-object';
describe('omit-intersect', () => {
  it('默认', () => {
    let define = v.intersect([
      v.object({ k1: v.string() }),
      v.object({ k2: v.string() }),
    ]);
    let result = omitIntersect(define, ['k2']);
    expect(result.options.length).eq(2);
    expect(result.type).eq('intersect');
    expect(Object.keys(result.options[0].entries).length).eq(1);
    expect(Object.keys(result.options[1].entries).length).eq(0);
  });
  it('多层', () => {
    let define = v.intersect([
      v.object({ k1: v.string() }),
      v.intersect([v.object({ k2: v.string() })]),
    ]);
    let result = omitIntersect(define, ['k2']);
    expect(result.options.length).eq(2);
    expect(result.type).eq('intersect');
    expect(Object.keys(result.options[0].entries).length).eq(1);
    expect(result.options[1].type).eq('intersect');
    expect(Object.keys(result.options[1].options[0].entries).length).eq(0);
  });
  it('多个', () => {
    let define = v.intersect([
      v.object({ k1: v.string() }),
      v.object({ k2: v.string(), k3: v.string() }),
    ]);
    let result = omitIntersect(define, ['k2']);
    expect(result.options.length).eq(2);
    expect(result.type).eq('intersect');
    expect(Object.keys(result.options[0].entries).length).eq(1);
    expect(Object.keys(result.options[1].entries).length).eq(1);
  });
});
