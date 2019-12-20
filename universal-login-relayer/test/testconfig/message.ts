import {TEST_ACCOUNT_ADDRESS, TEST_PRIVATE_KEY, Message, CURRENT_NETWORK_VERSION, CURRENT_WALLET_VERSION} from '@universal-login/commons';
import {messageToSignedMessage} from '@universal-login/contracts';
import {emptyMessage} from '@universal-login/contracts/testutils';

export const getTestSignedMessage = (overrides?: Partial<Message>, privateKey: string = TEST_PRIVATE_KEY) => {
  const exampleMessage = {...emptyMessage, from: TEST_ACCOUNT_ADDRESS, to: TEST_ACCOUNT_ADDRESS, ...overrides};
  return messageToSignedMessage(exampleMessage, privateKey, CURRENT_NETWORK_VERSION, CURRENT_WALLET_VERSION);
};
