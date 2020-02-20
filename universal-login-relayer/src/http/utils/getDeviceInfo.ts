import {Request} from 'express';
import geoip from 'geoip-lite';
import moment from 'moment';
import {UAParser} from 'ua-parser-js';
import {DeviceInfo, ApplicationInfo} from '@unilogin/commons';

export const getDeviceInfo = (req: Request, {applicationName, logo, type}: ApplicationInfo): DeviceInfo => {
  const ipAddress: string = req.headers['x-forwarded-for'] as string || req.ip;
  const {platform, os, browser} = req.useragent || {platform: '', os: '', browser: ''};
  const parse2 = new UAParser((req.useragent && req.useragent.source) || '');
  return {
    ipAddress,
    applicationName,
    platform,
    city: geoip.lookup(ipAddress) ? geoip.lookup(ipAddress).city : 'unknown',
    os: (os !== 'unknown' && os ? os : parse2.getOS().name) || 'unknown',
    browser,
    time: moment().format('h:mm'),
    logo,
    type,
  };
};
