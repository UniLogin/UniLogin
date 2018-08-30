import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import EthereumIdentitySDK from '../../lib/sdk/sdk';
import Relayer from '../../lib/relayer/relayer';
import {createMockProvider, defaultAccounts, getWallets} from 'ethereum-waffle';
import {utils} from 'ethers';

chai.use(chaiAsPromised);

const {expect} = chai;

const RELAYER_URL = 'http://127.0.0.1:3311';

describe('SDK - Identity', async () => {
  const privateKey = defaultAccounts[9].secretKey;
  let provider;
  let relayer;
  let sdk;
  let otherWallet;
  let sponsor;

  before(async () => {
    provider = createMockProvider();
    [otherWallet, sponsor] = await getWallets(provider);
    relayer = new Relayer(provider, {privateKey});
    await relayer.start();
    sdk = new EthereumIdentitySDK(RELAYER_URL, provider);
  });

  describe('Create', async () => {
    let privateKey;
    let identityAddress;

    before(async () => {
      [privateKey, identityAddress] = await sdk.create('alex.ethereum.eth');
      sponsor.send(identityAddress, 10000);
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

    describe('Execute signed message', async () => {
      let expectedBalance;
      let nonce;
      let message;

      before(async () => {
        message = {
          to: otherWallet.address,
          value: 10,
          data: utils.hexlify(0)
        };
        expectedBalance = (await otherWallet.getBalance()).add(10);
        nonce = await sdk.execute(identityAddress, message, privateKey);
      });

      it('Should execute signed message', async () => {      
        expect(await otherWallet.getBalance()).to.eq(expectedBalance);
      });

      it('Should return 0 as first nonce', async () => {
        expect(nonce).to.eq(0);
      });

      it('Should return 1 as second nonce', async () => {
        expect(await sdk.execute(identityAddress, message, privateKey)).to.eq(1);
      });
    });
  });

  after(async () => {
    await relayer.stop();
  });
});
