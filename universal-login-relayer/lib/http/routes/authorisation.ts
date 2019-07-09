import {Router, Request} from 'express';
import AuthorisationService, {AuthorisationRequest} from '../../integration/sql/services/authorisationService';
import {asyncHandler, sanitize, responseOf, asString, asObject} from '@restless/restless';
import {getDeviceInfo} from '../utils/getDeviceInfo';
import {recoverFromCancelAuthorisationRequest, CancelAuthorisationRequest, hashCancelAuthorisationRequest} from '@universal-login/commons';
import { ethers, providers} from 'ethers';
import WalletMasterWithRefund from '@universal-login/contracts/build/WalletMasterWithRefund.json';
import { UnauthorisedAddress } from '../../core/utils/errors';
import { asCancelAuthorisationRequest } from '../utils/sanitizers';


const request = (authorisationService : AuthorisationService) =>
  async (data: {body: {key: string, walletContractAddress: string}}, req: Request) => {
    const requestAuthorisation: AuthorisationRequest = {...data.body, deviceInfo: getDeviceInfo(req)};
    const result = await authorisationService.addRequest(requestAuthorisation);
    return responseOf({response: result}, 201);
  };

const getPending = (authorisationService : AuthorisationService) =>
  async (data: {walletContractAddress: string}) => {
    const result = await authorisationService.getPendingAuthorisations(data.walletContractAddress);
    return responseOf({ response: result });
  };

const denyRequest = (authorisationService : AuthorisationService, provider: providers.Provider) =>
  async (data: {body: {cancelAuthorisationRequest: CancelAuthorisationRequest}}) => {
    const recoveredAddress = recoverFromCancelAuthorisationRequest(data.body.cancelAuthorisationRequest);
    const {walletContractAddress, publicKey, signature} = data.body.cancelAuthorisationRequest;

    const contract = new ethers.Contract(walletContractAddress, WalletMasterWithRefund.interface, provider);
    const payloadDigest = hashCancelAuthorisationRequest(data.body.cancelAuthorisationRequest);
    const isCorrectAddress = await contract.isValidSignature(payloadDigest, signature);
    if (!isCorrectAddress) {
      throw new UnauthorisedAddress(recoveredAddress);
    }

    const result = await authorisationService.removeRequest(walletContractAddress, publicKey);
    return responseOf(result, 204);
  };

export default (authorisationService : AuthorisationService, provider: any) => {
  const router = Router();

  router.post('/', asyncHandler(
    sanitize({
      body: asObject({
        walletContractAddress: asString,
        key: asString
      })
    }),
    request(authorisationService)
  ));

  router.get('/:walletContractAddress', asyncHandler(
    sanitize({
      walletContractAddress: asString,
    }),
    getPending(authorisationService)
  ));

  router.post('/:walletContractAddress', asyncHandler(
    sanitize({
      body: asObject({
        cancelAuthorisationRequest: asCancelAuthorisationRequest
      })
    }),
    denyRequest(authorisationService, provider)
  ));

  return router;
};

