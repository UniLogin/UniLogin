import {providers, utils} from 'ethers';
import {ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {connect} from '../cli/connectAndExecute';


export interface SendFundsParameters {
  nodeUrl : string;
  privateKey : string;
  to : string;
  amount : string;
  currency : string;
  provider?: providers.Provider;
}

export const sendFunds = async ({nodeUrl, privateKey, to, amount, currency, provider} : SendFundsParameters) => {
  const {wallet} = connect(nodeUrl, privateKey, provider);
  const value = utils.parseEther(amount);

  switch (currency.toUpperCase()) {
    case ETHER_NATIVE_TOKEN.symbol: {
      await wallet.sendTransaction({to, value});
      console.log(`       Sent ${amount} ${currency} to ${to}`);
      return;
    }
    default: {
      throw new Error(`${currency} is not supported yet. Supported currencies: ${ETHER_NATIVE_TOKEN.symbol}`);
    }
  }
};
