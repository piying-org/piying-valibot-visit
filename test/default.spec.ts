import * as v from 'valibot';

import { getDefaults } from '../src/util/get-defaults';
import { expect } from 'chai';
// 用于测试fields和model变动时,数值是否正确

describe('getDefaults', () => {
  it('empty-object', () => {
    const obj = v.object({
      key1: v.string(),
    });
    let value = getDefaults(obj);
    expect(value).eq(undefined);
  });
  it('empty-tuple', () => {
    const obj = v.tuple([v.string()]);
    let value = getDefaults(obj);
    expect(value).eq(undefined);
  });
  it('empty-intersect', () => {
    const obj = v.intersect([v.object({ a: v.string() })]);
    let value = getDefaults(obj);
    expect(value).eq(undefined);
  });
  it('empty-union', () => {
    const obj = v.union([v.object({ a: v.string() })]);
    let value = getDefaults(obj);
    expect(value).eq(undefined);
  });
  it('object', () => {
    const obj = v.object({
      key1: v.optional(v.string(), '1'),
    });
    expect(getDefaults(obj)).deep.eq({ key1: '1' });
  });
  it('array', () => {
    const obj = v.object({
      key1: v.optional(v.array(v.string()), ['1']),
    });
    expect(getDefaults(obj)).deep.eq({ key1: ['1'] });
  });
  it('intersect', () => {
    const obj = v.object({
      o1: v.intersect([
        v.object({ k1: v.optional(v.string(), '1') }),
        v.object({ k2: v.optional(v.string(), '2') }),
        v.object({ k3: v.string() }),
      ]),
    });
    const b = getDefaults(obj);
    expect(getDefaults(obj)).deep.eq({
      o1: {
        k1: '1',
        k2: '2',
      },
    } as any);
  });
  it('union', () => {
    const obj = v.object({
      o1: v.union([
        v.object({ k1: v.optional(v.string(), '1') }),
        v.object({ k2: v.optional(v.string(), '2') }),
        v.object({ k3: v.string() }),
      ]),
    });
    expect(getDefaults(obj)).deep.eq({
      o1: {
        k1: '1',
      },
    } as any);
  });
  it('对象可选', () => {
    const obj = v.optional(v.object({ value: v.optional(v.string(), '11') }));
    const b = getDefaults(obj);
    expect(b).deep.eq({ value: '11' });
  });
  it('对象递归可选', () => {
    const obj = v.optional(
      v.object({
        o2: v.optional(v.object({ value: v.optional(v.string(), '11') })),
      })
    );
    const b = getDefaults(obj);
    expect(b).deep.eq({ o2: { value: '11' } });
  });
  it('默认值覆盖', () => {
    const obj = v.optional(
      v.object({
        o2: v.optional(v.string(), '111'),
      }),
      { o2: '2222' }
    );
    const b = getDefaults(obj);
    expect(b).deep.eq({ o2: '2222' });
  });
  it('外层可选', () => {
    const obj = v.optional(
      v.object({
        o2: v.string(),
      }),
      { o2: '2222' }
    );
    const b = getDefaults(obj);
    expect(b).deep.eq({ o2: '2222' });
  });
  it('默认值覆盖', () => {
    const obj = v.optional(
      v.object({
        o2: v.optional(v.object({ o3: v.string() })),
      })
    );
    const b = getDefaults(obj);
    expect(b).deep.eq(undefined);
  });
});
