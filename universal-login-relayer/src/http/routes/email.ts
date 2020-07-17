import {Router} from 'express';
import {asyncHandler, sanitize, responseOf} from '@restless/restless';
import {asString, asObject} from '@restless/sanitizers';
import {EmailConfirmationHandler} from '../../core/services/EmailConfirmationHandler';
import {asSerializableRequestedWallet, SerializableRequestedWallet} from '@unilogin/commons';

const emailConfirmationRequest = (emailConfirmationHandler: EmailConfirmationHandler) =>
  async (data: {body: SerializableRequestedWallet}) => {
    const {email, ensName} = data.body;
    const result = await emailConfirmationHandler.request(email, ensName);
    return responseOf({response: result}, 201);
  };

const emailConfirmationHandling = (emailConfirmationHandler: EmailConfirmationHandler) =>
  async (data: {body: {email: string, code: string}}) => {
    const {email, code} = data.body;
    await emailConfirmationHandler.confirm(email, code);
    return responseOf({response: email}, 201);
  };

export default (emailConfirmationHandler: EmailConfirmationHandler) => {
  const router = Router();

  router.post('/request', asyncHandler(
    sanitize({
      body: asSerializableRequestedWallet,
    }),
    emailConfirmationRequest(emailConfirmationHandler),
  ));

  router.post('/confirmation', asyncHandler(
    sanitize({
      body: asObject({
        email: asString,
        code: asString,
      }),
    }),
    emailConfirmationHandling(emailConfirmationHandler),
  ));

  return router;
};
