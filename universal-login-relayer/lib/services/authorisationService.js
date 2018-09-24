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

  removeRequest(identityAddress, key) {
    const lowKey = key.toLowerCase();
    this.pendingAuthorisations[identityAddress] = this.pendingAuthorisations[identityAddress] || [];
    this.pendingAuthorisations[identityAddress] = this.pendingAuthorisations[identityAddress].filter((element) => element.key.toLowerCase() !== lowKey);
  }
}

export default AuthorisationService;
