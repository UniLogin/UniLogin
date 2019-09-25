import {utils} from 'ethers';
import IERC20 from 'openzeppelin-solidity/build/contracts/IERC20.json';
import {ETHER_NATIVE_TOKEN, ensure, ensureNotNull, isProperAddress, TransferDetails, ApplicationWallet, Message, SignedMessage, createSignedMessage} from '@universal-login/commons';
import UniversalLoginSDK from '../../api/sdk';
import {ApplicationWalletNotFound, InvalidAddress} from '../../core/utils/errors';
import {messageToUnsignedMessage, encodeDataForExecuteSigned} from '@universal-login/contracts';

export class TransferService {
  constructor(private sdk: UniversalLoginSDK, private applicationWallet: ApplicationWallet) {}

  async transfer(transferDetails: TransferDetails) {
    ensure(isProperAddress(transferDetails.to), InvalidAddress, transferDetails.to);
    ensureNotNull(this.applicationWallet, ApplicationWalletNotFound);
    if (transferDetails.currency === ETHER_NATIVE_TOKEN.symbol) {
      return this.transferEther(transferDetails);
    } else {
      return this.transferTokens(transferDetails);
    }
  }

  private async transferTokens({to, amount, currency} : TransferDetails) {
    const tokenAddress = this.sdk.tokensDetailsStore.getTokenAddress(currency);
    let message: Partial<Message> = {
      from: this.applicationWallet!.contractAddress,
      to: tokenAddress,
      value: 0,
      data: encodeTransfer(to, utils.parseEther(amount)),
      gasToken: tokenAddress
    };
    message = await this.changeMessageIfAmountMax(message, utils.parseEther(amount), to);
    return this.sdk.execute(message, this.applicationWallet!.privateKey);
  }

  private async transferEther({to, amount} : TransferDetails) {
    let message: Partial<Message> = {
      from: this.applicationWallet!.contractAddress,
      to,
      value: utils.parseEther(amount),
      data: '0x',
      gasToken: ETHER_NATIVE_TOKEN.address
    };
    message = await this.changeMessageIfAmountMax(message, utils.parseEther(amount));
    return this.sdk.execute(message, this.applicationWallet!.privateKey);
  }

  public async changeMessageIfAmountMax(message: Partial<Message>, amount: utils.BigNumber, to?: string) {
    if (await this.checkIfAmountIsMax(message.gasToken!, amount)) {
      if (message.gasToken === ETHER_NATIVE_TOKEN.address) {
        return {...message, ...{value: await this.calculateNewAmount(message, amount)}};
      }
      return {...message, ...{data: encodeTransfer(to!, await this.calculateNewAmount(message, amount))}};
    }
    return message;
  }

  public async checkIfAmountIsMax(tokenAddress: string, amount: utils.BigNumber) {
    return (await this.sdk.balanceChecker.getBalance(this.applicationWallet.contractAddress, tokenAddress)).eq(amount);
  }

  public async calculateNewAmount(message: Partial<Message>, amount: utils.BigNumber) {
    const unsignedMessage = await this.getUnsignedMessage(message);
    const signedMessage: SignedMessage = createSignedMessage(unsignedMessage, this.applicationWallet.privateKey);
    const metaTransaction = {to: message.from, value: 0, data: encodeDataForExecuteSigned(signedMessage)};
    const estimatedGasUsed = (await this.sdk.provider.estimateGas(metaTransaction)).add(await this.sdk.provider.estimateGas(message));
    const estimatedGasCost = estimatedGasUsed.mul(utils.bigNumberify(this.sdk.sdkConfig.paymentOptions.gasPrice));
    return amount.sub(estimatedGasCost);
  }

  private async getUnsignedMessage(message: Partial<Message>) {
    const {gasLimit, gasPrice} = this.sdk.sdkConfig.paymentOptions;
    const unsignedMessage = messageToUnsignedMessage({gasLimit, gasPrice, ...message});
    unsignedMessage.nonce = await this.sdk.getNonce(message.from!);
    return unsignedMessage;
    }
}

export const encodeTransfer = (to: string, amount: utils.BigNumber) => {
  return new utils.Interface(IERC20.abi).functions.transfer.encode([to, amount]);
};
