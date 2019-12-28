import {AbstractWallet} from './AbstractWallet';
import {Procedure, Nullable} from '@universal-login/commons';

export class ConnectingWallet extends AbstractWallet {
  unsubscribe: Nullable<Procedure> = null;
}
