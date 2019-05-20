import {expect} from 'chai';
import ENSRegistered from '../../build/ENSRegistered';
import {deployContract, loadFixture} from 'ethereum-waffle';
import {utils} from 'ethers';
import {lookupAddress} from '../utils';
import {basicENS} from '@universal-login/commons/test';


const domain = 'mylogin.eth';
const label = 'alex';
const hashLabel = utils.keccak256(utils.toUtf8Bytes(label));
const name = `${label}.${domain}`;
const node = utils.namehash(name);

describe('WalletContract', async () => {
  let provider;
  let wallet;
  let ensRegisteredContract;
  let publicResolver;
  let registrarAddress;
  let ensAddress;
  let args;

  beforeEach(async () => {
    ({provider, publicResolver, registrarAddress, ensAddress, wallet} = await loadFixture(basicENS));
    args = [hashLabel, name, node, ensAddress, registrarAddress, publicResolver];
    ensRegisteredContract = await deployContract(wallet, ENSRegistered);
  });
  
  it('resolves to given address', async () => {
    await ensRegisteredContract.registerENS(...args);
    expect(await provider.resolveName(name)).to.eq(ensRegisteredContract.address);
    expect(await lookupAddress(provider, ensRegisteredContract.address, publicResolver)).to.eq(name);
  });
});
