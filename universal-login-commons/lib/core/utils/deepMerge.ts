export function deepMerge<T, U>(destination: T, source: U): T & U {
  const result = deepCopy(destination);
  for (const property in source) {
    if (isNotNullObject(source[property])) {
      result[property] = result[property] || {};
      result[property] = deepMerge(result[property], source[property]);
    } else {
      result[property] = source[property];
    }
  }
  return result;
}

export function isNotNullObject<T>(object: T): boolean {
  return typeof object === 'object' && object !== null;
}

export function deepCopy<T>(object: T) {
  return JSON.parse(JSON.stringify(object));
}
