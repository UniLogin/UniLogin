import {http, HttpFunction} from '@universal-login/commons';
import {fetch} from './fetch';
import {asObject, asString, cast} from '@restless/sanitizers';

interface CheckRequestResponse {
  country_code: string;
}

const asCheckRequestResponse = asObject<CheckRequestResponse>({
  country_code: asString
});

export class IPGeolocationService {
  private readonly fetch: HttpFunction;

  constructor(apiBaseUrl: string, private apiAccessKey: string) {
    this.fetch = http(fetch)(apiBaseUrl);
  }

  async getCountryCode(): Promise<string> {
    const path = `/check?access_key=${this.apiAccessKey}&fields=country_code`;
    const response = await this.fetch('GET', path, undefined, {Accept: 'application/json'});
    const checkResponse = cast(response, asCheckRequestResponse);
    return checkResponse.country_code;
  }
}
