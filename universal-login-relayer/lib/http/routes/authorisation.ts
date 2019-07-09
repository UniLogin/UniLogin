import {Router, Request} from 'express';
import AuthorisationService, {AuthorisationRequest} from '../../integration/sql/services/authorisationService';
import {asyncHandler, sanitize, responseOf, asString, asObject} from '@restless/restless';
import {getDeviceInfo} from '../utils/getDeviceInfo';
import {recoverFromCancelAuthorisationRequest, CancelAuthorisationRequest, hashCancelAuthorisationRequest} from '@universal-login/commons';
import { ethers, providers, utils} from 'ethers';
import WalletMasterWithRefund from '@universal-login/contracts/build/WalletMasterWithRefund.json';
import { UnauthorisedAddress } from '../../core/utils/errors';
import { asSignature } from '../utils/sanitizers';


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
  async (data: {walletContractAddress: string, body: {publicKey: string, signature: utils.Signature}}) => {
    const {walletContractAddress} = data;
    const {publicKey, signature} = data.body;

    const cancelAuthorisationRequest: CancelAuthorisationRequest = {walletContractAddress, publicKey};
    const recoveredAddress = recoverFromCancelAuthorisationRequest(cancelAuthorisationRequest, signature);

    const contract = new ethers.Contract(walletContractAddress, WalletMasterWithRefund.interface, provider);
    const flatSignature = ethers.utils.joinSignature(signature);
    const payloadDigest = hashCancelAuthorisationRequest(cancelAuthorisationRequest);
    const isCorrectAddress = await contract.isValidSignature(payloadDigest, flatSignature);
    if (!isCorrectAddress) {
      throw new UnauthorisedAddress(recoveredAddress);
    }

    const result = await authorisationService.removeRequest(data.walletContractAddress, data.body.publicKey);
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
      walletContractAddress: asString,
      body: asObject({
        publicKey: asString,
        signature: asSignature
      })
    }),
    denyRequest(authorisationService, provider)
  ));

  return router;
};

