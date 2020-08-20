import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import {utils, Wallet, Contract} from 'ethers';
import {MockProvider} from 'ethereum-waffle';
import {ETHER_NATIVE_TOKEN, ContractWhiteList, getDeployedBytecode, SupportedToken, ContractJSON, TEST_GAS_PRICE, TEST_APPLICATION_INFO, StoredFutureWallet, BalanceChecker, ProviderService, EmailConfirmation} from '@unilogin/commons';
import {gnosisSafe} from '@unilogin/contracts';
import {RelayerUnderTest} from '@unilogin/relayer';
import {FutureWalletFactory} from '../../src/api/FutureWalletFactory';
import {RelayerApi} from '../../src/integration/http/RelayerApi';
import {ENSService} from '../../src/integration/ethereum/ENSService';
import {SavingFutureWalletFailed} from '../../src/core/utils/errors';
import {ConfirmedWallet} from '../../src/api/wallet/ConfirmedWallet';

chai.use(chaiHttp);

describe('INT: FutureWalletFactory', () => {
  let provider: MockProvider;
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
  const contractCode = `0x${getDeployedBytecode(gnosisSafe.Proxy as ContractJSON)}`;

  before(async () => {
    provider = new MockProvider();
    [wallet] = provider.getWallets();
    ({relayer, factoryContract, supportedTokens, contractWhiteList, ensAddress, ensRegistrar, walletContract, fallbackHandlerContract} = await RelayerUnderTest.createPreconfigured(wallet, relayerPort));
    await relayer.start();
    const futureWalletConfig = {
      factoryAddress: factoryContract.address,
      walletContractAddress: walletContract.address,
      supportedTokens,
      fallbackHandlerAddress: fallbackHandlerContract.address,
      relayerAddress: wallet.address,
      contractWhiteList,
      ensAddress,
      network: '',
    };
    relayerApi = new RelayerApi(relayerUrl);
    futureWalletFactory = new FutureWalletFactory(
      futureWalletConfig,
      new ENSService(provider, futureWalletConfig.ensAddress, ensRegistrar.address),
      {config: {applicationInfo: TEST_APPLICATION_INFO}, provider, relayerApi} as any,
      new BalanceChecker(new ProviderService(provider)),
    );
  });

  it('deploy contract', async () => {
    const ensName = 'name.mylogin.eth';
    const {waitForBalance, contractAddress, deploy, getMinimalAmount} = (await futureWalletFactory.createNew(ensName, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN.address));
    await wallet.sendTransaction({to: contractAddress, value: utils.parseEther(getMinimalAmount())});
    const result = await waitForBalance();
    expect(result).be.eq(contractAddress);
    await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2')});
    const {waitToBeSuccess, deploymentHash} = await deploy();
    expect(deploymentHash).to.be.properHex(64);
    const deployedWallet = await waitToBeSuccess();
    expect(await provider.getCode(contractAddress)).to.eq(contractCode);

    expect(deployedWallet.contractAddress).to.eq(contractAddress);
    expect(deployedWallet.name).to.eq(ensName);
  });

  it('deploy with password', async () => {
    const ensName = 'user.mylogin.eth';
    const email = 'user@unlogin.test';
    const code = '123456';
    const emailConfirmation: EmailConfirmation = {email, ensName, code, isConfirmed: true, createdAt: new Date()};
    (relayer as any).emailConfirmationStore.get = sinon.stub().onFirstCall().resolves(emailConfirmation);
    const storeEncryptedWalletSpy = sinon.spy((relayer as any).encryptedWalletsStore, 'add');
    const confirmedWallet = new ConfirmedWallet(email, ensName, code);
    const password = 'password123!';
    const {ensName: returnedEnsName, contractAddress, deploy} = await futureWalletFactory.createNewWithPassword(confirmedWallet, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN.address, password);
    expect(returnedEnsName).eq(ensName);
    expect(storeEncryptedWalletSpy.firstCall.args[0]).include({
      ensName,
      email,
    });
    await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('1')});
    const {waitToBeSuccess} = await deploy();
    const deployedWallet = await waitToBeSuccess();
    expect(await provider.getCode(contractAddress)).to.eq(contractCode);
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
