import {Router, Request} from 'express';
import {AddAuthorisationRequest} from '../../integration/sql/services/AuthorisationStore';
import {asyncHandler, sanitize, responseOf} from '@restless/restless';
import {asString, asObject} from '@restless/sanitizers';
import {asEthAddress} from '@restless/ethereum';
import {getDeviceInfo} from '../utils/getDeviceInfo';
import {AuthorisationRequest} from '@universal-login/commons';
import {asAuthorisationRequest} from '../utils/sanitizers';
import AuthorisationService from '../../core/services/AuthorisationService';


const request = (authorisationService: AuthorisationService) =>
  async (data: {body: {key: string, walletContractAddress: string}}, req: Request) => {
    const addAuthorisationRequest: AddAuthorisationRequest = {...data.body, deviceInfo: getDeviceInfo(req)};
    const result = await authorisationService.addRequest(addAuthorisationRequest);
    return responseOf({response: result}, 201);
  };

const getPending = (authorisationService: AuthorisationService) =>
  async (data: {contractAddress: string,  query: {signature: string}}) => {
    const authorisationRequest: AuthorisationRequest = {
      contractAddress: data.contractAddress,
      signature: data.query.signature
    };
    const result = await authorisationService.getAuthorisationRequests(authorisationRequest);
    return responseOf({response: result});
  };

const denyRequest = (authorisationService: AuthorisationService) =>
  async (data: {body: {authorisationRequest: AuthorisationRequest}}) => {
    const result = await authorisationService.removeAuthorisationRequest(data.body.authorisationRequest);
    return responseOf(result, 204);
  };

const cancelRequest = (authorisationService: AuthorisationService) =>
  async (data: {body: {authorisationRequest: AuthorisationRequest}}) => {
    const result = await authorisationService.cancelAuthorisationRequest(data.body.authorisationRequest);
    const httpCode = result === 0 ? 401 : 204;
    return responseOf(result, httpCode);
  };

export default (authorisationService: AuthorisationService) => {
  const router = Router();

  router.post('/', asyncHandler(
    sanitize({
      body: asObject({
        walletContractAddress: asEthAddress,
        key: asString
      })
    }),
    request(authorisationService)
  ));

  router.get('/:contractAddress', asyncHandler(
    sanitize({
      contractAddress: asString,
      query: asObject({
        signature: asString
      })
    }),
    getPending(authorisationService)
  ));

  router.post('/:contractAddress', asyncHandler(
    sanitize({
      body: asObject({
        authorisationRequest: asAuthorisationRequest
      })
    }),
    denyRequest(authorisationService)
  ));

  router.delete('/:walletContractAddress', asyncHandler(
    sanitize({
      body: asObject({
        authorisationRequest: asAuthorisationRequest
      })
    }),
    cancelRequest(authorisationService)
  ));

  return router;
};

