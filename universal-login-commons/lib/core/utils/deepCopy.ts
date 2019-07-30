export function deepCopy<T>(object: T) {
  return JSON.parse(JSON.stringify(object));
}
