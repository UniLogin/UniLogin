import {expect} from 'chai';
import CreationSerivice from '../src/services/CreationService';
import IdentityService from '../src/services/IdentityService';
import setupSdk from './SetupSdk';


describe('CreationService', () => {
  let creationService: any;
  let identityService: any;
  let sdk;
  let relayer: any;

  before(async () => {
    ({sdk, relayer} = await setupSdk());
    identityService = new IdentityService();
    creationService = new CreationSerivice(sdk, identityService);
  });

  it('should create contract wallet and set identity', async () => {
    const name = 'name.mylogin.eth';
    const [privateKey, contractAddress] = await creationService.create(name);
    expect(privateKey).to.not.be.null;
    expect(contractAddress).to.not.be.null;

    const identity = identityService.getIdentity();
    expect(identity.name).to.eq(name);
    expect(identity.privateKey).to.eq(privateKey);
    expect(identity.contractAddress).to.eq(contractAddress);
  });

  after(async () => {
    await relayer.stop();
  });
});
