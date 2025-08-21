import * as v from 'valibot';
import { BaseSchemaHandle, convertCore, metadataPipe } from '../src';
import { expect } from 'chai';
it('metadata-pipe', () => {
  class TestHandle extends BaseSchemaHandle<any> {}

  it('hello', () => {
    const list = metadataPipe(v.title('1'), v.description('2'));
    let define = v.pipe(v.string(), ...list);

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
