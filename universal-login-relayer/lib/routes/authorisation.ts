import {Router, Request, Response} from 'express';
import asyncMiddleware from '../middlewares/async_middleware';
import geoip from 'geoip-lite';
import moment from 'moment';
import AuthorisationService from '../services/authorisationService';
import {asyncHandler, responseOf, sanitize, asString} from '@restless/restless';

const request = (authorisationService : AuthorisationService, walletContractAddress: string, key: string) => async (req : Request, res : Response) => {
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
  const requestAuthorisation = {walletContractAddress, key, deviceInfo};
  await authorisationService.addRequest(requestAuthorisation);
  res.status(201).send();
};

const getPending = (authorisationService : any, walletContractAddress: string) =>
  async (req : Request, res : Response) => {
    const response = await authorisationService.getPendingAuthorisations(walletContractAddress);
    res.status(200)
      .type('json')
      .send(JSON.stringify({response}));
  };

const denyRequest = (authorisationService : any, walletContractAddress: string, key: string) =>
  async (req : Request, res : Response) => {
    await authorisationService.removeRequest(walletContractAddress, key);
    res.status(204)
      .type('json')
      .send();
  };

export default (authorisationService : any) => {
  const router = Router();

  router.post('/', asyncHandler(
    sanitize({
      walletContractAddress: asString,
      key: asString
    }),
    ({walletContractAddress, key}) =>
      responseOf(asyncMiddleware(request(authorisationService, walletContractAddress, key)))));

  router.get('/:walletContractAddress', asyncHandler(
    sanitize({
      walletContractAddress: asString
    }),
    ({walletContractAddress}) =>
      responseOf(asyncMiddleware(getPending(authorisationService, walletContractAddress)))
  ));

  router.post('/:walletContractAddress', asyncHandler(
    sanitize({
      walletContractAddress: asString,
      key: asString
    }),
    ({walletContractAddress, key}) =>
      responseOf(asyncMiddleware(denyRequest(authorisationService, walletContractAddress, key)))
  ));

  return router;
};
