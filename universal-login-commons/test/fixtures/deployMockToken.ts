import MockToken from '../../build/MockToken.json';
import {deployContract} from 'ethereum-waffle';
import {providers, Wallet} from 'ethers';

export async function deployMockToken(provider: providers.Provider, [wallet] : Wallet[]): Promise<any> {
  const mockTokenContract = await deployContract(wallet, MockToken);
  return {wallet, mockTokenContract};
}
