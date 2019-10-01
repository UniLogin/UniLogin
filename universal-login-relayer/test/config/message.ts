import {TEST_ACCOUNT_ADDRESS, TEST_PRIVATE_KEY, Message} from '@universal-login/commons';
import {createSignedMessage} from '@universal-login/contracts';

export const getTestSignedMessage = (overrides?: Partial<Message>) => createSignedMessage({from: TEST_ACCOUNT_ADDRESS, to: TEST_ACCOUNT_ADDRESS, ...overrides}, TEST_PRIVATE_KEY);

export default getTestSignedMessage;
