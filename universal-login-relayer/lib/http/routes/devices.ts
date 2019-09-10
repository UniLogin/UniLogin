import {Router} from 'express';
import {asyncHandler, sanitize, responseOf} from '@restless/restless';
import {asString, asObject} from '@restless/sanitizers';

const getDevices = async () => {
  const result = [{}, {}];
  return responseOf({response: result}, 201);
};

export default () => {
  const router = Router();

  router.get('/:contractAddress', asyncHandler(
  sanitize({
    contractAddress: asString,
    query: asObject({
      signature: asString
    })
  }),
  getDevices
  ));
  return router;
};
