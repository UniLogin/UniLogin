import {Router, Request} from 'express';
import AuthorisationService, {AuthorisationRequest} from '../../integration/sql/services/authorisationService';
import {asyncHandler, sanitize, responseOf, asString, asObject} from '@restless/restless';
import {getDeviceInfo} from '../utils/getDeviceInfo';
import {verifyCancelAuthroisationRequest, CancelAuthorisationRequest} from '@universal-login/commons';
import { hashCancelAuthorisationRequest } from '@universal-login/commons/dist/lib/core/utils/authorisation';
import { ethers } from 'ethers';
import WalletMasterWithRefund from '@universal-login/contracts/build/WalletMasterWithRefund.json';
import { InvalidSignature, InvalidAddress } from '../../core/utils/errors';
import { asSignature, MySignature } from '../utils/sanitizers';
import {providers} from 'ethers';


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
  async (data: {walletContractAddress: string, body: {key: string, signature: MySignature}}) => {
    const {walletContractAddress} = data;
    const {key, signature} = data.body;

    const cancelAuthorisationRequest: CancelAuthorisationRequest = {walletContractAddress, key};
    const payloadDigest = hashCancelAuthorisationRequest(cancelAuthorisationRequest);
    const [isValid, computedAddress] = verifyCancelAuthroisationRequest(payloadDigest, signature, key);
    if (!isValid) {
      throw new InvalidSignature(`cancelAuthorisationRequest failed due to invalid signature`);
    }

    const contract = new ethers.Contract(walletContractAddress, WalletMasterWithRefund.interface, provider);
    const flatSignature = ethers.utils.joinSignature(signature);
    const isCorrectAddress = await contract.isValidSignature(payloadDigest, flatSignature);
    if (!isCorrectAddress) {
      throw new InvalidAddress(computedAddress);
    }
    console.log('isCorrentAddress', isCorrectAddress);

    const result = await authorisationService.removeRequest(data.walletContractAddress, data.body.key);
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
        key: asString,
        signature: asSignature
      })
    }),
    denyRequest(authorisationService, provider)
  ));

  return router;
};

