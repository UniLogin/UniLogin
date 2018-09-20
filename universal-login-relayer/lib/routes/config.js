import express from 'express';
import asyncMiddleware from '../middlewares/async_middleware';

export const network = (config) => async (req, res) => {
  res.status(200)
    .type('json')
    .send(JSON.stringify({config}));
};

export default (config) => {
  const router = new express.Router();

  router.get('/',
    asyncMiddleware(network(config)));

  return router;
};
