export function isRunningInNode() {
  return (typeof process !== 'undefined') && ((process as any).release.name === 'node');
}
