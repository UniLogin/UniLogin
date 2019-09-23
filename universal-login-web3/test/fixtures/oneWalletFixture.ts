import {Contract, providers, utils, Wallet} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import MockToken from '@universal-login/contracts/build/MockToken.json';
import WalletContract from '@universal-login/contracts/build/Wallet.json';
import {RelayerUnderTest} from '@universal-login/relayer';
import UniversalLoginSDK, {DeployedWallet} from '@universal-login/sdk';
import {createWallet} from '../helpers/createWallet';

const ENS_DOMAIN = 'mylogin.eth';

export async function oneWallet(givenProvider: providers.Provider, wallets: Wallet[]) {
  const [wallet, deployer] = wallets;

  const {relayer, provider} = await RelayerUnderTest.createPreconfigured(deployer);
  await relayer.start();

  const sdk = new UniversalLoginSDK(relayer.url(), provider, {authorisationsObserverTick: 10, executionFactoryTick: 10});

  const ensName = `alex.${ENS_DOMAIN}`;
  const  {contractAddress, privateKey} = await createWallet(ensName, sdk, wallet);
  const mockToken = await deployContract(wallet, MockToken);
  await mockToken.transfer(contractAddress, utils.parseEther('1.0'));
  const walletContract = new Contract(contractAddress, WalletContract.abi, wallet);
  const deployedWallet = new DeployedWallet(walletContract.address, ensName, privateKey, sdk);

  return {relayer, deployedWallet, provider};
}

