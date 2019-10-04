import {Request} from 'express';
import geoip from 'geoip-lite';
import moment from 'moment';
import {DeviceInfo, ApplicationInfo} from '@universal-login/commons';


export const getDeviceInfo = (req: Request, {applicationName, logo, type}: ApplicationInfo): DeviceInfo => {
  const ipAddress : string = req.headers['x-forwarded-for'] as string || req.ip;
  const {platform, os, browser} = req.useragent || {platform: '', os: '', browser: ''};
  return {
    ipAddress,
    applicationName,
    platform,
    city: geoip.lookup(ipAddress) ? geoip.lookup(ipAddress).city : 'unknown',
    os,
    browser,
    time: moment().format('h:mm'),
    logo,
    type
  };
};
