class AuthorisationService {
  constructor(sdk) {
    this.sdk = sdk;
  }

  subscribe(contractAddress, callback) {
    return this.sdk.subscribe('AuthorisationsChanged', {contractAddress}, (authorisations) => {
      callback(authorisations);
    });
  }
}

export default AuthorisationService;
