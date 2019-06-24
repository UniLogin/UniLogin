import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {utils, Wallet, providers, Contract} from 'ethers';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {RelayerUnderTest} from '@universal-login/relayer';
import {ETHER_NATIVE_TOKEN, ContractWhiteList} from '@universal-login/commons';
import {FutureWalletFactory} from '../../lib/services/FutureWalletFactory';
import {BlockchainService} from '../../lib/services/BlockchainService';
import { SupportedToken } from '@universal-login/commons/lib';

chai.use(chaiHttp);

describe('INT: FutureWalletFactory', async () => {
  let provider: providers.Provider;
  let wallet: Wallet;
  let futureWalletFactory: FutureWalletFactory;
  let relayer: RelayerUnderTest;
  let factoryContract: Contract;
  let supportedTokens: SupportedToken[];
  let contractWhiteList: ContractWhiteList;
  const relayerPort = '33511';
  const relayerUrl = `http://localhost:${relayerPort}`;

  before(async () => {
    provider = createMockProvider();
    [wallet] = getWallets(provider);
    ({relayer, factoryContract, supportedTokens, contractWhiteList} = await RelayerUnderTest.createPreconfigured(wallet, relayerPort));
    relayer.start();
    const futureWalletConfig = {
      factoryAddress: factoryContract.address,
      supportedTokens,
      contractWhiteList
    };
    const blockchainService = new BlockchainService(provider);
    const relayerApi = {
      deploy: (address: string, ensName: string) => chai.request(relayerUrl)
        .post(`/wallet/deploy/`)
        .send({
          publicKey: address,
          ensName
        })
    };
    futureWalletFactory = new FutureWalletFactory(
      futureWalletConfig,
      provider,
      blockchainService,
      relayerApi as any
    );
  });

  it('resolve promise when address will have balance', async () => {
    const {waitForBalance, contractAddress} = (await futureWalletFactory.createFutureWallet());
    wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2')});
    const result = await waitForBalance();
    expect(result.contractAddress).be.eq(contractAddress);
    expect(result.tokenAddress).be.eq(ETHER_NATIVE_TOKEN.address);
  });

  it('deploy contract', async () => {
    const ensName = 'name.mylogin.eth';
    const {waitForBalance, contractAddress, deploy} = (await futureWalletFactory.createFutureWallet());
    wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2')});
    await waitForBalance();
    await deploy(ensName);
    expect(provider.getCode(contractAddress)).to.not.be.eq('0x');
  });

  after(async () => {
    await relayer.stop();
  });
});
