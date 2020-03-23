export function parseQuery(query: string): Record<string, string> {
  const sanitizedQuery = query.startsWith('?') ? query.slice(1) : query;
  return fromEntries(
    sanitizedQuery
      .split('&')
      .map(pair => {
        const [key, ...rest] = pair.split('=');
        return [decodeURIComponent(key), decodeURIComponent(rest?.join('=') ?? 'true')];
      }),
  );
}

function fromEntries<K extends keyof any, V>(entries: [K, V][]): Record<K, V> {
  const res: Record<K, V> = {} as any;
  for (const [key, value] of entries) {
    res[key] = value;
  }
  return res;
}
