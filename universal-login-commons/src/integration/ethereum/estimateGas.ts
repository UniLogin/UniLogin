import {Message} from '../../core/models/message';
import fetch from 'node-fetch';
import {bigNumberify} from 'ethers/utils';
import {http} from '../..';
import {ensureNotFalsy} from '../../core/utils/errors/ensure';

export const estimateGas = async (message: Partial<Message>, network = 'mainnet') => {
  const value = message.value ? bigNumberify(message.value).toHexString() : undefined;
  const gasPrice = message.gasPrice ? bigNumberify(message.gasPrice).toHexString() : undefined;
  ensureNotFalsy(message.to, Error, 'message.to cannot be falsy');
  const body = {
    jsonrpc: '2.0',
    method: 'eth_estimateGas',
    params: [{from: message.from,
      to: message.to,
      gasPrice: gasPrice?.replace('x0', 'x'),
      value: value?.replace('x0', 'x'),
      data: message.data}],
    id: 1,
  };
  const _http = http(fetch)(`https://${network}.infura.io/v3`);
  const result = await _http('POST', '/58bd9579ce6b43fe96e3b0e42f5ac0c4', body, {'Content-Type': 'application/json'});
  const estimatedGas = bigNumberify(result.result).toNumber();
  return estimatedGas;
};
