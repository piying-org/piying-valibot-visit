import * as v from 'valibot';

import { asControl, getSchemaByIssuePath } from '@piying/valibot-visit';
import { expect } from 'chai';

describe('查询异常', () => {
  it('查询异常-基础', async () => {
    const k1Schema = v.pipe(v.string(), v.title('v1'));
    const schema = v.object({
      o1: v.object({ k1: k1Schema }),
    });
    const result = v.safeParse(schema, { o1: {} });
    if (!result.success) {
      const issue = result.issues[0];

      const querySchema = getSchemaByIssuePath(schema, issue.path!);
      expect(querySchema).eq(k1Schema);
      return;
    } else {
      throw new Error('不可能成功');
    }
  });
  it('tuple', async () => {
    const k1Schema = v.pipe(v.string(), v.title('v1'));
    const schema = v.object({
      o1: v.tuple([k1Schema]),
    });
    const result = v.safeParse(schema, { o1: [] });
    if (!result.success) {
      const issue = result.issues[0];

      const querySchema = getSchemaByIssuePath(schema, issue.path!);
      expect(querySchema).eq(k1Schema);
      return;
    } else {
      throw new Error('不可能成功');
    }
  });
  it('intersect', async () => {
    const k1Schema = v.pipe(v.string(), v.title('v1'));
    const schema = v.object({
      o1: v.intersect([v.object({ k1: k1Schema })]),
    });
    const result = v.safeParse(schema, { o1: {} });
    if (!result.success) {
      const issue = result.issues[0];
      const querySchema = getSchemaByIssuePath(schema, issue.path!);
      expect(querySchema).eq(k1Schema);
      return;
    } else {
      throw new Error('不可能成功');
    }
  });
  it('union', async () => {
    const k1Schema = v.pipe(v.string(), v.title('v1'));
    const schema = v.object({
      o1: v.union([v.object({ k1: k1Schema })]),
    });
    const result = v.safeParse(schema, { o1: {} });
    if (!result.success) {
      const issue = result.issues[0];
      const querySchema = getSchemaByIssuePath(schema, issue.path!);
      expect(querySchema).eq(k1Schema);
      return;
    } else {
      throw new Error('不可能成功');
    }
  });
  it('array', async () => {
    const k1Schema = v.pipe(v.string(), v.title('v1'));
    const schema = v.object({
      o1: v.array(k1Schema),
    });
    const result = v.safeParse(schema, { o1: [1] });
    if (!result.success) {
      const issue = result.issues[0];
      const querySchema = getSchemaByIssuePath(schema, issue.path!);
      expect(querySchema).eq(k1Schema);
      return;
    } else {
      throw new Error('不可能成功');
    }
  });
  it('array-object', async () => {
    const k1Schema = v.pipe(v.string(), v.title('v1'));
    const schema = v.object({
      o1: v.array(v.object({ o2: k1Schema })),
    });
    const result = v.safeParse(schema, { o1: [{ o2: 1 }] });
    if (!result.success) {
      const issue = result.issues[0];
      const querySchema = getSchemaByIssuePath(schema, issue.path!);
      expect(querySchema).eq(k1Schema);
      return;
    } else {
      throw new Error('不可能成功');
    }
  });
  it('中间路径带optional', async () => {
    const k1Schema = v.pipe(v.string(), v.title('v1'));
    const schema = v.object({
      o1: v.optional(v.array(v.object({ o2: k1Schema }))),
    });
    const result = v.safeParse(schema, { o1: [{ o2: 1 }] });
    if (!result.success) {
      const issue = result.issues[0];
      const querySchema = getSchemaByIssuePath(schema, issue.path!);
      expect(querySchema).eq(k1Schema);
      return;
    } else {
      throw new Error('不可能成功');
    }
  });
  it('末尾带optional', async () => {
    const k1Schema = v.optional(v.pipe(v.string(), v.title('v1')));
    const schema = v.object({
      o1: v.optional(v.array(v.object({ o2: k1Schema }))),
    });
    const result = v.safeParse(schema, { o1: [{ o2: 1 }] });
    if (!result.success) {
      const issue = result.issues[0];
      const querySchema = getSchemaByIssuePath(schema, issue.path!);
      expect(querySchema).eq(k1Schema);
      return;
    } else {
      throw new Error('不可能成功');
    }
  });
  it('asControl终止', async () => {
    const k1Schema = v.optional(
      v.pipe(v.object({ k1: v.pipe(v.string()) }), asControl(), v.title('v1')),
    );
    const schema = v.object({
      o1: v.object({ o2: k1Schema }),
    });
    const result = v.safeParse(schema, { o1: { o2: {} } });
    if (!result.success) {
      const issue = result.issues[0];
      const querySchema = getSchemaByIssuePath(schema, issue.path!);
      expect(querySchema).eq(k1Schema);
      return;
    } else {
      throw new Error('不可能成功');
    }
  });
});
