import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import EthereumIdentitySDK from '../../lib/sdk/index';
chai.use(chaiAsPromised);

const {expect} = chai;

describe('Identity', async () => {
  let sdk;

  beforeEach(async () => {
    sdk = new EthereumIdentitySDK();
  });

  it('create', async () => {
    expect(sdk.create()).to.eq('done');
  });
});
