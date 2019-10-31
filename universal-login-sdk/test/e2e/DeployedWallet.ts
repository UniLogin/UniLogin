import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import {createFixtureLoader, solidity} from 'ethereum-waffle';
import {Contract, Wallet} from 'ethers';
import basicSDK from '../fixtures/basicSDK';
import {RelayerUnderTest} from '@universal-login/relayer';
import UniversalLoginSDK, {DeployedWallet} from '../../lib';
import {waitExpect, walletFromBrain} from '@universal-login/commons';
import sinon from 'sinon';

chai.use(solidity);
chai.use(sinonChai);
chai.use(chaiAsPromised);

const loadFixture = createFixtureLoader();

describe('E2E: DeployedWallet', async () => {
  let relayer: RelayerUnderTest;
  let otherWallet: Wallet;
  let mockToken: Contract;
  let deployedWallet: DeployedWallet;
  let sdk: UniversalLoginSDK;
  let walletContract: Contract;
  let ensName: string;

  beforeEach(async () => {
    const {contractAddress, privateKey, ...rest} = await loadFixture(basicSDK) as any;
    ({relayer, otherWallet, mockToken, walletContract, ensName, sdk} = rest);
    deployedWallet = new DeployedWallet(contractAddress, ensName, privateKey, sdk);
  });

  afterEach(async () => {
    await relayer.clearDatabase();
  });

  after(async () => {
    await relayer.stop();
  });

  describe('getRequiredSignatures', function () {
    it('returns the number of required signatures', async function () {
      await expect(deployedWallet.getRequiredSignatures()).to.eventually.eq(1);
    });

    it('returns the correct number of required signatures after update', async function () {
      let {waitToBeSuccess} = await deployedWallet.addKey(otherWallet.address, {gasToken: mockToken.address});
      await waitToBeSuccess();
      ({waitToBeSuccess} = await deployedWallet.setRequiredSignatures(2, {gasToken: mockToken.address}));
      await waitToBeSuccess();
      await expect(deployedWallet.getRequiredSignatures()).to.eventually.eq(2);
    });
  });

  describe('generateBackupCodes', () => {
    it('returns the code and update contract keys', async () => {
      const {waitToBeSuccess, waitForTransactionHash} = await deployedWallet.generateBackupCodes();
      const {transactionHash} = await waitForTransactionHash();
      expect(transactionHash).to.be.properHex;
      const codes = await waitToBeSuccess();
      const {address} = await walletFromBrain(ensName, codes[0]);
      expect(await walletContract.keyExist(address)).to.be.true;
      const connectedDevices = await deployedWallet.getConnectedDevices();
      expect(connectedDevices.map(({publicKey}: any) => publicKey)).to.include(address);
    }).timeout(15000);
  });

  describe('subscribeAuthorizations', () => {
    it('notified when user tries to connect', async () => {
      const connectionCallback = sinon.spy();
      const unsubscribe = await deployedWallet.subscribeAuthorisations(connectionCallback);
      await sdk.connect(deployedWallet.contractAddress);
      await waitExpect(() => {
        expect(connectionCallback.lastCall.args[0]).to.have.length.greaterThan(0);
      });
      unsubscribe();
    });
  });
});
