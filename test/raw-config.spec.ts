import { expect } from 'chai';
import { convertCore } from '../src/convert';
import { BaseSchemaHandle, NonOptionalWrapSchema, OptionalWrapSchema } from '../src/handle/schema-handle';
import * as v from 'valibot';
import { rawConfig, RawConfig } from '../src';
describe('rawConfig', () => {
  let list: any[] = [];
  class TestHandle extends BaseSchemaHandle<any> {
    test1 = 1;
    override wrappedSchema(schema: OptionalWrapSchema | NonOptionalWrapSchema): void {
      list.push(schema);
    }
  }
  // rawConfig type
  it('wrapped', () => {
    const typedRawConfig: RawConfig<'rawConfig', TestHandle> = rawConfig as any;
    let schema = v.pipe(
      v.string(),
      typedRawConfig((sh) => {
        expect(sh.test1).eq(1);
      })
    );
    let result = convertCore(
      schema,
      (item: TestHandle) => {
        return item.test1;
      },
      {
        handle: TestHandle,
      }
    );
    expect(result).eq(1);
  });
  it('after type', () => {
    const typedRawConfig: RawConfig<'rawConfig', TestHandle> = rawConfig as any;
    let metaRun = false;
    let schema = v.pipe(
      v.string(),
      typedRawConfig((sh) => {
        expect(sh.type).eq('string');
        metaRun = true;
        expect(sh.test1).eq(2);
      }, 'afterSchemaType'),
      typedRawConfig((sh) => {
        sh.test1 = 2;
      })
    );
    let result = convertCore(
      schema,
      (item: TestHandle) => {
        return item.test1;
      },
      {
        handle: TestHandle,
      }
    );
    expect(metaRun).true;
  });
});
