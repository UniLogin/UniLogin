export default class CreationSerivce {
  sdk: any;
  identityService: any;
  constructor(sdk: any, identityService: any) {
    this.sdk = sdk;
    this.identityService = identityService;
  }

  async create(name: string): Promise<[string, string]> {
    const [privateKey, contractAddress] = await this.sdk.create(name);
    this.identityService.setIdentity({privateKey, contractAddress, name});
    return [privateKey, contractAddress];
  }
}
