import ethers, {utils, Wallet} from 'ethers';
import Token from './Token';
import DEFAULT_PAYMENT_OPTIONS from '../config/defaultPaymentOptions';

class IdentityService {
  constructor(sdk, emitter, tokenAddress) {
    this.sdk = sdk;
    this.emitter = emitter;
    this.tokenAddress = tokenAddress;
    this.identity = {};
  }

  async create(name) {
    const [privateKey, address] = await this.sdk.create(name);
    this.identity = {
      name,
      privateKey,
      address
    };
    return this.identity;
  }

  async sendTokens(toAddress, numTokens) {
    const message = {
      to: this.tokenAddress,
      from: this.identity.address,
      value: 0,
      data: new utils.Interface(Token.interface).functions.transfer.encode([toAddress, utils.parseEther(numTokens.toString())]),
      gasToken: this.tokenAddress,
      ...DEFAULT_PAYMENT_OPTIONS
    };
    await this.execute(message);
  }

  async execute(message) {
    await this.sdk.execute(
      message,
      this.identity.privateKey
    );
  }
}

export default IdentityService;
