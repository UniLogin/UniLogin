class AuthorisationService {
  constructor(sdk) {
    this.sdk = sdk;
    this.pendingAuthorisations = [];
  }

  subscribe(identityAddress, callback) {
    this.sdk.subscribe('AuthorisationsChanged', identityAddress, (authorisations) => {
      this.pendingAuthorisations = authorisations;
      callback(authorisations);
    });
  }
}

export default AuthorisationService;