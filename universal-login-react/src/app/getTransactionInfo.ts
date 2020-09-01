import {utils} from 'ethers';
import {Message, PartialRequired, isDataForFunctionCall, ETHER_NATIVE_TOKEN} from '@unilogin/commons';
import {IERC20Interface} from '@unilogin/contracts';
import {DeployedWithoutEmailWallet} from '@unilogin/sdk';

export const getTransactionInfo = async (deployedWallet: DeployedWithoutEmailWallet, transferDetails: PartialRequired<Pick<Message, 'to' | 'value' | 'data'>, 'to' | 'value'>) => {
  if (transferDetails.data && isDataForFunctionCall(transferDetails.data.toString(), IERC20Interface, 'transfer')) {
    const tokenTransfer = new utils.AbiCoder((_, value) => value).decode(
      ['address', 'uint256'],
      `0x${transferDetails.data.toString().slice(10)}`,
    );
    return {
      tokenDetails: await deployedWallet.sdk.tokenDetailsService.getTokenDetails((transferDetails.to)),
      targetAddress: tokenTransfer[0],
      value: tokenTransfer[1].toString(),
    };
  }
  return {
    targetAddress: transferDetails.to,
    value: transferDetails.value,
    tokenDetails: ETHER_NATIVE_TOKEN,
  };
};
