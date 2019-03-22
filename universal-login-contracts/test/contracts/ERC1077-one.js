import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {getWallets, loadFixture, solidity} from 'ethereum-waffle';
import basicWallet, {transferMessage} from '../fixtures/basicWallet';
import walletMasterAndProxy from '../fixtures/walletMasterAndProxy';
import {calculateMessageSignature} from '../../lib/calculateMessageSignature';
import {utils} from 'ethers';
import ERC1077MasterCopy from '../../build/ERC1077MasterCopy';
import {getExecutionArgs} from '../utils';

chai.use(chaiAsPromised);
chai.use(solidity);

/* TODO
 * remove unused variables
 * move basicWallet to ts
 * move walletMasterAndProxy to ts
 * move current file to ts
 * rename identity -> walletContract

 */

describe('ERC1077 unifed', async  () => {
  let provider;
  let identity ;
  let privateKey;
  let keyAsAddress;
  let publicKey;
  let signature;
  let msg;
  let mockContract;
  let wallet;
  let mockToken;
  let anotherWallet;
  let invalidSignature;
  let relayerBalance;
  let relayerTokenBalance;
  let sortedKeys;
  let proxyAsIdentity;

  let identityMaster;
  let identityProxy;
  let changeMasterCopyFunc;
  let executeSignedFunc;
  let data;

  async function erc1077() {
    ({provider, identity, privateKey, sortedKeys, keyAsAddress, publicKey, mockToken, mockContract, wallet} = await loadFixture(basicWallet));
    msg = {...transferMessage, from: identity.address};
    signature = await calculateMessageSignature(privateKey, msg);
    [anotherWallet] = await getWallets(provider);
    invalidSignature = await calculateMessageSignature(anotherWallet.privateKey, msg);
    relayerBalance = await wallet.getBalance();
    relayerTokenBalance = await mockToken.balanceOf(wallet.address);
    proxyAsIdentity = identity;
  }

  async function erc1077Master() {
    ({provider, identityMaster, identityProxy, proxyAsIdentity, privateKey, keyAsAddress, publicKey, mockToken, mockContract, wallet} = await loadFixture(walletMasterAndProxy));
    changeMasterCopyFunc = new utils.Interface(ERC1077MasterCopy.interface).functions.changeMasterCopy;
    executeSignedFunc = new utils.Interface(ERC1077MasterCopy.interface).functions.executeSigned;
    msg = {...transferMessage, from: identityProxy.address};
    signature = await calculateMessageSignature(privateKey, msg);
    data = executeSignedFunc.encode([...getExecutionArgs(msg), signature]);
    [anotherWallet] = await getWallets(provider);
    invalidSignature = await calculateMessageSignature(anotherWallet.privateKey, msg);
    relayerBalance = await wallet.getBalance();
    relayerTokenBalance = await mockToken.balanceOf(wallet.address);
    identity = proxyAsIdentity;
  };

  [erc1077, erc1077Master].forEach((configuration) => {
    describe(configuration.name, () => {
      beforeEach(async () => {
        await configuration();
      });

      it('construction', async () => {
        expect(await identity.lastNonce()).to.eq(0);
        expect(await identity.keyExist(publicKey)).to.be.true;
        expect(await identity.keyExist('0x0000000000000000000000000000000000000000')).to.be.false;
      });
    });
  });
});