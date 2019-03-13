import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import ENSRegistered from '../../build/ENSRegistered';
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
  let identity;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = await getWallets(provider);
    ensBuilder = new ENSBuilder(wallet);
    const ensAddress = await ensBuilder.bootstrapWith('mylogin', 'eth');
    provider = withENS(provider, ensAddress);
    const registrar = ensBuilder.registrars[domain].address;
    const args = [hashLabel, name, node, ensBuilder.ens.address, registrar, ensBuilder.resolver.address];
    identity = await deployContract(wallet, ENSRegistered, args);
  });

  it('resolves to given address', async () => {
    expect(await provider.resolveName('alex.mylogin.eth')).to.eq(identity.address);
    expect(await lookupAddress(provider, identity.address, ensBuilder.resolver.address)).to.eq('alex.mylogin.eth');
  });
});
