import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {createFixtureLoader, solidity, createMockProvider} from 'ethereum-waffle';
import basicWallet from '../../fixtures/basicWallet';
import walletMasterAndProxy from '../../fixtures/walletMasterAndProxy';
import {Contract} from 'ethers';

chai.use(chaiAsPromised);
chai.use(solidity);

describe('ERC1077 unified', async  () => {
  let walletContract : Contract;
  let publicKey : string;
  let proxyAsWalletContract;
  let loadFixture : ReturnType<typeof createFixtureLoader>;

  before(async () => {
    loadFixture = await createFixtureLoader(createMockProvider());
  });

  async function erc1077() {
    ({walletContract, publicKey} = await loadFixture(basicWallet));
    proxyAsWalletContract = walletContract;
  }

  async function erc1077Master() {
    ({proxyAsWalletContract, publicKey} = await loadFixture(walletMasterAndProxy));
    walletContract = proxyAsWalletContract;
  }

  [erc1077, erc1077Master].forEach((configuration) => {
    describe(configuration.name, () => {
      beforeEach(async () => {
        await configuration();
      });

      it('construction', async () => {
        expect(await walletContract.lastNonce()).to.eq(0);
        expect(await walletContract.keyExist(publicKey)).to.be.true;
        expect(await walletContract.keyExist('0x0000000000000000000000000000000000000000')).to.be.false;
      });
    });
  });
});