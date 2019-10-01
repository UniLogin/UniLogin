import {Request} from 'express';
import geoip from 'geoip-lite';
import moment from 'moment';
import {DeviceInfo} from '@universal-login/commons';


export const getDeviceInfo = (req: Request, applicationName: string): DeviceInfo => {
  const ipAddress : string = req.headers['x-forwarded-for'] as string || req.ip;
  const {platform, os, browser} = req.useragent || {platform: '', os: '', browser: ''};
  return {
    ipAddress,
    name: platform,
    city: geoip.lookup(ipAddress) ? geoip.lookup(ipAddress).city : 'unknown',
    os,
    browser,
    time: moment().format('h:mm'),
  };
};
