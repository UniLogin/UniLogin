import {utils} from 'ethers';
import {expect} from 'chai';
import {SignedMessage, TEST_CONTRACT_ADDRESS, Message, TEST_ACCOUNT_ADDRESS, EMPTY_DATA, DEFAULT_GAS_PRICE, DEFAULT_GAS_LIMIT, ETHER_NATIVE_TOKEN, TEST_PRIVATE_KEY} from '@universal-login/commons';
import {messageToUnsignedMessage, unsignedMessageToSignedMessage, messageToSignedMessage} from '../lib/message';

const {bigNumberify} = utils;

const message: Partial<Message> = {
  from: TEST_CONTRACT_ADDRESS,
  to: TEST_CONTRACT_ADDRESS,
  value: utils.parseEther('1'),
  gasPrice: DEFAULT_GAS_PRICE,
  gasToken: ETHER_NATIVE_TOKEN.address,
  data: '0xbeef',
  gasLimit: bigNumberify(100000),
  nonce: 0,
};

describe('Message', () => {
  it('messageToSignedMessage for constantinople', () => {
    const networkVersion = 'constantinople';
    const walletVersion = 'beta2';
    const actualMessage = messageToSignedMessage(message, TEST_PRIVATE_KEY, networkVersion, walletVersion);
    const expectedMessage = {
      from: TEST_CONTRACT_ADDRESS,
      to: TEST_CONTRACT_ADDRESS,
      value: utils.parseEther('1'),
      gasPrice: DEFAULT_GAS_PRICE,
      gasToken: ETHER_NATIVE_TOKEN.address,
      data: '0xbeef',
      nonce: 0,
      gasBase: bigNumberify(58976),
      gasCall: bigNumberify(41024),
      signature: '0x21e8b320262f1b6bf8c99997a632a86bdc0fe6424ccea8a4293766fc1c690cbd2f0dbd969bad91e9e400bc9707988fbee2adead8ba9ee0366c258b210eae61fd1c',
    };
    expect(actualMessage).to.deep.eq(expectedMessage);
  });

  it('messageToSignedMessage for istanbul', () => {
    const networkVersion = 'istanbul';
    const walletVersion = 'beta2';
    const actualMessage = messageToSignedMessage(message, TEST_PRIVATE_KEY, networkVersion, walletVersion);
    const expectedMessage = {
      from: TEST_CONTRACT_ADDRESS,
      to: TEST_CONTRACT_ADDRESS,
      value: utils.parseEther('1'),
      gasPrice: DEFAULT_GAS_PRICE,
      gasToken: ETHER_NATIVE_TOKEN.address,
      data: '0xbeef',
      nonce: 0,
      gasBase: bigNumberify(53152),
      gasCall: bigNumberify(46848),
      signature: '0x26aaabf3c44e63238e88b3da0da13953dd4a111999b11252d45f75a18974f9665ef56d45a92d1340296241b746c8c4bb5ed511d1ee3e30d599311fdfffad27581c',
    };
    expect(actualMessage).to.deep.eq(expectedMessage);
  });

  it('messageToUnsignedMessage for constantinople', async () => {
    const networkVersion = 'constantinople';
    const walletVersion = 'beta2';
    const expectedUnsignedMessage: Partial<SignedMessage> = {
      from: TEST_CONTRACT_ADDRESS,
      to: TEST_CONTRACT_ADDRESS,
      value: utils.parseEther('1'),
      gasPrice: DEFAULT_GAS_PRICE,
      gasToken: ETHER_NATIVE_TOKEN.address,
      data: '0xbeef',
      gasBase: bigNumberify(58976),
      gasCall: bigNumberify(100000 - 58976),
      nonce: 0,
    };

    const actualUnsginedMessage = messageToUnsignedMessage(message, networkVersion, walletVersion);
    expect(actualUnsginedMessage).to.deep.equal(expectedUnsignedMessage);
  });

  it('messageToUnsignedMessage for istanbul', async () => {
    const networkVersion = 'istanbul';
    const walletVersion = 'beta2';
    const expectedUnsignedMessage: Partial<SignedMessage> = {
      from: TEST_CONTRACT_ADDRESS,
      to: TEST_CONTRACT_ADDRESS,
      value: utils.parseEther('1'),
      gasPrice: DEFAULT_GAS_PRICE,
      gasToken: ETHER_NATIVE_TOKEN.address,
      data: '0xbeef',
      gasBase: bigNumberify(53152),
      gasCall: bigNumberify(100000 - 53152),
      nonce: 0,
    };

    const actualUnsginedMessage = messageToUnsignedMessage(message, networkVersion, walletVersion);
    expect(actualUnsginedMessage).to.deep.equal(expectedUnsignedMessage);
  });

  it('unsignedMessageToSignedMessage', async () => {
    const transferMessage = {
      to: TEST_ACCOUNT_ADDRESS,
      value: utils.parseEther('0.5'),
      data: EMPTY_DATA,
      nonce: '0',
      gasPrice: DEFAULT_GAS_PRICE,
      gasCall: DEFAULT_GAS_LIMIT,
      gasBase: '0',
      gasToken: '0x0000000000000000000000000000000000000000',
    };

    const expectedMessage = {
      from: '0x',
      to: TEST_ACCOUNT_ADDRESS,
      value: utils.parseEther('0.5'),
      data: EMPTY_DATA,
      nonce: '0',
      gasPrice: transferMessage.gasPrice,
      gasCall: transferMessage.gasCall,
      gasBase: '0',
      gasToken: '0x0000000000000000000000000000000000000000',
      signature: '0x6da7c3dfa9aaa0f07b7be6f7338de2a5cf6719ee523f40560f79ace402a9008f79cd86bd59709d5947e0228fe596e9188fc508889984aabebe504d6b8a9a5cdd1c',
    };

    const signedMessage = unsignedMessageToSignedMessage({...transferMessage, from: '0x'}, TEST_PRIVATE_KEY);
    expect(signedMessage).to.deep.eq(expectedMessage);
  });
});
