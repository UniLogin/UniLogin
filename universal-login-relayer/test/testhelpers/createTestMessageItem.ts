import {SignedMessage} from '@unilogin/commons';
import {createMessageItem} from '../../src/core/utils/messages/serialisation';

export const createTestMessageItem = (signedMessage: SignedMessage, refundPayerId?: string) => createMessageItem(signedMessage, '1', refundPayerId);
