import {providers} from 'ethers';
import {ETHER_NATIVE_TOKEN, etherFormatOf} from 'universal-login-commons';
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
  console.log(amount)
  const {wallet} = connect(nodeUrl, privateKey, provider);
  const value = etherFormatOf(amount);

  switch(currency.toUpperCase()) {
    case ETHER_NATIVE_TOKEN.symbol: {
      return await wallet.sendTransaction({to, value});
    }
    default: {
      throw new Error(`${currency} is not supported yet. Supported currencies: ${ETHER_NATIVE_TOKEN.symbol}`)
    }
  }
}
