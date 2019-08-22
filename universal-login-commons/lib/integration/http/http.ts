const COMMON_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export const http = (fetch: (url: string, body?: any) => Promise<any>) => (baseUrl: string) =>
(method: HttpMethod, url: string, body?: any) =>
fetch(`${baseUrl}${url}`, {
  method,
  headers: COMMON_HEADERS,
  body: body !== undefined
  ? JSON.stringify(body)
  : undefined
}).then(handleApiResponse);

export type HttpFunction = ReturnType<ReturnType<typeof http>>;

export async function handleApiResponse(res: Response) {
  return getJsonOrText(res).then((value) => {
    if (res.ok) {
      return value;
    } else {
      throw value;
    }
  });
}

async function getJsonOrText(res: Response) {
  return res.text().then((text) => {
    try {
      return JSON.parse(text);
    } catch (e) {
      return text;
    }
  });
}
