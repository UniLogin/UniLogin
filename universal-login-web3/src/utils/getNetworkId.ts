import {promisify} from 'util'
import {Provider} from 'web3/providers';

export async function getNetworkId(provider: Provider): Promise<string> {
  const res: any = await promisify(provider.send.bind(provider))({jsonrpc: '2.0', method: 'net_version', params: [], id: 1});
  return res.result;
}
