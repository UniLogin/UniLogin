import {Request} from 'express';
import geoip from 'geoip-lite';
import moment from 'moment';
import {AuthorisationRequest} from '../services/authorisationService';


export const createAuthorisationRequest = (data: {body: {key: string, walletContractAddress: string}}, req: Request): AuthorisationRequest => {
  const ipAddress : string = req.headers['x-forwarded-for'] as string || req.ip;
  const {platform, os, browser} = req.useragent || {platform: '', os: '', browser: ''};
  const deviceInfo = {
    ipAddress,
    name: platform,
    city: geoip.lookup(ipAddress) ? geoip.lookup(ipAddress).city : 'unknown',
    os,
    browser,
    time: moment().format('h:mm'),
  };
  return {...data.body, deviceInfo};
};
