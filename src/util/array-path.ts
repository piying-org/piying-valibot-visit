export function arrayPath(path: any) {
  return Array.isArray(path) ? path : [path];
}
