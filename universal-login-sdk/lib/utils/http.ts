import {fetch} from './fetch';

const COMMON_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type HttpFunction = ReturnType<typeof http>;

export const http = (baseUrl: string) =>
  (method: HttpMethod, url: string, body?: any) =>
    fetch(`${baseUrl}${url}`, {
      method,
      headers: COMMON_HEADERS,
      body: body !== undefined
        ? JSON.stringify(body)
        : undefined
    }).then(handleApiResponse);

export async function handleApiResponse(res: Response) {
  return getResponseValue(res).then((value) => {
    if (res.ok) {
      return value;
    } else {
      throw value;
    }
  });
}

async function getResponseValue(res: Response) {
  return res.text().then((text) => {
    try {
      return JSON.parse(text);
    } catch (e) {
      return text;
    }
  });
}
