import { expect } from 'chai';
import * as v from 'valibot';
import { schema } from '../src';
describe('schema-custom', () => {
  it('intersect', () => {
    let define = schema.intersect([
      v.object({ k1: v.number() }),
      v.optional(v.object({ k2: v.number() })),
      v.optional(v.object({ k3: v.number() })),
    ]);
    // todo 类型问题
    type DefineType = v.InferOutput<typeof define>;

    let result = v.safeParse(define, { k1: 1 });
    expect(result.success).eq(true);
    expect(result.output).deep.eq({ k1: 1 });
    result = v.safeParse(define, { k1: 1, k2: 1 });
    expect(result.success).eq(true);
    expect(result.output).deep.eq({ k1: 1, k2: 1 });
  });
});

