import {expect} from 'chai';
import {utils, Wallet} from 'ethers';
import {createFixtureLoader} from 'ethereum-waffle';
import {waitExpect} from '@universal-login/commons';
import {oneWallet} from './fixtures/oneWalletFixture';
import Web3 from 'web3';
import {Provider} from 'web3/providers';
import {ULWeb3Provider} from '../lib';
import {AppProps} from '../lib/ui/App';

const loadFixture = createFixtureLoader();

function createProvider(provider: Provider, relaterUrl: string): [ULWeb3Provider, AppProps] {
  let services: AppProps;
  const ulProvider = new ULWeb3Provider(provider, relaterUrl, ['mylogin.eth'], (props: AppProps) => {
    services = props;
  });

  return [ulProvider, services!];
}


describe('ULWeb3Provier', () => {
  const setup = async () => {
    const {relayer, provider, deployedWallet} = await loadFixture(oneWallet);
    const [ulProvider, services] = createProvider(provider._web3Provider as any, relayer.url());

    const web3 = new Web3(ulProvider);
    web3.eth.defaultAccount = `0x${'00'.repeat(20)}`;

    return {web3, ulProvider, services, deployedWallet};
  };

  it('send transaction triggers wallet creationg', async () => {
    const {web3, services} = await setup();

    expect(services.uiController.showOnboarding.get()).to.be.false;

    web3.eth.sendTransaction({
      to: Wallet.createRandom().address,
      value: utils.parseEther('0.005').toString(),
    });

    await waitExpect(() => {
      return expect(services.uiController.showOnboarding.get()).to.be.true;
    });

  });

  it('can send a simple eth transfer', async () => {
    const {web3, services, deployedWallet} = await setup();
    services.walletService.connect(deployedWallet.asApplicationWallet);

    const {transactionHash} = await web3.eth.sendTransaction({
      to: Wallet.createRandom().address,
      value: utils.parseEther('0.005').toString(),
    });

    expect(transactionHash).to.be.a('string');
  });

  it('sends transactions that originated before wallet was created', async () => {
    const {web3, services, deployedWallet} = await setup();

    const promise = web3.eth.sendTransaction({
      to: Wallet.createRandom().address,
      value: utils.parseEther('0.005').toString(),
    });

    services.walletService.connect(deployedWallet.asApplicationWallet);

    const { transactionHash } = await promise;
    expect(transactionHash).to.be.a('string');
  });
});
