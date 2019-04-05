import {Router, Request, Response} from 'express';
import asyncMiddleware from '../middlewares/async_middleware';
import geoip from 'geoip-lite';
import moment from 'moment';

export const request = (authorisationService : any) => async (req : Request, res : Response) => {
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
  const requestAuthorisation = {...req.body, deviceInfo};
  await authorisationService.addRequest(requestAuthorisation);
  res.status(201).send();
};

export const getPending = (authorisationService : any) => async (req : Request, res : Response) => {
  const {walletContractAddress} = req.params;
  const response = await authorisationService.getPendingAuthorisations(walletContractAddress);
  res.status(200)
    .type('json')
    .send(JSON.stringify({response}));
};

export const denyRequest = (authorisationService : any) => async (req : Request, res : Response) => {
  const {walletContractAddress} = req.params;
  const {key} = req.body;
  const response = await authorisationService.removeRequest(walletContractAddress, key);
  res.status(201)
    .type('json')
    .send(JSON.stringify({response}));
};

export default (authorisationService : any) => {
  const router = Router();

  router.post('/',
    asyncMiddleware(request(authorisationService)));

  router.get('/:walletContractAddress',
    asyncMiddleware(getPending(authorisationService)));

  router.post('/:walletContractAddress',
    asyncMiddleware(denyRequest(authorisationService)));

  return router;
};
