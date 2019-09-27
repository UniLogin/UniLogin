import {Router, Request} from 'express';
import {asyncHandler, sanitize, responseOf} from '@restless/restless';
import {asString, asObject} from '@restless/sanitizers';
import {asEthAddress} from '@restless/ethereum';
import {RelayerRequest} from '@universal-login/commons';
import {getDeviceInfo} from '../utils/getDeviceInfo';
import {asRelayerRequest} from '../utils/sanitizers';
import AuthorisationService from '../../core/services/AuthorisationService';
import {AddAuthorisationRequest} from '../../core/models/AddAuthorisationRequest';


const request = (authorisationService: AuthorisationService) =>
  async (data: {body: {key: string, walletContractAddress: string}}, req: Request) => {
    const addAuthorisationRequest: AddAuthorisationRequest = {...data.body, deviceInfo: getDeviceInfo(req)};
    const result = await authorisationService.addRequest(addAuthorisationRequest);
    return responseOf({response: result}, 201);
  };

const getPending = (authorisationService: AuthorisationService) =>
  async (data: {contractAddress: string,  query: {signature: string}}) => {
    const authorisationRequest: RelayerRequest = {
      contractAddress: data.contractAddress,
      signature: data.query.signature
    };
    const result = await authorisationService.getAuthorisationRequests(authorisationRequest);
    return responseOf({response: result});
  };

const denyRequest = (authorisationService: AuthorisationService) =>
  async (data: {body: {authorisationRequest: RelayerRequest}}) => {
    const result = await authorisationService.removeAuthorisationRequests(data.body.authorisationRequest);
    return responseOf(result, 204);
  };

const cancelRequest = (authorisationService: AuthorisationService) =>
  async (data: {body: {authorisationRequest: RelayerRequest}}) => {
    const result = await authorisationService.cancelAuthorisationRequest(data.body.authorisationRequest);
    const httpCode = result === 0 ? 404 : 204;
    return responseOf({response: result}, httpCode);
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
        authorisationRequest: asRelayerRequest
      })
    }),
    denyRequest(authorisationService)
  ));

  router.delete('/:contractAddress', asyncHandler(
    sanitize({
      body: asObject({
        authorisationRequest: asRelayerRequest
      })
    }),
    cancelRequest(authorisationService)
  ));

  return router;
};

