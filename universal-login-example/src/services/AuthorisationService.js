class AuthorisationService {
  constructor(sdk) {
    this.sdk = sdk;
    this.pendingAuthorisations = [];
  }

  subscribe(contractAddress, callback) {
    return this.sdk.subscribe('AuthorisationsChanged', {contractAddress}, (authorisations) => {
      this.pendingAuthorisations = authorisations;
      callback(authorisations);
    });
  }
}

export default AuthorisationService;
