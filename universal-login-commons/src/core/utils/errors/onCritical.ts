export function onCritical(err: Error) {
  console.error(err);
  process.exit(1);
}
