import express from 'express';
import asyncMiddleware from '../middlewares/async_middleware';

export const create = (identityService) => async (req, res) => {
  const content = identityService.create();
  res.status(201)
    .type('json')
    .send(JSON.stringify(content));
};

export const execute = (identityService) => async (req, res) => {
  const content = identityService.execute();
  res.status(201)
    .type('json')
    .send(JSON.stringify(content));
};

export default (identityService) => {
  const router = new express.Router();

  router.post('/',
    asyncMiddleware(create(identityService)));

  router.post('/execute',
    asyncMiddleware(execute(identityService)));

  return router;
};
