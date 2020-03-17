import {AbstractWallet} from './AbstractWallet';
import {Procedure, Nullable} from '@unilogin/commons';
import UniversalLoginSDK from '../sdk';

export class ConnectingWallet extends AbstractWallet {
  constructor(
    contractAddress: string,
    name: string,
    privateKey: string,
    readonly sdk: UniversalLoginSDK,
  ) {
    super(contractAddress, name, privateKey);
  }

  unsubscribe: Nullable<Procedure> = null;

  async cancelRequest() {
    const authorisationRequest = {contractAddress: this.contractAddress};
    await this.sdk.walletContractService.signRelayerRequest(this.privateKey, authorisationRequest);
    return this.sdk.relayerApi.cancelConnection(authorisationRequest);
  }
}
