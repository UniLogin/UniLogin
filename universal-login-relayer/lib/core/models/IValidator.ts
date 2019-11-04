import {SignedMessage} from '@universal-login/commons';

export interface IValidator {
  validate: (message: SignedMessage) => Promise<void>;
}

export default IValidator;
