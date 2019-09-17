import {SignedMessage} from '@universal-login/commons';

export interface IMessageValidator {
  validate: (message: SignedMessage) => Promise<void> | void;
}

export default IMessageValidator;
