import {SignedMessage} from '@universal-login/commons';

export interface IMessageValidator {
  validate: (message: SignedMessage) => void;
}

export default IMessageValidator;
