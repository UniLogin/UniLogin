interface identity {
  name: string;
  address: string;
  privateKey: string;
};

export default class IdentityService {
  identity: identity;

  constructor() {
    this.identity = {
      name: '',
      address: '',
      privateKey: '',
    };
  }

  setIdentity(identity: identity) {
    this.identity = {...this.identity, ...identity};
  }
}
