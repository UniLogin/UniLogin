interface Identity {
  name: string;
  address: string;
  privateKey: string;
}

export default class IdentityService {
  private identity?: Identity;

  setIdentity(identity: Identity) {
    this.identity = identity;
  }

  getIdentity() {
    return this.identity;
  }
}
