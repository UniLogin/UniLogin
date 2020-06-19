import {expect} from 'chai';
import {Wallet, utils} from 'ethers';
import {MockProvider} from 'ethereum-waffle';
import {signRelayerRequest, TEST_PRIVATE_KEY, recoverFromRelayerRequest} from '@unilogin/commons';
import RelayerRequestSignatureValidator from '../../../src/integration/ethereum/validators/RelayerRequestSignatureValidator';
import createGnosisSafeContract from '../../testhelpers/createGnosisSafeContract';
import {signStringMessage, calculateGnosisStringHash} from '@unilogin/contracts';
import {setupWalletContractService} from '../../testhelpers/setupWalletContractService';
import createWalletContract from '../../testhelpers/createWalletContract';

describe('INT: RelayerRequestSignatureValidator', () => {
  let relayerRequestSignatureValidator: RelayerRequestSignatureValidator;
  let wallet: Wallet;
  let provider;

  before(() => {
    provider = new MockProvider();
    [wallet] = provider.getWallets();
    const walletContractService = setupWalletContractService(provider);
    relayerRequestSignatureValidator = new RelayerRequestSignatureValidator(walletContractService);
  });

  it('do not throw exception', async () => {
    const {proxy} = await createWalletContract(wallet);
    await expect(relayerRequestSignatureValidator.ensureValidRelayerRequestSignature(signRelayerRequest({contractAddress: proxy.address}, wallet.privateKey))).to.be.fulfilled;
  });

  it('throw exception', async () => {
    const {proxy} = await createWalletContract(wallet);
    const relayerRequest = signRelayerRequest({contractAddress: proxy.address}, TEST_PRIVATE_KEY);
    await expect(relayerRequestSignatureValidator.ensureValidRelayerRequestSignature(relayerRequest)).to.be.rejectedWith(`Unauthorised address: ${recoverFromRelayerRequest(relayerRequest)}`);
  });

  it('validation works for GnosisSafe', async () => {
    const {proxy, keyPair} = await createGnosisSafeContract(wallet);
    const msgHash = calculateGnosisStringHash(utils.arrayify(utils.toUtf8Bytes(proxy.address)), proxy.address);
    const signature = signStringMessage(msgHash, keyPair.privateKey);
    await expect(relayerRequestSignatureValidator.ensureValidRelayerRequestSignature({signature, contractAddress: proxy.address})).to.be.fulfilled;
  });

  it('throws if no signature', async () => {
    const {proxy} = await createGnosisSafeContract(wallet);
    await expect(relayerRequestSignatureValidator.ensureValidRelayerRequestSignature({contractAddress: proxy.address})).to.be.rejectedWith('Signature not found');
  });

  it('validation works for GnosisSafe', async () => {
    const {proxy} = await createGnosisSafeContract(wallet);
    const msgHash = calculateGnosisStringHash(utils.arrayify(utils.toUtf8Bytes(proxy.address)), proxy.address);
    const signature = signStringMessage(msgHash, TEST_PRIVATE_KEY);
    const testAddress = utils.computeAddress(TEST_PRIVATE_KEY);
    await expect(relayerRequestSignatureValidator.ensureValidRelayerRequestSignature({signature, contractAddress: proxy.address})).to.be.rejectedWith(`Unauthorised address: ${testAddress}`);
  });
});
