import {providers, utils} from 'ethers';
import {ETHER_NATIVE_TOKEN} from '@unilogin/commons';
import {connectToEthereumNode} from '../cli/connectAndExecute';
import {IERC20Interface} from '@unilogin/contracts';

export interface SendFundsParameters {
  nodeUrl: string;
  privateKey: string;
  to: string;
  amount: string;
  currency: string;
  provider?: providers.Provider;
}

export const sendFunds = async ({nodeUrl, privateKey, to, amount, currency, provider}: SendFundsParameters) => {
  const {wallet} = connectToEthereumNode(nodeUrl, privateKey, provider);
  const value = utils.parseEther(amount);

  switch (currency.toUpperCase()) {
    case ETHER_NATIVE_TOKEN.symbol: {
      await wallet.sendTransaction({to, value});
      console.log(`       Sent ${amount} ${currency} to ${to}`);
      return;
    }
    case 'DAI': {
      const daiAddressOnDevelopment = '0x9Ad7E60487F3737ed239DAaC172A4a9533Bd9517';
      const data = IERC20Interface.functions.transfer.encode([to, value]);
      await wallet.sendTransaction({to: daiAddressOnDevelopment, data});
      console.log(`       Sent ${amount} ${currency} to ${to}`);
      return;
    }
    default: {
      throw new Error(`${currency} is not supported yet. Supported currencies: ${ETHER_NATIVE_TOKEN.symbol}, DAI`);
    }
  }
};
