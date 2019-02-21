export default class CreationSerivce {
  sdk: any;
  userWalletService: any;
  constructor(sdk: any, userWalletService: any) {
    this.sdk = sdk;
    this.userWalletService = userWalletService;
  }

  async create(name: string): Promise<[string, string]> {
    const [privateKey, contractAddress] = await this.sdk.create(name);
    this.userWalletService.userWallet = {privateKey, contractAddress, name};
    return [privateKey, contractAddress];
  }
}
