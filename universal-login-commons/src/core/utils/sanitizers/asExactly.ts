import {Sanitizer, Result} from '@restless/sanitizers';

export const asExactly = <T>(expected: T): Sanitizer<T> => (value, path) => {
  if (value === expected) {
    return Result.ok(expected);
  } else {
    return Result.error([{path, expected: `exactly ${JSON.stringify(expected)}`}]);
  }
};
