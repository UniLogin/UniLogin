import {http, HttpFunction} from '@universal-login/commons';
import {fetch} from './fetch';
import {asObject, asString, cast} from '@restless/sanitizers';
import {IPGeolocationError} from '../../core/utils/errors';

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
    try {
      const path = `/check?access_key=${this.apiAccessKey}&fields=country_code`;
      const response = await this.fetch('GET', path, undefined, {Accept: 'application/json'});
      const checkResponse = cast(response, asCheckRequestResponse);
      return checkResponse.country_code;
    } catch (err) {
      throw new IPGeolocationError(`Failed to establish user's country`, err);
    }
  }
}
