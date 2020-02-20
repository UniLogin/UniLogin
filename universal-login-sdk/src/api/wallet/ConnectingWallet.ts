import {AbstractWallet} from './AbstractWallet';
import {Procedure, Nullable} from '@unilogin/commons';

export class ConnectingWallet extends AbstractWallet {
  unsubscribe: Nullable<Procedure> = null;
}
