import {expect} from 'chai';
import {getDeviceInfo} from '../../../src/http/utils/getDeviceInfo';
import {TEST_APPLICATION_INFO, DeviceType} from '@unilogin/commons';

describe('UNIT: getDeviceInfo', () => {
  const req = {
    headers: {'x-forwarded-for': '0.0.0.0'},
    useragent: {
      os: 'unknown',
      platform: 'unknown',
      browser: 'unknown',
      source: '',
    },
  } as any;

  it('iOS/Evidance', () => {
    req.useragent.source = 'deecert/4 CFNetwork/1098.7 Darwin/18.7.0';
    const appInfo = {applicationName: 'Evidance', type: 'phone' as DeviceType, logo: 'none'};
    const deviceInfo = getDeviceInfo(req, appInfo);
    expect(deviceInfo).to.deep.eq(
      {
        ipAddress: '0.0.0.0',
        applicationName: 'Evidance',
        platform: 'unknown',
        city: 'unknown',
        os: 'iOS',
        browser: 'unknown',
        time: deviceInfo.time,
        logo: 'none',
        type: 'phone',
      },
    );
  });

  it('OSX/Chrome/Jarvis', () => {
    req.useragent = {
      source: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
      os: 'Mac OS',
      platform: 'OSX',
      browser: 'Mozilla',
    };
    const appInfo = {applicationName: 'Jarvis', type: 'laptop' as DeviceType, logo: 'none'};
    const deviceInfo = getDeviceInfo(req, appInfo);
    expect(deviceInfo).to.deep.eq(
      {
        ipAddress: '0.0.0.0',
        applicationName: 'Jarvis',
        platform: 'OSX',
        city: 'unknown',
        os: 'Mac OS',
        browser: 'Mozilla',
        time: deviceInfo.time,
        logo: 'none',
        type: 'laptop',
      },
    );
  });

  it('Test getDeviceInfo', () => {
    const req = {
      headers: {
        'x-forwarded-for': '::ffff:127.0.0.1',
      },
      useragent: {
        platform: 'AppleOS',
        os: 'MacOS',
        browser: 'Chrome',
      },
    };

    const result = getDeviceInfo(req as any, TEST_APPLICATION_INFO);
    const expectedResult = {
      ipAddress: '::ffff:127.0.0.1',
      ...TEST_APPLICATION_INFO,
      platform: 'AppleOS',
      city: 'unknown',
      os: 'MacOS',
      browser: 'Chrome',
      time: '10:22',
    };
    result.time = expectedResult.time;

    expect(expectedResult).to.deep.eq(result);
  });

  it('Test getDeviceInfo with real ip', () => {
    const req = {
      headers: {
        'x-forwarded-for': '::ffff:63.141.56.121',
      },
      useragent: {
        platform: 'AppleOS',
        os: 'MacOS',
        browser: 'Chrome',
      },
    };

    const result = getDeviceInfo(req as any, TEST_APPLICATION_INFO);
    const expectedResult = {
      ...TEST_APPLICATION_INFO,
      ipAddress: '::ffff:63.141.56.121',
      platform: 'AppleOS',
      city: 'San Francisco',
      os: 'MacOS',
      browser: 'Chrome',
      time: '10:22',
    };
    result.time = expectedResult.time;

    expect(expectedResult).to.deep.eq(result);
  });
});
