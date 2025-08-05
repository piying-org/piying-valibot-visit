import { expect } from 'chai';
import { convertCore } from '../src/convert';
import { BaseSchemaHandle, NonOptionalWrapSchema, OptionalWrapSchema } from '../src/handle/schema-handle';
import * as v from 'valibot';
import { condition, SchemaOrPipe } from '../src';
import { changeObject } from '../src/util/change-object';
describe('change-object', () => {
  it('默认', () => {
    let data = v.object({ value1: v.string() });
    let changed = changeObject(data, {
      value1: (item) => {
        return v.pipe(item, v.title('hello'));
      },
    });
    expect(v.getTitle(changed.entries.value1)).eq('hello');
    expect(v.getTitle(data.entries.value1)).not.ok;
  });
  it('部分修改', () => {
    let data = v.object({ value1: v.string(), value2: v.number(), value3: v.pipe(v.boolean(), v.title('isBool')) });
    let changed = changeObject(data, {
      value1: (item) => {
        return v.pipe(item, v.title('hello'));
      },
    });
    expect(v.getTitle(changed.entries.value1)).eq('hello');
    expect(changed.entries.value2).ok;
    expect(v.getTitle(changed.entries.value3)).eq('isBool');
  });
  it('intersect', () => {
    let s1 = v.object({ v1: v.string() });
    let s2 = v.object({ v2: v.string() });
    let data = v.intersect([s1, s2]);
    let changed = changeObject(data, {
      v1: (item) => {
        return v.pipe(item, v.title('hello'));
      },
    });
    expect(v.getTitle(s1.entries.v1)).not.ok;
    expect(v.getTitle(changed.options[0].entries.v1)).eq('hello');
    expect(s2.entries.v2).ok;
    expect(v.getTitle(s2.entries.v2)).not.ok;
  });
  it('intersect-全修改', () => {
    let s1 = v.object({ v1: v.string() });
    let s2 = v.object({ v2: v.string() });
    let data = v.intersect([s1, s2]);
    let changed = changeObject(data, {
      v1: (item) => {
        return v.pipe(item, v.title('hello'));
      },
      v2: (item) => {
        return v.pipe(item, v.title('hello2'));
      },
    });
    expect(v.getTitle(s1.entries.v1)).not.ok;
    expect(v.getTitle(changed.options[0].entries.v1)).eq('hello');
    expect(v.getTitle(changed.options[1].entries.v2)).eq('hello2');
    expect(s2.entries.v2).ok;
    expect(v.getTitle(s2.entries.v2)).not.ok;
  });
  it('intersect-2层', () => {
    let s1 = v.object({ v1: v.string() });
    let s2 = v.object({ v2: v.string() });
    let data = v.intersect([v.intersect([s1]), s2]);
    let changed = changeObject(data, {
      v1: (item) => {
        return v.pipe(item, v.title('hello'));
      },
      v2: (item) => {
        return v.pipe(item, v.title('hello2'));
      },
    });
    expect(v.getTitle(s1.entries.v1)).not.ok;
    expect(v.getTitle(changed.options[0].options[0].entries.v1)).eq('hello');
    expect(v.getTitle(changed.options[1].entries.v2)).eq('hello2');
    expect(s2.entries.v2).ok;
    expect(v.getTitle(s2.entries.v2)).not.ok;
  });
});
