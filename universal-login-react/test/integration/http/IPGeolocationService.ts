import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import nock from 'nock';
import {IPGeolocationService} from '../../../src/integration/http/IPGeolocationService';
import {IPGeolocationError} from '../../../src/core/utils/errors';

chai.use(chaiAsPromised);

describe('IPGeolocationService', function () {
  const baseUrl = 'http://example.com';

  let service: IPGeolocationService;

  beforeEach(function () {
    service = new IPGeolocationService(baseUrl, 'ABCD');
  });

  describe('getCountryCode', function () {
    it('makes a correct request and returns country code', async function () {
      nock(baseUrl)
        .get('/check?access_key=ABCD&fields=country_code')
        .reply(200, {country_code: 'PL'});

      await expect(service.getCountryCode()).to.eventually.eq('PL');
    });

    it('throws error in case of invalid response', async function () {
      nock(baseUrl)
        .get('/check?access_key=ABCD&fields=country_code')
        .reply(200, {country_code: null});

      await expect(service.getCountryCode()).to.be.rejectedWith(IPGeolocationError);
    });
  });
});
