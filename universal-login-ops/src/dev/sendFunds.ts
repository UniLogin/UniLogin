import {providers, utils} from 'ethers';
import {ETHER_NATIVE_TOKEN} from 'universal-login-commons';
import {connect} from '../cli/connectAndExecute';

export interface sendFundsParameters {
  nodeUrl : string;
  privateKey : string;
  to : string;
  amount : number;
  currency : string;
  provider?: providers.Provider;
}

export const sendFunds = async ({nodeUrl, privateKey, to, amount, currency, provider} : sendFundsParameters) => {
  const {wallet} = connect(nodeUrl, privateKey, provider);
  const value = utils.parseEther(amount.toString());

  switch(currency) {
    case ETHER_NATIVE_TOKEN.symbol: {
      return await wallet.sendTransaction({to, value});
    }
    default: {
      throw new Error(`${currency} is not supported yet. Supported currencies: ${ETHER_NATIVE_TOKEN.symbol}`)
    }
  }
}
