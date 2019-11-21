import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import {createFixtureLoader, solidity} from 'ethereum-waffle';
import {Contract, Wallet} from 'ethers';
import basicSDK from '../fixtures/basicSDK';
import {RelayerUnderTest} from '@universal-login/relayer';
import {walletFromBrain, DEFAULT_GAS_PRICE, getContractHash, CONTRACT_VERSION} from '@universal-login/commons';
import {DeployedWallet} from '../../lib';
import WalletContract from '@universal-login/contracts/build/Wallet.json';

chai.use(solidity);
chai.use(sinonChai);
chai.use(chaiAsPromised);

const loadFixture = createFixtureLoader();

const gasPrice = DEFAULT_GAS_PRICE;

describe('E2E: DeployedWallet', async () => {
  let relayer: RelayerUnderTest;
  let otherWallet: Wallet;
  let mockToken: Contract;
  let deployedWallet: DeployedWallet;
  let walletContract: Contract;
  let ensName: string;

  beforeEach(async () => {
    const {contractAddress, sdk, privateKey, ...rest} = await loadFixture(basicSDK) as any;
    ({relayer, otherWallet, mockToken, walletContract, ensName} = rest);
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
      let {waitToBeSuccess} = await deployedWallet.addKey(otherWallet.address, {gasPrice, gasToken: mockToken.address});
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

  describe('walletVersion', () => {
    it('returns correct wallet contract version', async () => {
      const walletMasterBytecodeHash = getContractHash(WalletContract as any);
      expect(await deployedWallet.fetchWalletVersion()).to.eq((CONTRACT_VERSION as any)[walletMasterBytecodeHash]);
    });
  });
});
