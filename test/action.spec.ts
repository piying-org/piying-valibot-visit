import { expect } from 'chai';
import { convertCore } from '../src/convert';
import { BaseSchemaHandle, NonOptionalWrapSchema, OptionalWrapSchema } from '../src/handle/schema-handle';
import * as v from 'valibot';
import { condition, SchemaOrPipe } from '../src';
describe('action', () => {
  class TestHandle extends BaseSchemaHandle<any> {}

  it('默认', () => {
    let a = v.pipe(v.string(), v.title('1234'), v.description('description1234'), v.metadata({ value: 1 }));
    let result = convertCore(
      a,
      (item) => {
        return item;
      },
      {
        handle: TestHandle,
      }
    );
    expect(result.props!['title']).eq('1234');
    expect(result.props!['description']).eq('description1234');
    expect(result.props!['metadata']).deep.eq({ value: 1 });
  });
  it('条件', () => {
    let a = v.pipe(
      v.string(),
      v.title('1234'),
      condition({
        environments: ['a'],
        actions: [v.description('description1234'), v.metadata({ value: 1 })],
      })
    );
    let result = convertCore(
      a,
      (item) => {
        return item;
      },
      {
        handle: TestHandle,
        environments: ['a'],
      }
    );
    expect(result.props!['title']).eq('1234');
    expect(result.props!['description']).eq('description1234');
    expect(result.props!['metadata']).deep.eq({ value: 1 });
  });
  it('条件不满足', () => {
    let a = v.pipe(
      v.string(),
      v.title('1234'),
      condition({
        environments: ['b'],
        actions: [v.description('description1234'), v.metadata({ value: 1 })],
      })
    );
    let result = convertCore(
      a,
      (item) => {
        return item;
      },
      {
        handle: TestHandle,
        environments: ['a'],
      }
    );
    expect(result.props!['title']).eq('1234');
    expect(result.props!['description']).not.eq('description1234');
    expect(result.props!['metadata']).not.deep.eq({ value: 1 });
  });
  it('条件部分满足', () => {
    let a = v.pipe(
      v.string(),
      v.title('1234'),
      condition({
        environments: ['b'],
        actions: [v.description('bbbb'), v.metadata({ value: 1 })],
      }),
      condition({
        environments: ['a'],
        actions: [v.description('aaaa'), v.metadata({ value: 1 })],
      })
    );
    let result = convertCore(
      a,
      (item) => {
        return item;
      },
      {
        handle: TestHandle,
        environments: ['b'],
      }
    );
    expect(result.props!['title']).eq('1234');
    expect(result.props!['description']).eq('bbbb');
  });
  it('多环境', () => {
    let a = v.pipe(
      v.string(),
      condition({
        environments: ['b', 'default'],
        actions: [v.description('bbbb'), v.metadata({ value: 1 })],
      }),
      condition({
        environments: ['a'],
        actions: [v.description('aaaa'), v.metadata({ value: 1 })],
      })
    );
    let result = convertCore(
      a,
      (item) => {
        return item;
      },
      {
        handle: TestHandle,
        environments: ['b'],
      }
    );
    expect(result.props!['description']).eq('bbbb');
    result = convertCore(
      a,
      (item) => {
        return item;
      },
      {
        handle: TestHandle,
      }
    );
    expect(result.props!['description']).eq('bbbb');
    result = convertCore(
      a,
      (item) => {
        return item;
      },
      {
        handle: TestHandle,
        environments: ['a'],
      }
    );
    expect(result.props!['description']).eq('aaaa');
  });
});
