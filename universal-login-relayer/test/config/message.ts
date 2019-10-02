import {TEST_ACCOUNT_ADDRESS, TEST_PRIVATE_KEY, Message} from '@universal-login/commons';
import {messageToSignedMessage, emptyMessage} from '@universal-login/contracts';

export const getTestSignedMessage = (overrides?: Partial<Message>) => messageToSignedMessage({...emptyMessage, from: TEST_ACCOUNT_ADDRESS, to: TEST_ACCOUNT_ADDRESS, ...overrides}, TEST_PRIVATE_KEY);

export default getTestSignedMessage;
