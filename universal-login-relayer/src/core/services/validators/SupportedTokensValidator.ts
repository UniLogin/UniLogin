import {IMessageValidator, SignedMessage, SupportedToken, ensureNotFalsy, addressEquals} from '@unilogin/commons';
import {UnsupportedToken} from '../../utils/errors';

export class SupportedTokensValidator implements IMessageValidator {
  constructor(private supportedTokens: SupportedToken[]) {
  }

  validate(signedMessage: SignedMessage) {
    ensureNotFalsy(this.supportedTokens.find((token) => addressEquals(token.address, signedMessage.gasToken)), UnsupportedToken, signedMessage.gasToken);
  }
}
