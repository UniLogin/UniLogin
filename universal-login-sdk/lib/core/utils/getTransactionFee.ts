import {utils} from 'ethers';
import {createSignedMessage, SignedMessage, Message, ApplicationWallet, TransferDetails, ETHER_NATIVE_TOKEN, UnsignedMessage} from '@universal-login/commons';
import {encodeDataForExecuteSigned, messageToUnsignedMessage} from '@universal-login/contracts';
import UniversalLoginSDK, {encodeTransfer} from '../..';

export const getTransactionFee =
  async (sdk: UniversalLoginSDK, applicationWallet: ApplicationWallet, transferDetails: TransferDetails) => {
    const message = getMessage(transferDetails, sdk, applicationWallet);
    const unsignedMessage = await getUnsignedMessage(sdk, message);
    const signedMessage: SignedMessage = createSignedMessage(unsignedMessage, applicationWallet.privateKey);
    const metaTransaction = {to: message.from, value: 0, data: encodeDataForExecuteSigned(signedMessage)};
    const estimatedGasUsed = (await sdk.provider.estimateGas(metaTransaction)).add(await sdk.provider.estimateGas(message));
    return estimatedGasUsed.mul(utils.bigNumberify(sdk.sdkConfig.paymentOptions.gasPrice));
};

const getMessage = (transferDetails: TransferDetails, sdk: UniversalLoginSDK, applicationWallet: ApplicationWallet): Partial<Message> => {
  if (transferDetails.currency === ETHER_NATIVE_TOKEN.symbol) {
    return {
      from: applicationWallet!.contractAddress,
      to: applicationWallet!.contractAddress,
      value: utils.parseEther(transferDetails.amount),
      data: '0x',
      gasToken: ETHER_NATIVE_TOKEN.address
    };
  }
  const tokenAddress = sdk.tokensDetailsStore.getTokenAddress(transferDetails.currency);
  return {
    from: applicationWallet.contractAddress,
    to: tokenAddress,
    value: 0,
    data: encodeTransfer(applicationWallet!.contractAddress, transferDetails.amount),
    gasToken: tokenAddress
  };
};

const getUnsignedMessage = async (sdk: UniversalLoginSDK, message: Partial<Message>): Promise<UnsignedMessage> => {
  const {gasLimit, gasPrice} = sdk.sdkConfig.paymentOptions;
  const unsignedMessage = messageToUnsignedMessage({gasLimit, gasPrice, ...message});
  unsignedMessage.nonce = await sdk.getNonce(message.from!);
  return unsignedMessage;
};
