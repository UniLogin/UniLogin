import express from 'express';
import asyncMiddleware from '../middlewares/async_middleware';

export const request = (authorisationService) => async (req, res) => {
  const requestAuthorisation = req.body;
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
