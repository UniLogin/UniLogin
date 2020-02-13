export function parseQuery(query: string): Record<string, string> {
  const decodedQuery = decodeURIComponent(query);
  if (decodedQuery.startsWith('?')) {
    return parseQuery(decodedQuery.slice(1));
  }
  const result: Record<string, string> = {};
  decodedQuery
    .split('&')
    .map(pair => {
      const [key, ...rest] = pair.split('=');
      return [decodeURIComponent(key), decodeURIComponent(rest?.join('=') ?? 'true')];
    })
    .forEach((element: string[]) => {
      result[element[0]] = element[1];
    });
  return result;
}
