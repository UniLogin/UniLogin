import {Router, Request, Response} from 'express';
import geoip from 'geoip-lite';
import moment from 'moment';
import AuthorisationService from '../services/authorisationService';
import {asyncHandler, sanitize, responseOf, asString, asObject} from '@restless/restless';

const request = (authorisationService : AuthorisationService) => async (data: {body: {key: string, walletContractAddress: string}}, req: Request) => {
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
  const requestAuthorisation = {...data.body, deviceInfo};
  const result = await authorisationService.addRequest(requestAuthorisation);
  return responseOf({response: result}, 201);
}

const getPending = (authorisationService : any) => async (data: {walletContractAddress: string}) => {
  const result = await authorisationService.getPendingAuthorisations(data.walletContractAddress);
  return responseOf({ response: result });
};

const denyRequest = (authorisationService : any) => async (data: {walletContractAddress: string, body: {key: string}}) => {
  const result = await authorisationService.removeRequest(data.walletContractAddress, data.body.key);
  return responseOf(result, 204);
};

export default (authorisationService : AuthorisationService) => {
  const router = Router();

  router.post('/', asyncHandler(
    sanitize({
      body: asObject({
        walletContractAddress: asString,
        key: asString
      })
    }),
    request(authorisationService)
  ));

  router.get('/:walletContractAddress', asyncHandler(
    sanitize({
      walletContractAddress: asString,
    }),
    getPending(authorisationService)
  ));

  router.post('/:walletContractAddress', asyncHandler(
    sanitize({
      walletContractAddress: asString,
      body: asObject({
        key: asString
      })
    }),
    denyRequest(authorisationService)
  ));

  return router;
};

