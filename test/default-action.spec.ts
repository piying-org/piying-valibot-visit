import { expect } from 'chai';
import { convertCore } from '../src/convert';
import {
  BaseSchemaHandle,
  NonOptionalWrapSchema,
  OptionalWrapSchema,
} from '../src/handle/schema-handle';
import * as v from 'valibot';
import {
  asVirtualGroup,
  condition,
  defineType,
  metadataList,
  rawConfig,
  SchemaOrPipe,
} from '../src';
describe('action', () => {
  class TestHandle extends BaseSchemaHandle<any> {}

  it('默认', () => {
    let a = v.pipe(v.string());
    let result = convertCore(
      a,
      (item) => {
        return item;
      },
      {
        handle: TestHandle,
        defaultMetadataActionsGroup: {
          string: [v.title('preset')],
        },
      },
    );
    expect(result.props!['title']).eq('preset');
  });
  it('指定', () => {
    let a = v.pipe(v.string(), defineType('use1'));
    let result = convertCore(
      a,
      (item) => {
        return item;
      },
      {
        handle: TestHandle,
        defaultMetadataActionsGroup: {
          use1: [v.title('preset')],
        },
      },
    );
    expect(result.props!['title']).eq('preset');
  });
  it('无匹配', () => {
    let a = v.pipe(v.string());
    let result = convertCore(
      a,
      (item) => {
        return item;
      },
      {
        handle: TestHandle,
        defaultMetadataActionsGroup: {
          use1: [v.title('preset')],
        },
      },
    );
    expect(result.props?.['title']).eq(undefined);
  });
  it('metadata-list', () => {
    let a = v.pipe(v.string(), metadataList([defineType('use1')]));
    let result = convertCore(
      a,
      (item) => {
        return item;
      },
      {
        handle: TestHandle,
        defaultMetadataActionsGroup: {
          use1: [v.title('preset')],
        },
      },
    );
    expect(result.props!['title']).eq('preset');
  });
  it('vGroup', () => {
    let a = v.pipe(v.intersect([]), asVirtualGroup());
    let result = convertCore(
      a,
      (item) => {
        return item;
      },
      {
        handle: TestHandle,
        defaultMetadataActionsGroup: {
          'intersect-group': [v.title('preset')],
        },
      },
    );
    expect(result.props!['title']).eq('preset');
  });
});
