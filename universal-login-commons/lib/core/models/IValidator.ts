import {SignedMessage} from './message';

export interface IValidator {
  validate: (message: SignedMessage) => Promise<void>;
}
