import {expect} from 'chai';
import {getDeviceInfo} from '../../../../lib/http/utils/getDeviceInfo';
import {TEST_APPLICATION_NAME} from '@universal-login/commons';

describe('UNIT: Http utils test', async () => {
  const applicationName = TEST_APPLICATION_NAME;

  it('Test getDeviceInfo', async () => {
    const req = {
      headers: {
        'x-forwarded-for': '::ffff:127.0.0.1'
      },
      useragent: {
        platform: 'AppleOS',
        os: 'MacOS',
        browser: 'Chrome'
      }
    };

    const result = getDeviceInfo(req as any, applicationName);
    const expectedResult = {
      ipAddress: '::ffff:127.0.0.1',
      applicationName,
      platform: 'AppleOS',
      city: 'unknown',
      os: 'MacOS',
      browser: 'Chrome',
      time: '10:22'
    };
    result.time = expectedResult.time;

    expect(expectedResult).to.deep.equal(result);
  });

  it('Test getDeviceInfo with real ip', async () => {
    const req = {
      headers: {
        'x-forwarded-for': '::ffff:63.141.56.121'
      },
      useragent: {
        platform: 'AppleOS',
        os: 'MacOS',
        browser: 'Chrome'
      }
    };

    const result = getDeviceInfo(req as any, applicationName);
    const expectedResult = {
      ipAddress: '::ffff:63.141.56.121',
      applicationName,
      platform: 'AppleOS',
      city: 'San Francisco',
      os: 'MacOS',
      browser: 'Chrome',
      time: '10:22'
    };
    result.time = expectedResult.time;

    expect(expectedResult).to.deep.equal(result);
  });
});
