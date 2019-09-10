import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import {createFixtureLoader, solidity} from 'ethereum-waffle';
import {Contract, Wallet} from 'ethers';
import basicSDK from '../fixtures/basicSDK';
import {RelayerUnderTest} from '@universal-login/relayer';
import {DeployedWallet} from '../../lib';

chai.use(solidity);
chai.use(sinonChai);
chai.use(chaiAsPromised);

const loadFixture = createFixtureLoader();

describe('E2E: DeployedWallet', async () => {
  let relayer: RelayerUnderTest;
  let otherWallet: Wallet;
  let mockToken: Contract;
  let deployedWallet: DeployedWallet;

  beforeEach(async () => {
    const {contractAddress, ensName, privateKey, sdk, ...rest} = await loadFixture(basicSDK) as any;
    ({relayer, otherWallet, mockToken} = rest);
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
      let {waitToBeMined} = await deployedWallet.addKey(otherWallet.address, {gasToken: mockToken.address});
      await waitToBeMined();
      ({waitToBeMined} = await deployedWallet.setRequiredSignatures(2, {gasToken: mockToken.address}));
      await waitToBeMined();
      await expect(deployedWallet.getRequiredSignatures()).to.eventually.eq(2);
    });
  });
});
