import {providers, Wallet} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import MockToken from '@universal-login/contracts/build/MockToken.json';
import {RelayerUnderTest} from '@universal-login/relayer';
import ENSBuilder = require('ens-builder');

const DOMAIN_LABEL = 'mylogin';
const DOMAIN_TLD = 'eth';
const DOMAIN = `${DOMAIN_LABEL}.${DOMAIN_TLD}`;

export async function prerequisites(givenProvider: providers.Provider, [deployer, ...wallets]: Wallet[]) {
  const {walletContract, factoryContract} = await RelayerUnderTest.deployBaseContracts(deployer);

  const ensBuilder = new ENSBuilder(deployer);
  const ensAddress = await ensBuilder.bootstrapWith(DOMAIN_LABEL, DOMAIN_TLD);

  const mockToken = await deployContract(deployer, MockToken);

  return {deployer, walletContract, factoryContract, ensAddress, ensDomains: [DOMAIN], mockToken, wallets};
}

