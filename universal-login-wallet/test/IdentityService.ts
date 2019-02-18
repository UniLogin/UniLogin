import {expect} from 'chai';
import IdentityService from '../src/services/IdentityService';

describe('IdentityService', () => {
  it('set identity works', () => {
    const initialIdentity = {
      name: '',
      address: '',
      privateKey: ''
    }
    const identityService = new IdentityService();
    expect(identityService.identity).to.deep.eq(initialIdentity);
    const newIdentity = {
      name: 'new-identity.login.eth',
      address: '0x1234556',
      privateKey: '0x98765'
    }
    identityService.setIdentity(newIdentity);
    expect(identityService.identity).to.deep.eq(newIdentity);
  });
});
