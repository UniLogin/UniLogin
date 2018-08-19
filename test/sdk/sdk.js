import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import EthereumIdentitySDK from '../../lib/sdk/sdk';
import Relayer from '../../lib/relayer/relayer';
import {createMockProvider, defaultAccounts} from 'ethereum-waffle';

chai.use(chaiAsPromised);

const {expect} = chai;

const RELAYER_URL = 'http://127.0.0.1:3311';

describe('SDK - Identity', async () => {
  let provider;
  let relayer;
  let sdk;

  before(async () => {
    relayer = new Relayer(createMockProvider(), defaultAccounts[9].secretKey);
    await relayer.start();
    provider = createMockProvider();
    sdk = new EthereumIdentitySDK(RELAYER_URL, provider);
  });

  describe('Create', async () => {
    let privateKey;
    let identityAddress;

    before(async () => {
      [privateKey, identityAddress] = await sdk.create('alex.ethereum.eth');
    });

    it('should return proper private key and address', async () => {
      expect(privateKey).to.be.properPrivateKey;
      expect(identityAddress).to.be.properAddress;
    });

    xit('should throw exception if invalid request (no private key)', async () => {
    });

    xit('should deploy contract', async () => {
    });

    xit('should register ENS name', async () => {
    });
  });

  after(async () => {
    await relayer.stop();
  });
});
