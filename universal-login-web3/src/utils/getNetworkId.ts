import {Provider} from 'web3/providers';
import {providers} from 'ethers';

export function getNetworkId(provider: Provider | providers.JsonRpcProvider): Promise<string> {
  return new Promise((resolve, reject) => {
    const cb = (err: any, res: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.result);
      }
    };
    if (provider instanceof Provider) {
      provider.send({jsonrpc: '2.0', method: 'net_version', params: [], id: 1}, cb as any);
    } else {
      provider.send('net_version', []);
    }
  });
}
