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
import {Provider} from 'web3/providers';

const ENS_DOMAIN = 'mylogin.eth';

export async function providerFixture(givenProvider: providers.Provider, wallets: Wallet[]) {
  const [wallet, deployer] = wallets;

  const {relayer, provider} = await RelayerUnderTest.createPreconfigured(deployer);
  await relayer.start();

  const [ulProvider, services] = createProvider(provider._web3Provider as any, relayer.url());

  const web3 = new Web3(ulProvider);
  web3.eth.defaultAccount = `0x${'00'.repeat(20)}`;

  const ensName = `alex.${ENS_DOMAIN}`;
  const  {contractAddress, privateKey} = await createWallet(ensName, services.sdk, wallet);
  const mockToken = await deployContract(wallet, MockToken);
  await mockToken.transfer(contractAddress, utils.parseEther('1.0'));
  const walletContract = new Contract(contractAddress, WalletContract.abi, wallet);
  const deployedWallet = new DeployedWallet(walletContract.address, ensName, privateKey, services.sdk);

  return {web3, services: services!, ulProvider, deployedWallet};
}

function createProvider(provider: Provider, relaterUrl: string): [ULWeb3Provider, AppProps] {
  let services: AppProps;
  const ulProvider = new ULWeb3Provider(provider, relaterUrl, [ENS_DOMAIN], (props: AppProps) => { services = props; });

  return [ulProvider, services!];
}
