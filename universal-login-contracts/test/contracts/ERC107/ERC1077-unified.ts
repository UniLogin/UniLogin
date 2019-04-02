import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {createFixtureLoader, solidity, createMockProvider, deployContract} from 'ethereum-waffle';
import ERC1077 from '../../../build/ERC1077.json';
import MockNFToken from '../../../build/MockNFToken.json';
import basicWallet from '../../fixtures/basicWallet';
import walletMasterAndProxy from '../../fixtures/walletMasterAndProxy';
import {Contract, constants, Wallet} from 'ethers';

chai.use(chaiAsPromised);
chai.use(solidity);

describe('ERC1077 unified', async  () => {
  let walletContract : Contract;
  let publicKey : string;
  let proxyAsWalletContract;
  let loadFixture : ReturnType<typeof createFixtureLoader>;
  let wallet: Wallet;
  let erc721Contract : Contract;
  let destWalletContract : Contract;

  before(async () => {
    loadFixture = await createFixtureLoader(createMockProvider());
  });

  async function deployNFToken(deployWallet: Wallet) {
    erc721Contract = await deployContract(deployWallet, MockNFToken);
    destWalletContract = await deployContract(deployWallet, ERC1077, [publicKey]);
  }

  async function erc1077() {
    ({walletContract, publicKey, wallet} = await loadFixture(basicWallet));
    proxyAsWalletContract = walletContract;
    await deployNFToken(wallet);
  }

  async function erc1077Master() {
    ({proxyAsWalletContract, publicKey, wallet} = await loadFixture(walletMasterAndProxy));
    walletContract = proxyAsWalletContract;
    await deployNFToken(wallet);
  }

  [erc1077, erc1077Master].forEach((configuration) => {
    describe(configuration.name, () => {
      beforeEach(async () => {
        await configuration();
      });

      it('construction', async () => {
        expect(await walletContract.lastNonce()).to.eq(0);
        expect(await walletContract.keyExist(publicKey)).to.be.true;
        expect(await walletContract.keyExist(constants.AddressZero)).to.be.false;
      });

      ['transferFrom', 'safeTransferFrom'].forEach((functionName, index) => {
        describe(`ERC721 ${functionName}`, () => {
          it(`accept ERC721 ${functionName}`, async () => {
            await erc721Contract.mint(wallet.address, index);
            await erc721Contract[functionName](wallet.address, destWalletContract.address, index);
            expect(await erc721Contract.balanceOf(destWalletContract.address)).to.eq(1);
          });
        });
      });
    });
  });
});