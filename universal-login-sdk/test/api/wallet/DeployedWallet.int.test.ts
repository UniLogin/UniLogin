import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import {createFixtureLoader, solidity, MockProvider} from 'ethereum-waffle';
import {Contract, utils, Wallet} from 'ethers';
import {mockContracts} from '@unilogin/contracts/testutils';
import basicSDK, {transferMessage} from '../../fixtures/basicSDK';
import {RelayerUnderTest} from '@unilogin/relayer';
import {walletFromBrain, createKeyPair, TEST_EXECUTION_OPTIONS, Message, PartialRequired, deployContract, GAS_BASE, ETHER_NATIVE_TOKEN, TEST_REFUND_PAYER, TEST_SDK_CONFIG, TEST_GAS_PRICE_IN_TOKEN} from '@unilogin/commons';
import UniLoginSdk, {DeployedWallet} from '../../../src';
import {waitForSuccess} from '../../helpers/waitForSuccess';

chai.use(solidity);
chai.use(sinonChai);
chai.use(chaiAsPromised);

const loadFixture = createFixtureLoader();

const gasPrice = TEST_GAS_PRICE_IN_TOKEN;

describe('INT: DeployedWallet', () => {
  let provider: MockProvider;
  let relayer: RelayerUnderTest;
  let mockToken: Contract;
  let deployedWallet: DeployedWallet;
  let ensName: string;
  let message: PartialRequired<Message, 'from'>;
  let wallet: Wallet;
  let walletContract: Contract;
  let otherWallet: Wallet;
  let contractAddress: string;
  let privateKey: string;
  let sdk: UniLoginSdk;
  const publicKey = createKeyPair().publicKey;
  const publicKey2 = createKeyPair().publicKey;
  const email = 'user@unilogin.test';

  beforeEach(async () => {
    const {...rest} = await loadFixture(basicSDK) as any;
    ({wallet, sdk, provider, otherWallet, relayer, walletContract, contractAddress, privateKey, mockToken, ensName} = rest);
    await relayer.setupTestPartner();
    deployedWallet = new DeployedWallet(contractAddress, ensName, privateKey, sdk, email);
    message = {...transferMessage, from: contractAddress, gasToken: ETHER_NATIVE_TOKEN.address, data: '0x'};
  });

  it('construction', async () => {
    expect(await deployedWallet.keyExist(publicKey)).to.be.false;
    expect(await deployedWallet.keyExist(publicKey2)).to.be.false;
    expect(await deployedWallet.keyExist(deployedWallet.publicKey)).to.be.true;
    expect(await deployedWallet.getNonce()).to.eq(0);
    expect(await deployedWallet.getKeys()).to.deep.eq([deployedWallet.publicKey]);
    expect(await deployedWallet.getRequiredSignatures()).to.eq(1);
    expect((await deployedWallet.getConnectedDevices())[0]).to.include({
      contractAddress: deployedWallet.contractAddress,
      publicKey: deployedWallet.publicKey,
    });
  });

  it('setRequiredSignatures', async function () {
    await waitForSuccess(deployedWallet.addKey(publicKey, {gasPrice, gasToken: mockToken.address}));
    await waitForSuccess(deployedWallet.setRequiredSignatures(2, {gasPrice, gasToken: mockToken.address}));
    await expect(deployedWallet.getRequiredSignatures()).to.eventually.eq(2);
  });

  it('generateBackupCodes', async () => {
    const {waitToBeSuccess, waitForTransactionHash} = await deployedWallet.generateBackupCodes({gasPrice, gasToken: mockToken.address});
    const {transactionHash} = await waitForTransactionHash();
    expect(transactionHash).to.be.properHex;
    const codes = await waitToBeSuccess();
    expect(codes.length).to.eq(1);
    const {address} = await walletFromBrain(ensName, codes[0]);
    expect(await deployedWallet.keyExist(address)).to.be.true;
    const connectedDevices = await deployedWallet.getConnectedDevices();
    expect(connectedDevices.map(({publicKey}: any) => publicKey)).to.include(address);
  }).timeout(15000);

  it('addKey and removeKey', async () => {
    let {transactionHash, state} = await waitForSuccess(deployedWallet.addKey(publicKey, TEST_EXECUTION_OPTIONS));
    expect(await deployedWallet.keyExist(publicKey)).to.be.true;
    expect(await deployedWallet.getKeys()).to.include(publicKey);
    expect(await deployedWallet.getNonce()).to.eq(1);
    expect(transactionHash).to.be.properHex(64);
    expect(state).to.eq('Success');

    ({transactionHash, state} = await waitForSuccess(deployedWallet.removeKey(publicKey, TEST_EXECUTION_OPTIONS)));
    expect(await deployedWallet.keyExist(publicKey)).to.be.false;
    expect(await deployedWallet.getKeys()).not.to.include(publicKey);
    expect(await deployedWallet.getNonce()).to.eq(2);
    expect(transactionHash).to.be.properHex(64);
    expect(state).to.eq('Success');
  });

  xit('addKeys', async () => {
    const {transactionHash, state} = await waitForSuccess(deployedWallet.addKeys([publicKey, publicKey2], TEST_EXECUTION_OPTIONS));
    expect(await deployedWallet.keyExist(publicKey)).to.be.true;
    expect(await deployedWallet.keyExist(publicKey2)).to.be.true;
    expect(await deployedWallet.getKeys()).to.include(publicKey);
    expect(await deployedWallet.getKeys()).to.include(publicKey2);
    expect(await deployedWallet.getNonce()).to.eq(1);
    expect(transactionHash).to.be.properHex(64);
    expect(state).to.eq('Success');
  });

  it('getMessageStatus', async () => {
    await deployedWallet.addKey(otherWallet.address, TEST_EXECUTION_OPTIONS);
    await deployedWallet.setRequiredSignatures(2, TEST_EXECUTION_OPTIONS);
    const msg = {...message, to: otherWallet.address, nonce: await walletContract.nonce()};
    const {messageStatus, waitForTransactionHash} = await deployedWallet.execute(msg);
    const status = await sdk.getMessageStatus(messageStatus.messageHash);
    expect(status.collectedSignatures.length).to.eq(1);
    await waitForTransactionHash();
  });

  describe('Execute signed message', async () => {
    it('Should execute signed message', async () => {
      const expectedBalance = (await provider.getBalance(message.to!)).add(utils.parseEther('0.5'));
      const {waitToBeSuccess} = await deployedWallet.execute(message);
      const {transactionHash} = await waitToBeSuccess();
      expect(transactionHash).to.match(/^[0x|0-9|a-f|A-F]{66}/);
      expect(await provider.getBalance(message.to!)).to.eq(expectedBalance);
    });

    it('Should return transaction hash and proper state', async () => {
      const {waitToBeSuccess} = await deployedWallet.execute(message);
      const {transactionHash, state} = await waitToBeSuccess();
      expect(transactionHash).to.be.properHex(64);
      expect(state).to.eq('Success');
    });

    it('Should return transaction hash and proper state with free transaction', async () => {
      const startingBalance = (await provider.getBalance(message.from!));
      const refundPaidSdk = new UniLoginSdk(relayer.url(), provider, {...TEST_SDK_CONFIG, mineableFactoryTimeout: 3000, apiKey: TEST_REFUND_PAYER.apiKey});
      await refundPaidSdk.start();
      deployedWallet = new DeployedWallet(contractAddress, ensName, privateKey, refundPaidSdk, 'user@unilogin.test');
      const {waitToBeSuccess} = await deployedWallet.execute(message);
      await waitToBeSuccess();
      expect(await provider.getBalance(message.from!)).to.eq(startingBalance.sub(utils.parseEther('0.5')));
      refundPaidSdk.stop();
    });

    it('when not enough tokens ', async () => {
      const mockToken = await deployContract(wallet, mockContracts.MockToken);
      await mockToken.transfer(walletContract.address, 1);
      message = {...message, gasToken: mockToken.address};
      await expect(deployedWallet.execute(message)).to.be.eventually.rejectedWith('Not enough tokens');
    });

    it('when not enough ether', async () => {
      const amountToTransfer = (await otherWallet.getBalance()).add(utils.parseEther('0.5'));
      await expect(deployedWallet.execute({...message, to: otherWallet.address, value: amountToTransfer})).rejectedWith('Not enough tokens');
    });

    it('when not enough gas', async () => {
      const baseGas = 88720;
      const notEnoughGasLimit = 100;
      message = {...message, gasLimit: baseGas + notEnoughGasLimit};
      await expect(deployedWallet.execute(message)).to.be.eventually.rejectedWith(`Insufficient Gas. gasLimit should be greater than ${GAS_BASE}`);
    });

    it('Throws when the gas limit is above the relayers maxGasLimit', async () => {
      const {sdk: secondSdk} = await loadFixture(basicSDK);
      message.gasLimit = secondSdk.getRelayerConfig().maxGasLimit + 1;
      const secondDeployedWallet = new DeployedWallet(contractAddress, '', privateKey, secondSdk, '');
      await expect(secondDeployedWallet.execute(message)).to.be.eventually
        .rejectedWith('Invalid gas limit. 500001 provided, when relayer\'s max gas limit is 500000');
    });

    it('Passes when the gas limit is equal to the relayers maxGasLimit', async () => {
      const {sdk: secondSdk} = await loadFixture(basicSDK);
      const secondDeployedWallet = new DeployedWallet(contractAddress, '', privateKey, secondSdk, '');
      const {waitToBeSuccess} = await secondDeployedWallet.execute(message);
      await expect(waitToBeSuccess()).to.be.eventually.fulfilled;
    });
  });

  afterEach(async () => {
    await relayer.clearDatabase();
  });

  after(async () => {
    await relayer.stop();
  });
});
