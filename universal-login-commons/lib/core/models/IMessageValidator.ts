import {SignedMessage} from './message';

export interface IMessageValidator {
  validate: (message: SignedMessage) => Promise<void> | void;
}
