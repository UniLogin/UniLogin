export function isRunningInNode() {
  try {
    return (typeof process !== 'undefined') && ((process as any).release.name === 'node');
  } catch {
    return false;
  }
}
