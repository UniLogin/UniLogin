import {Router} from 'express';
import {asyncHandler, sanitize, responseOf} from '@restless/restless';
import {asString, asObject} from '@restless/sanitizers';
import {RelayerRequest} from '@universal-login/commons';
import {DevicesService} from '../../core/services/DevicesService';

const getDevices = (devicesService: DevicesService) =>
  async (data: {contractAddress: string, query: {signature: string}}) => {
    const devicesRequest: RelayerRequest = {
      contractAddress: data.contractAddress,
      signature: data.query.signature
    };

    const result = await devicesService.getDevices(devicesRequest);
    return responseOf(result, 201);
  };

export default (devicesService: DevicesService) => {
  const router = Router();

  router.get('/:contractAddress', asyncHandler(
    sanitize({
      contractAddress: asString,
      query: asObject({
        signature: asString
      })
    }),
    getDevices(devicesService)
  ));
  return router;
};
