import {TEST_ACCOUNT_ADDRESS, TEST_PRIVATE_KEY, Message, CURRENT_NETWORK_VERSION, CURRENT_WALLET_VERSION} from '@unilogin/commons';
import {messageToSignedMessage} from '@unilogin/contracts';
import {emptyMessage} from '@unilogin/contracts/testutils';

export const getTestSignedMessage = (overrides?: Partial<Message>, privateKey: string = TEST_PRIVATE_KEY) => {
  const exampleMessage = {...emptyMessage, from: TEST_ACCOUNT_ADDRESS, to: TEST_ACCOUNT_ADDRESS, ...overrides};
  return messageToSignedMessage(exampleMessage, privateKey, CURRENT_NETWORK_VERSION, CURRENT_WALLET_VERSION);
};

export const getGnosisTestSignedMessage = (overrides?: Partial<Message>, privateKey: string = TEST_PRIVATE_KEY) => {
  const exampleMessage = {...emptyMessage, from: TEST_ACCOUNT_ADDRESS, to: TEST_ACCOUNT_ADDRESS, ...overrides};
  return messageToSignedMessage(exampleMessage, privateKey, CURRENT_NETWORK_VERSION, 'beta3');
};
