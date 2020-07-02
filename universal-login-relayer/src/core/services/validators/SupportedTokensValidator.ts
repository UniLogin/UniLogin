import {IMessageValidator, SignedMessage, SupportedToken, ensureNotFalsy} from '@unilogin/commons';
import {UnsupportedToken} from '../../utils/errors';

export class SupportedTokensValidator implements IMessageValidator {
  constructor(private supportedTokens: SupportedToken[]) {
  }

  validate(signedMessage: SignedMessage) {
    ensureNotFalsy(this.supportedTokens.find((token) => token.address === signedMessage.gasToken), UnsupportedToken, signedMessage.gasToken);
  }
}
