import {expect} from 'chai';
import TestableENSUtils from '../../../build/TestableENSUtils.json';
import {deployContract, loadFixture} from 'ethereum-waffle';
import {utils, providers, Wallet, Contract} from 'ethers';
import {lookupAddress} from '../../helpers/lookupAddress';
import {basicENS} from '@universal-login/commons/testutils';


const domain = 'mylogin.eth';
const label = 'alex';
const hashLabel = utils.keccak256(utils.toUtf8Bytes(label));
const name = `${label}.${domain}`;
const node = utils.namehash(name);

describe('Contract: ENSUtils', async () => {
  let provider: providers.Provider;
  let wallet: Wallet;
  let ensRegisteredContract: Contract;
  let publicResolver: string;
  let registrarAddress: string;
  let ensAddress: string;
  let args: string[];

  beforeEach(async () => {
    ({provider, publicResolver, registrarAddress, ensAddress, wallet} = await loadFixture(basicENS));
    args = [hashLabel, name, node, ensAddress, registrarAddress, publicResolver];
    ensRegisteredContract = await deployContract(wallet, TestableENSUtils);
  });

  it('resolves to given address', async () => {
    await ensRegisteredContract.registerENSUnderTests(...args);
    expect(await provider.resolveName(name)).to.eq(ensRegisteredContract.address);
    expect(await lookupAddress(provider, ensRegisteredContract.address, publicResolver)).to.eq(name);
  });
});
