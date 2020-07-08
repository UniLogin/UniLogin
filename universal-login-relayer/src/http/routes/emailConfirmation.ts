import {Router} from 'express';
import {asyncHandler, sanitize, responseOf} from '@restless/restless';
import {asString, asObject} from '@restless/sanitizers';
import {EmailConfirmationHandler} from '../../core/services/EmailConfirmationHandler';

const emailConfirmationHandling = (emailConfirmationHandler: EmailConfirmationHandler) =>
  async (data: {body: {email: string, ensName: string}}) => {
    const {email, ensName} = data.body;
    const result = await emailConfirmationHandler.handle(email, ensName);
    return responseOf({response: result}, 201);
  };

export default (emailConfirmationHandler: EmailConfirmationHandler) => {
  const router = Router();

  router.post('/', asyncHandler(
    sanitize({
      body: asObject({
        ensName: asString,
        email: asString,
      }),
    }),
    emailConfirmationHandling(emailConfirmationHandler),
  ));

  return router;
};