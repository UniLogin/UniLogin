import {Request} from 'express';
import geoip from 'geoip-lite';
import moment from 'moment';
import {DeviceInfo, ApplicationInfo} from '@universal-login/commons';
// @ts-ignore
import UAParser from 'ua-parser-js';

export const getDeviceInfo = (req: Request, {applicationName, logo, type}: ApplicationInfo): DeviceInfo => {
  const ipAddress : string = req.headers['x-forwarded-for'] as string || req.ip;
  const {platform, os, browser} = req.useragent || {platform: '', os: '', browser: ''};
  const parse2 = UAParser(req.useragent && req.useragent.source || '');
  return {
    ipAddress,
    applicationName,
    platform,
    city: geoip.lookup(ipAddress) ? geoip.lookup(ipAddress).city : 'unknown',
    os: (os !== 'unknown' ? os : parse2.os.name) || 'unknown',
    browser,
    time: moment().format('h:mm'),
    logo,
    type
  };
};
