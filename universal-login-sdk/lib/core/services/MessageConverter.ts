import {providers} from 'ethers';
import {Message} from '@universal-login/commons';
import {messageToSignedMessage} from '@universal-login/contracts';

export class MessageConverter {
  constructor(private provider: providers.Provider) {

  }

  async messageToSignedMessage(message: Partial<Message>, privateKey: string) {
    return messageToSignedMessage(message, privateKey);
  }
}
