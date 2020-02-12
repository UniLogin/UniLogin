import {Provider} from 'web3/providers';

export function getNetworkId(provider: Provider): Promise<string> {
  return new Promise((resolve, reject) => {
    const cb = (err: any, res: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(res.result);
      }
    };
    provider.send({jsonrpc: '2.0', method: 'net_version', params: [], id: 1}, cb as any);
  });
}
