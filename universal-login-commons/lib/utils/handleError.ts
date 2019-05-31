export function onCritical(err: Error) {
  console.error(err);
  process.exit(1);
}

export function ensure(condition: boolean, error: any, ...errorArgs: any) {
  if (!condition) {
    throw new error(...errorArgs);
  }
}
