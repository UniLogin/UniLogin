export function onCritical(err: Error) {
  console.error(err);
  process.exit(1);
}

interface ErrorConstructor<T extends any[]> {
  new (...args: T): Error;
}

export function ensure<T extends any[]>(condition: boolean, error: ErrorConstructor<T>, ...errorArgs: T) {
  if (!condition) {
    throw new error(...errorArgs);
  }
}

export function ensureNotNull<T extends any[]>(value: unknown | null, error: ErrorConstructor<T>, ...errorArgs: T) {
  return ensure(!!value, error, ...errorArgs);
}

export function ensureNotEmpty<T extends any[]>(object: object, error: ErrorConstructor<T>, ...errorArgs: T) {
  return ensure((Object.entries(object).length !== 0), error, ...errorArgs);
}
