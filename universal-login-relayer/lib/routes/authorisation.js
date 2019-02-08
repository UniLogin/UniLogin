import express from 'express';
import asyncMiddleware from '../middlewares/async_middleware';
import geoip from 'geoip-lite';
import moment from 'moment';

export const request = (authorisationService) => async (req, res) => {
  const ipAddress = req.headers['x-forwarded-for'] || req.ip;
  const deviceInfo = {
    ipAddress,
    name: req.useragent.platform,
    city: geoip.lookup(ipAddress) ? geoip.lookup(ipAddress).city : 'unknown',
    os: req.useragent.os,
    browser: req.useragent.browser,
    time: moment().format('h:mm'),
  };
  const requestAuthorisation = {...req.body, deviceInfo};
  await authorisationService.addRequest(requestAuthorisation);
  res.status(201)
    .type('json')
    .send(JSON.stringify());
};

export const getPending = (authorisationService) => async (req, res) => {
  const {identityAddress} = req.params;
  const response = await authorisationService.getPendingAuthorisations(identityAddress);
  res.status(200)
    .type('json')
    .send(JSON.stringify({response}));
};

export const denyRequest = (authorisationService) => async (req, res) => {
  const {identityAddress} = req.params;
  const {key} = req.body;
  const response = await authorisationService.removeRequest(identityAddress, key);
  res.status(201)
    .type('json')
    .send(JSON.stringify({response}));
};

export default (authorisationService) => {
  const router = new express.Router();

  router.post('/',
    asyncMiddleware(request(authorisationService)));

  router.get('/:identityAddress',
    asyncMiddleware(getPending(authorisationService)));

  router.post('/:identityAddress',
    asyncMiddleware(denyRequest(authorisationService)));

  return router;
};
