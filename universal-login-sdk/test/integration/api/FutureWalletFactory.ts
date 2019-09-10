import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {utils, Wallet, providers, Contract} from 'ethers';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {ETHER_NATIVE_TOKEN, ContractWhiteList, getDeployedBytecode, SupportedToken, ContractJSON, TEST_GAS_PRICE} from '@universal-login/commons';
import {RelayerUnderTest} from '@universal-login/relayer';
import ProxyContract from '@universal-login/contracts/build/WalletProxy.json';
import {FutureWalletFactory} from '../../../lib/api/FutureWalletFactory';
import {BlockchainService} from '../../../lib/integration/ethereum/BlockchainService';
import {RelayerApi} from '../../../lib/integration/http/RelayerApi';

chai.use(chaiHttp);

describe('INT: FutureWalletFactory', async () => {
  let provider: providers.Provider;
  let wallet: Wallet;
  let futureWalletFactory: FutureWalletFactory;
  let relayer: RelayerUnderTest;
  let factoryContract: Contract;
  let supportedTokens: SupportedToken[];
  let contractWhiteList: ContractWhiteList;
  let ensAddress: string;
  const relayerPort = '33511';
  const relayerUrl = `http://localhost:${relayerPort}`;

  before(async () => {
    provider = createMockProvider();
    [wallet] = getWallets(provider);
    ({relayer, factoryContract, supportedTokens, contractWhiteList, provider, ensAddress} = await RelayerUnderTest.createPreconfigured(wallet, relayerPort));
    await relayer.start();
    const futureWalletConfig = {
      factoryAddress: factoryContract.address,
      supportedTokens,
      contractWhiteList,
      chainSpec: {
        ensAddress,
        chainId: 0,
        name: ''
      }
    };
    const blockchainService = new BlockchainService(provider);
    const relayerApi = new RelayerApi(relayerUrl);
    futureWalletFactory = new FutureWalletFactory(
      futureWalletConfig,
      provider,
      blockchainService,
      relayerApi,
      null as any,
    );
  });

  it('deploy contract', async () => {
    const ensName = 'name.mylogin.eth';
    const {waitForBalance, contractAddress, deploy} = (await futureWalletFactory.createFutureWallet());
    await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2')});
    const result = await waitForBalance();
    expect(result.contractAddress).be.eq(contractAddress);
    expect(result.tokenAddress).be.eq(ETHER_NATIVE_TOKEN.address);
    await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2')});
    const deployedWallet = await deploy(ensName, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN.address);
    expect(await provider.getCode(contractAddress)).to.be.eq(`0x${getDeployedBytecode(ProxyContract as ContractJSON)}`);

    expect(deployedWallet.contractAddress).to.eq(contractAddress);
    expect(deployedWallet.name).to.eq(ensName);
  });

  after(async () => {
    await relayer.stop();
  });
});
