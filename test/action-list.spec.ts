import * as v from 'valibot';
import {
  metadataList,
  BaseSchemaHandle,
  convertCore,
  metadataPipe,
} from '../src';
import { expect } from 'chai';
it('action-list', () => {
  class TestHandle extends BaseSchemaHandle<any> {}
  it('hello', () => {
    let define = v.pipe(
      v.string(),
      metadataList([v.title('1'), v.description('2')]),
    );

    let result = convertCore(
      define,
      (item) => {
        return item;
      },
      {
        handle: TestHandle,
      },
    );
    expect(result.props!['title']).eq('1');
    expect(result.props!['description']).eq('2');
  });
});
