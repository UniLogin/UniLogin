export function deepMerge <T, U>(destination: T, source: U): T & U {
  const result = JSON.parse(JSON.stringify(destination));
  for (const property in source) {
     if (typeof source[property] === 'object' &&
       source[property] !== null) {
       result[property] = result[property] || {};
       result[property] = deepMerge(result[property], source[property]);
     } else {
       result[property] = source[property];
     }
  }
  return result;
}
