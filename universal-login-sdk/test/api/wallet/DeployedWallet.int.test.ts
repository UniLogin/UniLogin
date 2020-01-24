import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import {createFixtureLoader, solidity} from 'ethereum-waffle';
import {Contract} from 'ethers';
import basicSDK from '../../fixtures/basicSDK';
import {RelayerUnderTest} from '@universal-login/relayer';
import {walletFromBrain, DEFAULT_GAS_PRICE, createKeyPair, TEST_EXECUTION_OPTIONS} from '@universal-login/commons';
import {DeployedWallet} from '../../../src';
import {waitForSuccess} from '../../helpers/waitForSuccess';

chai.use(solidity);
chai.use(sinonChai);
chai.use(chaiAsPromised);

const loadFixture = createFixtureLoader();

const gasPrice = DEFAULT_GAS_PRICE;

describe('INT: DeployedWallet', async () => {
  let relayer: RelayerUnderTest;
  let mockToken: Contract;
  let deployedWallet: DeployedWallet;
  let ensName: string;
  const publicKey = createKeyPair().publicKey;
  const publicKey2 = createKeyPair().publicKey;

  beforeEach(async () => {
    const {contractAddress, sdk, privateKey, ...rest} = await loadFixture(basicSDK) as any;
    ({relayer, mockToken, ensName} = rest);
    deployedWallet = new DeployedWallet(contractAddress, ensName, privateKey, sdk);
  });

  it('construction', async () => {
    expect(await deployedWallet.keyExist(publicKey)).to.be.false;
    expect(await deployedWallet.keyExist(publicKey2)).to.be.false;
    expect(await deployedWallet.keyExist(deployedWallet.publicKey)).to.be.true;
    expect(await deployedWallet.getNonce()).to.be.eq(0);
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
    expect(await deployedWallet.getNonce()).to.be.eq(1);
    expect(transactionHash).to.be.properHex(64);
    expect(state).to.be.eq('Success');

    ({transactionHash, state} = await waitForSuccess(deployedWallet.removeKey(publicKey, TEST_EXECUTION_OPTIONS)));
    expect(await deployedWallet.keyExist(publicKey)).to.be.false;
    expect(await deployedWallet.getKeys()).not.to.include(publicKey);
    expect(await deployedWallet.getNonce()).to.be.eq(2);
    expect(transactionHash).to.be.properHex(64);
    expect(state).to.be.eq('Success');
  });

  xit('addKeys', async () => {
    const {transactionHash, state} = await waitForSuccess(deployedWallet.addKeys([publicKey, publicKey2], TEST_EXECUTION_OPTIONS));
    expect(await deployedWallet.keyExist(publicKey)).to.be.true;
    expect(await deployedWallet.keyExist(publicKey2)).to.be.true;
    expect(await deployedWallet.getKeys()).to.include(publicKey);
    expect(await deployedWallet.getKeys()).to.include(publicKey2);
    expect(await deployedWallet.getNonce()).to.be.eq(1);
    expect(transactionHash).to.be.properHex(64);
    expect(state).to.be.eq('Success');
  });

  afterEach(async () => {
    await relayer.clearDatabase();
  });

  after(async () => {
    await relayer.stop();
  });
});
