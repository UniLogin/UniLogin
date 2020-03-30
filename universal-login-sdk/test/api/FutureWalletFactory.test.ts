import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {utils, Wallet, providers, Contract} from 'ethers';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {ETHER_NATIVE_TOKEN, ContractWhiteList, getDeployedBytecode, SupportedToken, ContractJSON, TEST_GAS_PRICE, TEST_APPLICATION_INFO, StoredFutureWallet} from '@unilogin/commons';
import {gnosisSafe} from '@unilogin/contracts';
import {RelayerUnderTest} from '@unilogin/relayer';
import {FutureWalletFactory} from '../../src/api/FutureWalletFactory';
import {RelayerApi} from '../../src/integration/http/RelayerApi';
import {ENSService} from '../../src/integration/ethereum/ENSService';
import {SavingFutureWalletFailed} from '../../src/core/utils/errors';

chai.use(chaiHttp);

describe('INT: FutureWalletFactory', () => {
  let provider: providers.Provider;
  let wallet: Wallet;
  let futureWalletFactory: FutureWalletFactory;
  let relayer: RelayerUnderTest;
  let factoryContract: Contract;
  let ensRegistrar: Contract;
  let fallbackHandlerContract: Contract;
  let walletContract: Contract;
  let supportedTokens: SupportedToken[];
  let contractWhiteList: ContractWhiteList;
  let ensAddress: string;
  let relayerApi: RelayerApi;
  const relayerPort = '33511';
  const relayerUrl = `http://localhost:${relayerPort}`;

  before(async () => {
    provider = createMockProvider();
    [wallet] = getWallets(provider);
    ({relayer, factoryContract, supportedTokens, contractWhiteList, provider, ensAddress, ensRegistrar, walletContract, fallbackHandlerContract} = await RelayerUnderTest.createPreconfigured(wallet, relayerPort));
    await relayer.start();
    const futureWalletConfig = {
      factoryAddress: factoryContract.address,
      walletContractAddress: walletContract.address,
      supportedTokens,
      fallbackHandlerAddress: fallbackHandlerContract.address,
      relayerAddress: wallet.address,
      contractWhiteList,
      chainSpec: {
        ensAddress,
        chainId: 0,
        name: '',
      },
    };
    relayerApi = new RelayerApi(relayerUrl);
    futureWalletFactory = new FutureWalletFactory(
      futureWalletConfig,
      new ENSService(provider, futureWalletConfig.chainSpec.ensAddress, ensRegistrar.address),
      {sdkConfig: {applicationInfo: TEST_APPLICATION_INFO}, provider, relayerApi} as any,
    );
  });

  it('deploy contract', async () => {
    const ensName = 'name.mylogin.eth';
    const {waitForBalance, contractAddress, deploy} = (await futureWalletFactory.createNew(ensName, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN.address));
    await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('1')});
    const result = await waitForBalance();
    expect(result.contractAddress).be.eq(contractAddress);
    expect(result.tokenAddress).be.eq(ETHER_NATIVE_TOKEN.address);
    await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2')});
    const {waitToBeSuccess, deploymentHash} = await deploy();
    expect(deploymentHash).to.be.properHex(64);
    const deployedWallet = await waitToBeSuccess();
    expect(await provider.getCode(contractAddress)).to.eq(`0x${getDeployedBytecode(gnosisSafe.Proxy as ContractJSON)}`);

    expect(deployedWallet.contractAddress).to.eq(contractAddress);
    expect(deployedWallet.name).to.eq(ensName);
  });

  it('should reject uppercase ens name, before sending the transaction to the blockchain', async () => {
    const ensName = 'MYNAME.mylogin.eth';
    const {waitForBalance, contractAddress, deploy} = (await futureWalletFactory.createNew(ensName, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN.address));
    await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2')});
    await waitForBalance();

    const balanceBefore = await wallet.getBalance();
    await expect(deploy())
      .to.be.eventually.rejectedWith('MYNAME.mylogin.eth is not valid');
    const balanceAfter = await wallet.getBalance();
    expect(balanceBefore).to.eq(balanceAfter);
  });

  it('createNew fails if storing future wallet failed', async () => {
    relayerApi.addFutureWallet = (futureWallet: StoredFutureWallet) => new Promise(resolve => resolve({result: 'it is not ok'}));
    await expect(futureWalletFactory.createNew('ens.mylogin.eth', '1111', ETHER_NATIVE_TOKEN.address)).to.be.rejectedWith(SavingFutureWalletFailed);
  });

  after(async () => {
    await relayer.stop();
  });
});
