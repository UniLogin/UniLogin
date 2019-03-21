import {providers, utils} from 'ethers';
import {ETHER_NATIVE_TOKEN} from 'universal-login-commons';
import {connect} from '../cli/connectAndExecute';

const MAX_DECIMAL_PLACES = 15;

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
  const fixedAmount = amount.toFixed(MAX_DECIMAL_PLACES);
  const value = utils.parseEther(fixedAmount);

  switch(currency.toLocaleUpperCase()) {
    case ETHER_NATIVE_TOKEN.symbol: {
      return await wallet.sendTransaction({to, value});
    }
    default: {
      throw new Error(`${currency} is not supported yet. Supported currencies: ${ETHER_NATIVE_TOKEN.symbol}`)
    }
  }
}
