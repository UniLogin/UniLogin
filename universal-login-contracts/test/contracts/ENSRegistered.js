import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import WalletMaster from '../../build/WalletMaster';
import Proxy from '../../build/Proxy';
import ENSBuilder from 'ens-builder';
import {createMockProvider, deployContract, getWallets, solidity} from 'ethereum-waffle';
import {utils} from 'ethers';
import {lookupAddress, withENS} from '../utils';


chai.use(chaiAsPromised);
chai.use(solidity);

const domain = 'mylogin.eth';
const label = 'alex';
const hashLabel = utils.keccak256(utils.toUtf8Bytes(label));
const name = `${label}.${domain}`;
const node = utils.namehash(name);

describe('WalletContract contract', async () => {
  let provider;
  let wallet;
  let ensBuilder;
  let identityProxy;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = await getWallets(provider);
    ensBuilder = new ENSBuilder(wallet);
    const ensAddress = await ensBuilder.bootstrapWith('mylogin', 'eth');
    provider = withENS(provider, ensAddress);
    const registrar = ensBuilder.registrars[domain].address;
    const args = [hashLabel, name, node, ensBuilder.ens.address, registrar, ensBuilder.resolver.address];
    const identityMaster = await deployContract(wallet, WalletMaster);
    const initData = new utils.Interface(WalletMaster.interface).functions.initializeWithENS.encode([wallet.address, ...args]);
    identityProxy = await deployContract(wallet, Proxy, [identityMaster.address, initData]);
  });

  it('resolves to given address', async () => {
    expect(await provider.resolveName('alex.mylogin.eth')).to.eq(identityProxy.address);
    expect(await lookupAddress(provider, identityProxy.address, ensBuilder.resolver.address)).to.eq('alex.mylogin.eth');
  });
});
