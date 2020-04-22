import {http, HttpFunction, fetch} from '@unilogin/commons';
import {asString, cast} from '@restless/sanitizers';
import {IPGeolocationError} from '../../core/utils/errors';

export class IPGeolocationService {
  private readonly fetch: HttpFunction;

  constructor(apiBaseUrl: string, private apiAccessKey: string) {
    this.fetch = http(fetch)(apiBaseUrl);
  }

  async getCountryCode(): Promise<string> {
    try {
      const path = `/country_code?api-key=${this.apiAccessKey}`;
      const response = await this.fetch('GET', path, undefined, {Accept: 'application/json'});
      const checkResponse = cast(response, asString);
      return checkResponse;
    } catch (err) {
      throw new IPGeolocationError('Failed to establish user\'s country', err);
    }
  }
}
