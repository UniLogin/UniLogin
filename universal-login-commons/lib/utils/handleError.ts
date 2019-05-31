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
