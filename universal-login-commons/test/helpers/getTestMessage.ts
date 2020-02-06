import {utils} from 'ethers';
import {AddressZero} from 'ethers/constants';
import {Message, OperationType, SignedMessage, UnsignedMessage} from '../../src/core/models/message';
import {TEST_CONTRACT_ADDRESS, TEST_ACCOUNT_ADDRESS, EMPTY_DATA, TEST_GAS_PRICE, calculateMessageSignature, ETHER_NATIVE_TOKEN} from '../../src';

export function getTestMessage(messageOverrides: Partial<Message> = {}): UnsignedMessage {
  return {
    from: TEST_CONTRACT_ADDRESS,
    to: TEST_ACCOUNT_ADDRESS,
    value: utils.parseEther('0.5'),
    data: EMPTY_DATA,
    nonce: 0,
    operationType: OperationType.call,
    refundReceiver: AddressZero,
    gasPrice: TEST_GAS_PRICE,
    safeTxGas: utils.bigNumberify(190000),
    baseGas: utils.bigNumberify(10000),
    gasToken: ETHER_NATIVE_TOKEN.address,
    ...messageOverrides,
  };
}

export function getTestSignedMessage(privateKey: string, messageOverrides?: Partial<UnsignedMessage>): SignedMessage {
  const message = getTestMessage(messageOverrides);
  return {
    ...message,
    signature: calculateMessageSignature(privateKey, message),
  };
}
