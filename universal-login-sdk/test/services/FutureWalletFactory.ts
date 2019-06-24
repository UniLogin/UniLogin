import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {utils, Wallet, providers, Contract} from 'ethers';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {ETHER_NATIVE_TOKEN, ContractWhiteList, getDeployedBytecode, SupportedToken, ContractJSON} from '@universal-login/commons';
import {RelayerUnderTest} from '@universal-login/relayer';
import ProxyContract from '@universal-login/contracts/build/Proxy.json';
import {FutureWalletFactory} from '../../lib/services/FutureWalletFactory';
import {BlockchainService} from '../../lib/services/BlockchainService';

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

  it('deploy contract', async () => {
    const ensName = 'name.mylogin.eth';
    const {waitForBalance, contractAddress, deploy} = (await futureWalletFactory.createFutureWallet());
    wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2')});
    const result = await waitForBalance();
    expect(result.contractAddress).be.eq(contractAddress);
    expect(result.tokenAddress).be.eq(ETHER_NATIVE_TOKEN.address);
    wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2')});
    await deploy(ensName);
    expect(await provider.getCode(contractAddress)).to.be.eq(`0x${getDeployedBytecode(ProxyContract as ContractJSON)}`);
  });

  after(async () => {
    await relayer.stop();
  });
});
