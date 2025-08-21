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
    let parseResult = v.safeParse(result, { k1: '1' });
    expect(parseResult.success).eq(true);
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
    let parseResult = v.safeParse(result, { k1: '1' });
    expect(parseResult.success).eq(true);
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
    let parseResult = v.safeParse(result, { k1: '1', k3: '1' });
    expect(parseResult.success).eq(true);
  });
  it('pipe', () => {
    let define = v.pipe(
      v.intersect([v.object({ k1: v.string() }), v.object({ k2: v.string() })]),
      v.transform((a) => {
        return { k2: '2' };
      }),
    );
    let result = omitIntersect(define, ['k1']);
    expect(result.pipe[0].options).eq(result.options);
    expect(result.options.length).eq(2);
    expect(result.type).eq('intersect');
    expect(Object.keys(result.options[0].entries).length).eq(0);
    expect(Object.keys(result.options[1].entries).length).eq(1);
    let parseResult = v.safeParse(result, { k2: '1' });
    expect(parseResult.success).eq(true);
    if (parseResult.success) {
      expect(parseResult.output).deep.eq({ k2: '2' });
    }
  });
  it('child pipe', () => {
    let define = v.intersect([
      v.pipe(
        v.object({
          k1: v.string(),
        }),
      ),
      v.pipe(
        v.object({
          k2: v.pipe(
            v.string(),
            v.transform((a) => '2'),
          ),
        }),
      ),
    ]);

    let result = omitIntersect(define, ['k1']);
    expect(result.options.length).eq(2);
    expect(result.type).eq('intersect');

    expect(result.options[0].pipe[0].entries).eq(result.options[0].entries);
    expect(Object.keys(result.options[0].entries).length).eq(0);
    expect(Object.keys(result.options[1].entries).length).eq(1);
    let parseResult = v.safeParse(result, { k2: '1' });
    expect(parseResult.success).eq(true);
    if (parseResult.success) {
      expect(parseResult.output.k2).eq('2');
    }
  });
});
