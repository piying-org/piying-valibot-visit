import { ConvertOptions } from './context';
import { BaseSchemaHandle } from './handle/schema-handle';
import { SchemaOrPipe, Schema, ConvertContext } from './type';
import { flatSchema } from './util/flat-schema';
export function convertCore<Handle extends typeof BaseSchemaHandle<any>, T>(
  obj: SchemaOrPipe,
  fn: (item: InstanceType<Handle>) => T,
  options: ConvertOptions<Handle>
) {
  const resolvedOptions = {
    ...options,
    environments: options?.environments ?? ['default'],
  };
  const context: ConvertContext = {
    lazyMap: new WeakMap(),
  };
  const sh = new resolvedOptions.handle(resolvedOptions, undefined, undefined, context);
  convertSchema(obj, sh);
  return fn(sh as InstanceType<Handle>);
}

// 目前,希望先处理管道,然后再处理当前,子级
//
export function convertSchema(schemaOrPipe: SchemaOrPipe, sh: BaseSchemaHandle<BaseSchemaHandle<any>>) {
  sh.begin(schemaOrPipe);

  const list = flatSchema(schemaOrPipe);
  let schema!: Schema;
  const wrappedList = [];
  for (const valibotPipeItem of list) {
    if (valibotPipeItem.kind === 'schema') {
      if (!('wrapped' in valibotPipeItem)) {
        if (schema) {
          continue;
        }
        schema = valibotPipeItem;
        sh.defineSchema(schema);
      } else {
        wrappedList.push(valibotPipeItem);
      }
    } else if (valibotPipeItem.kind === 'metadata') {
      sh.metadata(valibotPipeItem as any, 'init');
    } else if (valibotPipeItem.kind === 'validation') {
      sh.validation(valibotPipeItem);
    } else if (valibotPipeItem.kind === 'transformation') {
      sh.transformation(valibotPipeItem);
    }
  }
  for (const wrapped of wrappedList.reverse()) {
    sh.wrappedSchema(wrapped);
  }

  sh.beforeSchemaType(schema);

  switch (schema.type) {
    case 'lazy': {
      sh.lazySchema(schema);
      break;
    }
    case 'array': {
      sh.arraySchema(schema);

      break;
    }

    case 'tuple':
    // 目前没有rest这种方式
    // eslint-disable-next-line no-fallthrough
    case 'tuple_with_rest':
    case 'loose_tuple':
    case 'strict_tuple': {
      sh.tupleSchema(schema);

      break;
    }

    case 'object':
    case 'object_with_rest':
    case 'loose_object':
    case 'strict_object': {
      //objectHandle
      sh.objectSchema(schema);

      break;
    }

    case 'record': {
      // 如果要验证,需要验证key和value?
      // 动态record相当于any,普通的control,可以加个object验证

      sh.recordSchema(schema.key, schema.value);
      break;
    }

    case 'literal': {
      //defaultHandle
      sh.defaultSchema(schema);
      break;
    }

    case 'enum':
    case 'picklist': {
      //optionsHandle
      sh.enumSchema(schema);

      break;
    }

    case 'union':
    case 'variant': {
      sh.unionSchema(schema);

      break;
    }

    case 'intersect': {
      sh.intersectSchema(schema);

      break;
    }

    case 'any':
    case 'unknown': {
      sh.anySchema(schema);
      break;
    }
    case 'undefined':
    case 'null': {
      sh.undefinedSchema(schema);
      break;
    }
    case 'string':
    case 'number':
    case 'boolean': {
      sh.basicSchema(schema);
      break;
    }
    case 'void':
    case 'never': {
      sh.voidSchema(schema);
      break;
    }
    case 'custom': {
      sh.customSchema(schema);
      break;
    }
    default: {
      sh.otherSchema(schema);
    }
  }
  sh.afterSchemaType(schema);
  sh.end(schemaOrPipe);
}
