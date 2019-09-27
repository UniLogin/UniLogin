import MockDai from './MockDai.json';
import {deployContract} from 'ethereum-waffle';
import {providers, Wallet} from 'ethers';

export async function deployMockToken(provider: providers.Provider, [wallet] : Wallet[]): Promise<any> {
  const mockTokenContract = await deployContract(wallet, MockDai);
  return {wallet, mockTokenContract};
}
