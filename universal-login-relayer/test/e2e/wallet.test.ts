import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {utils, Wallet, Contract} from 'ethers';
import {AddressZero} from 'ethers/constants';
import {DEFAULT_GAS_LIMIT, stringifySignedMessageFields, OperationType, TEST_GAS_PRICE, KeyPair, TEST_REFUND_PAYER, ETHER_NATIVE_TOKEN, TEST_TOKEN_ADDRESS, TEST_GAS_PRICE_IN_TOKEN} from '@unilogin/commons';
import {waitExpect} from '@unilogin/commons/testutils';
import {startRelayer} from '../testhelpers/http';
import {getGnosisTestSignedMessage, getTestSignedMessage} from '../testconfig/message';
import {deployGnosisSafeProxyWithENS} from '../testhelpers/createGnosisSafeContract';
import Relayer from '../../src';

chai.use(chaiHttp);

describe('E2E: Relayer - WalletContract routes', () => {
  let relayer: Relayer;
  let otherWallet: Wallet;
  let contract: Contract;
  let deployer: Wallet;
  let ensAddress: string;
  let mockToken: Contract;
  let walletContract: Contract;
  let factoryContract: Contract;
  let keyPair: KeyPair;
  const relayerPort = '33511';
  let ensRegistrar: Contract;

  before(async () => {
    ({relayer, deployer, otherWallet, mockToken, ensAddress, walletContract, factoryContract, ensRegistrar} = await startRelayer(relayerPort));
    ({proxyContract: contract, keyPair} = await deployGnosisSafeProxyWithENS(deployer, factoryContract.address, walletContract.address, 'name.mylogin.eth', ensAddress, ensRegistrar.address, TEST_GAS_PRICE));
    await mockToken.transfer(contract.address, utils.parseEther('10.0'));
  });

  describe('Execute signed transfer', () => {
    const checkMessageState = async (messageHash: string) => {
      const {body: messageStatus} = await chai.request((relayer as any).server)
        .get(`/wallet/execution/${messageHash}`);
      expect(messageStatus.state).eq('Success');
    };

    const getTransferMessage = async (gasPrice: utils.BigNumberish, gasToken = ETHER_NATIVE_TOKEN.address) => ({
      from: contract.address,
      to: otherWallet.address,
      value: 1000000000,
      data: '0x0',
      nonce: await contract.nonce(),
      operationType: OperationType.call,
      refundReceiver: deployer.address,
      gasToken,
      gasPrice,
      gasLimit: DEFAULT_GAS_LIMIT,
    });

    it('basic', async () => {
      const msg = await getTransferMessage(TEST_GAS_PRICE_IN_TOKEN, mockToken.address);
      const balanceBefore = await otherWallet.getBalance();
      const signedMessage = getGnosisTestSignedMessage(msg, keyPair.privateKey);
      const stringifiedMessage = stringifySignedMessageFields(signedMessage);
      const {status, body} = await chai.request((relayer as any).server)
        .post('/wallet/execution')
        .send(stringifiedMessage);
      expect(status).to.eq(201, body.error);
      await waitExpect(() => checkMessageState(body.status.messageHash));
      expect(await otherWallet.getBalance()).to.eq(balanceBefore.add(msg.value));
    });

    it('free', async () => {
      const msg = await getTransferMessage(0);
      const balanceBefore = await relayer.provider.getBalance(contract.address);
      expect(balanceBefore.gt(utils.bigNumberify(msg.value))).to.be.true;
      const signedMessage = getGnosisTestSignedMessage(msg, keyPair.privateKey);
      const stringifiedMessage = stringifySignedMessageFields(signedMessage);
      const {status, body} = await chai.request((relayer as any).server)
        .post('/wallet/execution')
        .set('api_key', TEST_REFUND_PAYER.apiKey)
        .send(stringifiedMessage);
      expect(status).to.eq(201, body.error);
      await waitExpect(() => checkMessageState(body.status.messageHash));
      expect(await relayer.provider.getBalance(contract.address)).to.eq(balanceBefore.sub(msg.value));
    });

    it('fails for gasToken not eth', async () => {
      const msg = await getTransferMessage(utils.parseUnits('100', 'gwei'), TEST_TOKEN_ADDRESS);
      const signedMessage = getGnosisTestSignedMessage(msg, keyPair.privateKey);
      const stringifiedMessage = stringifySignedMessageFields(signedMessage);
      const {status, body} = await chai.request((relayer as any).server)
        .post('/wallet/execution')
        .send(stringifiedMessage);
      expect(status).to.eq(400);
      expect(body.error).to.eq(`Error: Token: ${TEST_TOKEN_ADDRESS} is not supported.`);
    });
  });

  it('Execution fail if gasPrice is 0 and no apiKey', async () => {
    const result = await chai.request((relayer as any).server)
      .post('/wallet/execution/')
      .send(stringifySignedMessageFields(getTestSignedMessage({gasPrice: 0})));
    expect(result.status).eq(400);
    expect(result.error.text).contain('Invalid api key: undefined');
  });

  it('status is 400 if refundReceiver isn`t relayer', async () => {
    const msg = {
      from: contract.address,
      to: otherWallet.address,
      value: 1000000000,
      data: [],
      nonce: '0',
      operationType: OperationType.call,
      refundReceiver: AddressZero,
      gasToken: mockToken.address,
      gasPrice: 100000,
      gasLimit: DEFAULT_GAS_LIMIT,
    };
    const signedMessage = getGnosisTestSignedMessage(msg, keyPair.privateKey);
    const stringifiedMessage = stringifySignedMessageFields(signedMessage);
    const {status, body} = await chai.request((relayer as any).server)
      .post('/wallet/execution')
      .send(stringifiedMessage);
    expect(status).to.eq(400);
    expect(body.error).to.eq(`Error: Invalid refund receiver. Expected address: ${deployer.address}`);
  });

  it('Execution returns 400 if validations fails', async () => {
    const message = {
      to: '0x63FC2aD3d021a4D7e64323529a55a9442C444dA0',
      value: '500000000000000000',
      data: '0x0',
      nonce: utils.bigNumberify(2),
      operationType: OperationType.call,
      refundReceiver: AddressZero,
      gasPrice: '1000000000',
      safeTxGas: '1000000',
      baseGas: '0',
      gasToken: '0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA',
      from: '0xd9822CF2a4C3AccD2AF175A5dF0376D46Dcb848d',
      signature: '0x24e58b6f9cb3f7816110df9116562d6052982ee799fc7004153fb20d2cda21a434d71b8fe6669978c9dd803dfed465e563da0f68b5d45bf35ecc089d79a18eae1c',
    };
    const {status, body} = await chai.request((relayer as any).server)
      .post('/wallet/execution')
      .send(message);
    expect(status).to.eq(400);
    expect(body.error).to.deep.eq([{path: 'body.nonce', expected: 'string'}]);
  });

  after(async () => {
    await (relayer as any).stop();
  });
});
