import {utils, Contract, providers, Wallet} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import MockToken from '@universal-login/contracts/build/MockToken.json';
import WalletContract from '@universal-login/contracts/build/Wallet.json';
import {RelayerUnderTest} from '@universal-login/relayer';
import UniversalLoginSDK, {DeployedWallet} from '@universal-login/sdk';
import {createWallet} from '../helpers/createWallet';
import {AppProps} from '../../lib/ui/App';
import {ULWeb3Provider} from '../../lib';
import Web3 from 'web3';

export async function providerFixture(givenProvider: providers.Provider, wallets: Wallet[]) {
  const [wallet, otherWallet, otherWallet2, deployer] = wallets;

  const {relayer, provider} = await RelayerUnderTest.createPreconfigured(deployer);
  await relayer.start();

  const sdk = new UniversalLoginSDK(relayer.url(), provider, {authorisationsObserverTick: 10, executionFactoryTick: 10});

  const ensName = 'alex.mylogin.eth';
  const  {contractAddress, privateKey} = await createWallet(ensName, sdk, wallet);
  const mockToken = await deployContract(wallet, MockToken);
  await mockToken.transfer(contractAddress, utils.parseEther('1.0'));
  const walletContract = new Contract(contractAddress, WalletContract.abi, wallet);
  const deployedWallet = new DeployedWallet(walletContract.address, ensName, privateKey, sdk);

  if (!(givenProvider instanceof providers.Web3Provider)) {
    throw new Error('Expected a web3 provider');
  }

  let services: AppProps;
  const ulProvider = new ULWeb3Provider(givenProvider._web3Provider as any, relayer.url(), ['mylogin.eth'], (props: AppProps) => { services = props; });

  const web3 = new Web3(ulProvider);
  web3.eth.defaultAccount = `0x${'00'.repeat(20)}`;

  return {web3, services: services!, ulProvider, deployedWallet};
}
