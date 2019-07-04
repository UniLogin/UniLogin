import {SignedMessage} from '@universal-login/commons';

export interface MessageEntity {
  messageHash: string;
  transactionHash: string | undefined;
  error: string | undefined;
  message: SignedMessage;
}
