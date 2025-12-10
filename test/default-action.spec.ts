import { expect } from 'chai';
import { convertCore } from '../src/convert';
import {
  BaseSchemaHandle,
  NonOptionalWrapSchema,
  OptionalWrapSchema,
} from '../src/handle/schema-handle';
import * as v from 'valibot';
import { condition, defineName, rawConfig, SchemaOrPipe } from '../src';
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
    let a = v.pipe(v.string(), defineName('use1'));
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
});
