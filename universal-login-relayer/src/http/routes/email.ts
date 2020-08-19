import {Router} from 'express';
import {asyncHandler, sanitize, responseOf} from '@restless/restless';
import {asString, asObject} from '@restless/sanitizers';
import {asSerializableRequestedCreatingWallet, SerializableRequestedCreatingWallet} from '@unilogin/commons';
import {EmailConfirmationHandler} from '../../core/services/EmailConfirmationHandler';

const emailConfirmationRequest = (handler: EmailConfirmationHandler) =>
  async (data: {body: SerializableRequestedCreatingWallet}) => {
    const {email, ensName} = data.body;
    const result = await handler.requestCreating(email, ensName);
    return responseOf({email: result}, 201);
  };

const emailConfirmationForRestoreRequest = (emailConfirmationHandler: EmailConfirmationHandler) =>
  async (data: {body: {ensNameOrEmail: string}}) => {
    const {ensNameOrEmail} = data.body;
    const result = await emailConfirmationHandler.requestRestore(ensNameOrEmail);
    return responseOf({email: result}, 201);
  };

const emailConfirmationHandling = (emailConfirmationHandler: EmailConfirmationHandler) =>
  async (data: {body: {ensNameOrEmail: string, code: string}}) => {
    const {ensNameOrEmail, code} = data.body;
    await emailConfirmationHandler.confirm(ensNameOrEmail, code);
    return responseOf({ensNameOrEmail}, 201);
  };

export default (emailConfirmationHandler: EmailConfirmationHandler) => {
  const router = Router();

  router.post('/request/creating', asyncHandler(
    sanitize({
      body: asSerializableRequestedCreatingWallet,
    }),
    emailConfirmationRequest(emailConfirmationHandler),
  ));

  router.post('/request/restoring', asyncHandler(
    sanitize({
      body: asObject({
        ensNameOrEmail: asString,
      }),
    }),
    emailConfirmationForRestoreRequest(emailConfirmationHandler),
  ));

  router.post('/confirmation', asyncHandler(
    sanitize({
      body: asObject({
        ensNameOrEmail: asString,
        code: asString,
      }),
    }),
    emailConfirmationHandling(emailConfirmationHandler),
  ));

  return router;
};
