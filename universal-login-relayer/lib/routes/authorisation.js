import express from 'express';
import asyncMiddleware from '../middlewares/async_middleware';
import geoip from 'geoip-lite';


export const request = (authorisationService) => async (req, res) => {
  const label = {
    ipAddress: req.ip,
    name: req.useragent.platform,
    city: geoip.lookup(req.ip) ? geoip.lookup(req.ip).city : '',
    os: req.useragent.os,
    browser: req.useragent.browser,
    time: (new Date()).toLocaleTimeString()
  };
  const requestAuthorisation = {...req.body, label};
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
