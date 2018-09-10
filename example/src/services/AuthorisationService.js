class AuthorisationService {
  constructor(sdk, emitter) {
    this.sdk = sdk;
    this.emitter = emitter;
  }

  async requestAuthorisation(identityAddress) {
    this.privateKey = await this.sdk.requestAuthorisation(identityAddress);
  }

  async getPendingAuthorisations(identityAddress) {
    return await this.sdk.getPendingAuthorisations(identityAddress);
  }

  async subscribe(eventType, identityAddress) {
    await this.sdk.subscribe(identityAddress, eventType);
  }
}

export default AuthorisationService;