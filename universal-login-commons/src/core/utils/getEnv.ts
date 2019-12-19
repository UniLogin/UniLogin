export function getEnv(key: string, fallback?: string) {
  const value = process.env[key];
  if (typeof value !== 'string') {
    if (fallback !== undefined) {
      return fallback;
    } else {
      throw new TypeError(`Missing environment variable: ${key}`);
    }
  } else {
    return value;
  }
}
