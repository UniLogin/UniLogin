class AuthorisationService {
  constructor() {
    this.pendingAuthorisations = {};
    this.index = 0;
  }

  addRequest(request) {
    const {identityAddress, key, label} = request;
    const {index} = this;
    const pendingAuthorisation = {key, label, index};
    this.pendingAuthorisations[identityAddress] = this.pendingAuthorisations[identityAddress] || [];
    this.pendingAuthorisations[identityAddress].push(pendingAuthorisation);
    this.index++;
  }

  getPendingAuthorisations(identityAddress) {
    return this.pendingAuthorisations[identityAddress] || [];
  }
}

export default AuthorisationService;
