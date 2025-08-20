import { BaseSchemaHandle } from './handle/schema-handle';
// 全局不变参数,
export interface ConvertOptions<Handle extends typeof BaseSchemaHandle = typeof BaseSchemaHandle> {
  /** 环境 */
  environments?: string[];
  /** 上下文 */
  context?: any;
  handle: Handle;
  // fieldConfig: T;
}
// 上下文,用于查询父级使用,只有array时会创建新的
