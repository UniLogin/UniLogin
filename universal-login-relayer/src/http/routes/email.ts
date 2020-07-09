import {Router} from 'express';
import {asyncHandler, sanitize, responseOf} from '@restless/restless';
import {asString, asObject} from '@restless/sanitizers';
import {EmailConfirmationHandler} from '../../core/services/EmailConfirmationHandler';

const emailConfirmationRequest = (emailConfirmationHandler: EmailConfirmationHandler) =>
  async (data: {body: {email: string, ensName: string}}) => {
    const {email, ensName} = data.body;
    const result = await emailConfirmationHandler.request(email, ensName);
    return responseOf({response: result}, 201);
  };

export default (emailConfirmationHandler: EmailConfirmationHandler) => {
  const router = Router();

  router.post('/request', asyncHandler(
    sanitize({
      body: asObject({
        ensName: asString,
        email: asString,
      }),
    }),
    emailConfirmationRequest(emailConfirmationHandler),
  ));

  return router;
};
