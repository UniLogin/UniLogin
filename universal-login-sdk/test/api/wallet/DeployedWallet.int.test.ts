import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import {createFixtureLoader, solidity} from 'ethereum-waffle';
import {Contract} from 'ethers';
import basicSDK from '../../fixtures/basicSDK';
import {RelayerUnderTest} from '@universal-login/relayer';
import {walletFromBrain, DEFAULT_GAS_PRICE, createKeyPair, TEST_EXECUTION_OPTIONS} from '@universal-login/commons';
import {DeployedWallet} from '../../../src';
import {transferMessage} from '../../fixtures/basicSDK';

chai.use(solidity);
chai.use(sinonChai);
chai.use(chaiAsPromised);

const loadFixture = createFixtureLoader();

const gasPrice = DEFAULT_GAS_PRICE;

describe('INT: DeployedWallet', async () => {
  let relayer: RelayerUnderTest;
  let mockToken: Contract;
  let deployedWallet: DeployedWallet;
  let walletContract: Contract;
  let ensName: string;
  const publicKey = createKeyPair().publicKey;

  beforeEach(async () => {
    const {contractAddress, sdk, privateKey, ...rest} = await loadFixture(basicSDK) as any;
    ({relayer, mockToken, walletContract, ensName} = rest);
    deployedWallet = new DeployedWallet(contractAddress, ensName, privateKey, sdk);
  });

  describe('getRequiredSignatures', function () {
    it('returns the number of required signatures', async function () {
      await expect(deployedWallet.getRequiredSignatures()).to.eventually.eq(1);
    });

    it('returns the correct number of required signatures after update', async function () {
      let {waitToBeSuccess} = await deployedWallet.addKey(publicKey, {gasPrice, gasToken: mockToken.address});
      await waitToBeSuccess();
      ({waitToBeSuccess} = await deployedWallet.setRequiredSignatures(2, {gasPrice, gasToken: mockToken.address}));
      await waitToBeSuccess();
      await expect(deployedWallet.getRequiredSignatures()).to.eventually.eq(2);
    });
  });

  describe('generateBackupCodes', () => {
    it('returns the code and update contract keys', async () => {
      const {waitToBeSuccess, waitForTransactionHash} = await deployedWallet.generateBackupCodes({gasPrice, gasToken: mockToken.address});
      const {transactionHash} = await waitForTransactionHash();
      expect(transactionHash).to.be.properHex;
      const codes = await waitToBeSuccess();
      const {address} = await walletFromBrain(ensName, codes[0]);
      expect(await walletContract.keyExist(address)).to.be.true;
      const connectedDevices = await deployedWallet.getConnectedDevices();
      expect(connectedDevices.map(({publicKey}: any) => publicKey)).to.include(address);
    }).timeout(15000);
  });

  it('getNonce', async () => {
    expect(await deployedWallet.getNonce()).to.eq(0);
    let {waitToBeSuccess} = await deployedWallet.execute(transferMessage);
    await waitToBeSuccess();
    expect(await deployedWallet.getNonce()).to.eq(1);
    ({waitToBeSuccess} = await deployedWallet.addKey(createKeyPair().publicKey, TEST_EXECUTION_OPTIONS));
    await waitToBeSuccess();
    expect(await deployedWallet.getNonce()).to.eq(2);
  });

  describe('Add key', async () => {
    it('should return transaction hash', async () => {
      const {waitToBeSuccess} = await deployedWallet.addKey(publicKey, TEST_EXECUTION_OPTIONS);
      const {transactionHash, state} = await waitToBeSuccess();
      expect(transactionHash).to.be.properHex(64);
      expect(state).to.be.eq('Success');
      expect(await walletContract.lastNonce()).to.be.eq(1);
    });

    it('should add a management key to the walletContract', async () => {
      const {waitToBeSuccess} = await deployedWallet.addKey(publicKey, TEST_EXECUTION_OPTIONS);
      await waitToBeSuccess();
      expect(await walletContract.keyExist(publicKey)).to.be.true;
    });

    it('should add a device to connected devices', async () => {
      const initiallyDevicesLength = (await deployedWallet.getConnectedDevices()).length;
      const {waitToBeSuccess} = await deployedWallet.addKey(publicKey, TEST_EXECUTION_OPTIONS);
      await waitToBeSuccess();
      expect(await deployedWallet.getConnectedDevices()).length(initiallyDevicesLength + 1);
    });
  });

  describe('Add keys', async () => {
    it('should return transaction hash and proper state', async () => {
      const publicKey2 = createKeyPair().publicKey;
      const {waitToBeSuccess} = await deployedWallet.addKeys([publicKey, publicKey2], TEST_EXECUTION_OPTIONS);
      const {state, transactionHash} = await waitToBeSuccess();
      expect(transactionHash).to.be.properHex(64);
      expect(state).to.be.eq('Success');
    });
  });

  describe('keyExist', async () => {
    it('return an invalid key if key is not added', async () => {
      expect(await deployedWallet.keyExist(publicKey)).to.be.false;
    });

    it('return a management key', async () => {
      const {waitToBeSuccess} = await deployedWallet.addKey(publicKey, TEST_EXECUTION_OPTIONS);
      await waitToBeSuccess();
      expect(await deployedWallet.keyExist(publicKey)).to.be.true;
    });
  });

  afterEach(async () => {
    await relayer.clearDatabase();
  });

  after(async () => {
    await relayer.stop();
  });
});
